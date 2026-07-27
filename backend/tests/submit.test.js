// tests for the /api/execute/submit route
// this route does two things we need to fake:
// 1. queries postgres to get the test cases for a problem
// 2. calls glot.io to run the code against each test case
//
// we mock both so tests dont touch the real database or the real glot.io

const request = require('supertest')
const axios = require('axios')
const app = require('../app')
const pool = require('../config/db')

jest.mock('axios')

// this replaces pool.query with a fake function we control per test
jest.spyOn(pool, 'query')

afterAll(async () => {
    await pool.end()
})

afterEach(() => {
    jest.clearAllMocks()
})


describe('POST /api/execute/submit', () => {

    test('returns passed 2 total 2 when both test cases match expected output', async () => {
        // fake what the database would return for test_cases
        pool.query.mockResolvedValue({
            rows: [
                {
                    test_cases: JSON.stringify([
                        { input: '2\n3', expected_output: '5' },
                        { input: '10\n20', expected_output: '30' }
                    ])
                }
            ]
        })

        // fake glot.io returning the correct output both times
        // mockResolvedValueOnce lets us return a DIFFERENT value each call
        axios.post
            .mockResolvedValueOnce({ data: { stdout: '5\n', stderr: '' } })
            .mockResolvedValueOnce({ data: { stdout: '30\n', stderr: '' } })

        const res = await request(app)
            .post('/api/execute/submit')
            .send({
                problemId: 1,
                language: 'python',
                code: 'a,b = int(input()), int(input()); print(a+b)'
            })

        expect(res.status).toBe(200)
        expect(res.body.passed).toBe(2)
        expect(res.body.total).toBe(2)
        expect(res.body.results[0].passed).toBe(true)
        expect(res.body.results[1].passed).toBe(true)
    })


    test('correctly marks a test case as failed when output does not match', async () => {
        pool.query.mockResolvedValue({
            rows: [
                {
                    test_cases: JSON.stringify([
                        { input: '2\n3', expected_output: '5' }
                    ])
                }
            ]
        })

        // simulate broken code that returns nothing
        axios.post.mockResolvedValueOnce({ data: { stdout: '', stderr: '' } })

        const res = await request(app)
            .post('/api/execute/submit')
            .send({
                problemId: 1,
                language: 'python',
                code: 'a,b = int(input()), int(input())'
                // notice this code never prints anything - a real bug
            })

        expect(res.status).toBe(200)
        expect(res.body.passed).toBe(0)
        expect(res.body.total).toBe(1)
        expect(res.body.results[0].passed).toBe(false)
        expect(res.body.results[0].actualOutput).toBe('')
        expect(res.body.results[0].expectedOutput).toBe('5')
    })


    test('returns 404 when problem does not exist', async () => {
        // simulate the database finding nothing
        pool.query.mockResolvedValue({ rows: [] })

        const res = await request(app)
            .post('/api/execute/submit')
            .send({
                problemId: 9999,
                language: 'python',
                code: 'print(1)'
            })

        expect(res.status).toBe(404)
    })


    test('returns 400 when problemId is missing', async () => {
        const res = await request(app)
            .post('/api/execute/submit')
            .send({
                language: 'python',
                code: 'print(1)'
                // no problemId on purpose
            })

        expect(res.status).toBe(400)
    })

})