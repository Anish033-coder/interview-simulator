// tests for the /api/sessions/end route
// this route is PROTECTED - it needs req.user to exist
// instead of logging in for real, we mock the auth middleware
// so it always pretends user id 1 is logged in

const request = require('supertest')
const pool = require('../config/db')

// mock the auth middleware before requiring app
// this replaces the real protect function with a fake one
// that just sets req.user and calls next(), skipping jwt verification entirely
jest.mock('../middleware/auth', () => {
    return (req, res, next) => {
        req.user = { id: 1, email: 'anish@test.com' }
        next()
    }
})

const app = require('../app')

jest.spyOn(pool, 'query')

afterAll(async () => {
    await pool.end()
})

afterEach(() => {
    jest.clearAllMocks()
})


describe('POST /api/sessions/end', () => {

    test('saves time taken and test results correctly', async () => {
        // first query is the "does this session belong to this user" check
        // second query is the actual UPDATE
        pool.query
            .mockResolvedValueOnce({ rows: [{ id: 5 }] })  // session found
            .mockResolvedValueOnce({ rows: [] })            // update succeeded

        const res = await request(app)
            .post('/api/sessions/end')
            .send({
                sessionId: 5,
                finalCode: 'print("done")',
                timeTaken: 1800,
                testCasesPassed: 3,
                testCasesTotal: 5
            })

        expect(res.status).toBe(200)
        expect(res.body.message).toBe('session ended')

        // check that the UPDATE query was actually called with the right values
        // pool.query.mock.calls[1] is the second call (the UPDATE one)
        const updateCallArgs = pool.query.mock.calls[1]
        const updateValues = updateCallArgs[1]  // second argument is the values array

        expect(updateValues).toContain(1800)  // timeTaken
        expect(updateValues).toContain(3)     // testCasesPassed
        expect(updateValues).toContain(5)     // testCasesTotal
    })


    test('returns 404 when session does not belong to this user', async () => {
        // simulate the ownership check finding nothing
        pool.query.mockResolvedValueOnce({ rows: [] })

        const res = await request(app)
            .post('/api/sessions/end')
            .send({
                sessionId: 999,
                finalCode: 'print(1)',
                timeTaken: 100
            })

        expect(res.status).toBe(404)
    })


    test('returns 400 when sessionId is missing', async () => {
        const res = await request(app)
            .post('/api/sessions/end')
            .send({
                finalCode: 'print(1)',
                timeTaken: 100
                // no sessionId on purpose
            })

        expect(res.status).toBe(400)
    })

})