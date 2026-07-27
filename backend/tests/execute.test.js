
const request = require('supertest')
const axios = require('axios')
const app = require('../app')


jest.mock('axios')

const pool = require('../config/db')

afterAll(async () => {
    await pool.end()
})


describe('POST /api/execute', () => {

    afterEach(() => {
        jest.clearAllMocks()
    })


    test('returns stdout and status Executed when code runs with no errors', async () => {

        axios.post.mockResolvedValue({
            data: {
                stdout: 'hello world\n',
                stderr: '',
                error: ''
            }
        })

        const res = await request(app)
            .post('/api/execute')
            .send({
                code: 'print("hello world")',
                language: 'python',
                stdin: ''
            })

        expect(res.status).toBe(200)
        expect(res.body.stdout).toBe('hello world\n')
        expect(res.body.status).toBe('Executed')
    })


    test('returns status Error when code produces stderr', async () => {
        axios.post.mockResolvedValue({
            data: {
                stdout: '',
                stderr: 'NameError: name x is not defined',
                error: ''
            }
        })

        const res = await request(app)
            .post('/api/execute')
            .send({
                code: 'print(x)',
                language: 'python',
                stdin: ''
            })

        expect(res.status).toBe(200)
        expect(res.body.status).toBe('Error')
        expect(res.body.stderr).toContain('NameError')
    })


    test('returns 400 when code is missing', async () => {
        const res = await request(app)
            .post('/api/execute')
            .send({
                language: 'python'

            })

        expect(res.status).toBe(400)
    })


    test('returns 400 when language is unsupported', async () => {
        const res = await request(app)
            .post('/api/execute')
            .send({
                code: 'print(1)',
                language: 'ruby'  
            })

        expect(res.status).toBe(400)
    })

})