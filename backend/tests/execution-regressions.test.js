jest.mock('axios')
jest.mock('../config/db', () => ({ query: jest.fn() }))
const request = require('supertest')
const axios = require('axios')
const pool = require('../config/db')
const app = require('../app')
beforeEach(() => jest.resetAllMocks())
test.each([
  { stdout: '5', stderr: 'Traceback: failed', error: '' },
  { stdout: '5', stderr: '', error: 'Runtime error' },
  { stdout: '', stderr: '', error: 'Compilation failed' }
])('does not pass matching output when execution fails: %j', async data => {
  pool.query.mockResolvedValue({ rows: [{ test_cases: JSON.stringify([{ input: '', expected_output: data.stdout }]) }] })
  axios.post.mockResolvedValue({ data })
  const result = await request(app).post('/api/execute/submit').send({ code: 'broken', language: 'python', problemId: 1 })
  expect(result.status).toBe(200)
  expect(result.body.passed).toBe(0)
})
test.each(['constructor', 'toString', '__proto__'])('rejects inherited property language %s without calling glot', async language => {
  const result = await request(app).post('/api/execute').send({ code: 'print(1)', language })
  expect(result.status).toBe(400)
  expect(axios.post).not.toHaveBeenCalled()
})
test.each(['/api/execute', '/api/execute/submit'])('returns 504 on execution timeout at %s', async route => {
  pool.query.mockResolvedValue({ rows: [{ test_cases: JSON.stringify([{ input: '', expected_output: '1' }]) }] })
  axios.post.mockRejectedValue(Object.assign(new Error('timeout'), { code: 'ECONNABORTED' }))
  const result = await request(app).post(route).send({ code: 'while True: pass', language: 'python', problemId: 1 })
  expect(result.status).toBe(504)
  expect(axios.post.mock.calls[0][2].timeout).toBe(10000)
})
test('rejects non-string code', async () => {
  const result = await request(app).post('/api/execute').send({ code: { text: 'print(1)' }, language: 'python' })
  expect(result.status).toBe(400)
  expect(axios.post).not.toHaveBeenCalled()
})

test.each([
  ['development', false, 'Lax'],
  ['production', true, 'None']
])('cookie flags match %s and logout clears the same cookie', async (environment, secure, sameSite) => {
  const previous = process.env.NODE_ENV
  try {
    process.env.NODE_ENV = environment
    const result = await request(app).post('/api/auth/logout')
    const cookie = result.headers['set-cookie'][0]
    expect(cookie.includes('Secure')).toBe(secure)
    expect(cookie).toContain(`SameSite=${sameSite}`)
    expect(cookie).toContain('HttpOnly')
    expect(cookie).toContain('Max-Age=0')
  } finally { process.env.NODE_ENV = previous }
})
