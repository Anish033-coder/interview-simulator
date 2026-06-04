const express = require('express')
const router = express.Router()
const pool = require('../config/db')
const protect = require('../middleware/auth')


router.post('/start', protect, async (req, res) => {
    const problemId = req.body.problemId
    const language = req.body.language

    if (!problemId || !language) {
        return res.status(400).json({ message: 'problem id and language are required' })
    }

    try {
        const result = await pool.query(
            `INSERT INTO sessions (user_id, problem_id, language, status)
             VALUES ($1, $2, $3, 'ongoing') RETURNING id`,
            [req.user.id, problemId, language]
        )

        const sessionId = result.rows[0].id
        console.log('new session started:', sessionId)

        res.status(201).json({ sessionId })

    } catch (err) {
        console.log('start session error:', err.message)
        res.status(500).json({ message: 'something went wrong' })
    }
})


router.post('/message', protect, async (req, res) => {
    const sessionId = req.body.sessionId
    const message = req.body.message
    const codeSnapshot = req.body.codeSnapshot

    if (!sessionId || !message) {
        return res.status(400).json({ message: 'session id and message are required' })
    }

    try {
        const sessionCheck = await pool.query(
            'SELECT id FROM sessions WHERE id = $1 AND user_id = $2',
            [sessionId, req.user.id]
        )

        if (sessionCheck.rows.length === 0) {
            return res.status(404).json({ message: 'session not found' })
        }

        await pool.query(
            `INSERT INTO ai_messages (session_id, message, code_snapshot)
             VALUES ($1, $2, $3)`,
            [sessionId, message, codeSnapshot]
        )

        res.json({ message: 'message saved' })

    } catch (err) {
        console.log('save message error:', err.message)
        res.status(500).json({ message: 'something went wrong' })
    }
})


router.post('/end', protect, async (req, res) => {
    const sessionId = req.body.sessionId
    const finalCode = req.body.finalCode
    const timeTaken = req.body.timeTaken
    const testCasesPassed = req.body.testCasesPassed || 0
    const testCasesTotal = req.body.testCasesTotal || 0

    if (!sessionId) {
        return res.status(400).json({ message: 'session id is required' })
    }

    try {
        const sessionCheck = await pool.query(
            'SELECT id FROM sessions WHERE id = $1 AND user_id = $2',
            [sessionId, req.user.id]
        )

        if (sessionCheck.rows.length === 0) {
            return res.status(404).json({ message: 'session not found' })
        }

        await pool.query(
            `UPDATE sessions 
             SET final_code = $1, 
                 time_taken = $2, 
                 test_cases_passed = $3,
                 test_cases_total = $4,
                 status = 'completed',
                 ended_at = NOW()
             WHERE id = $5`,
            [finalCode, timeTaken, testCasesPassed, testCasesTotal, sessionId]
        )

        res.json({ message: 'session ended' })

    } catch (err) {
        console.log('end session error:', err.message)
        res.status(500).json({ message: 'something went wrong' })
    }
})


router.get('/report/:sessionId', protect, async (req, res) => {
    const sessionId = req.params.sessionId

    try {
        const sessionResult = await pool.query(
            `SELECT sessions.*, problems.title, problems.description, problems.difficulty, problems.topic
             FROM sessions
             JOIN problems ON sessions.problem_id = problems.id
             WHERE sessions.id = $1 AND sessions.user_id = $2`,
            [sessionId, req.user.id]
        )

        if (sessionResult.rows.length === 0) {
            return res.status(404).json({ message: 'session not found' })
        }

        const session = sessionResult.rows[0]

        const messagesResult = await pool.query(
            'SELECT * FROM ai_messages WHERE session_id = $1 ORDER BY created_at ASC',
            [sessionId]
        )

        res.json({
            session: {
                id: session.id,
                language: session.language,
                finalCode: session.final_code,
                timeTaken: session.time_taken,
                testCasesPassed: session.test_cases_passed,
                testCasesTotal: session.test_cases_total,
                status: session.status,
                startedAt: session.started_at,
                endedAt: session.ended_at
            },
            problem: {
                title: session.title,
                description: session.description,
                difficulty: session.difficulty,
                topic: session.topic
            },
            aiMessages: messagesResult.rows
        })

    } catch (err) {
        console.log('get report error:', err.message)
        res.status(500).json({ message: 'something went wrong' })
    }
})


router.get('/history', protect, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT sessions.id, sessions.language, sessions.status, 
                    sessions.time_taken, sessions.test_cases_passed, 
                    sessions.test_cases_total, sessions.started_at,
                    problems.title, problems.difficulty
             FROM sessions
             JOIN problems ON sessions.problem_id = problems.id
             WHERE sessions.user_id = $1
             ORDER BY sessions.started_at DESC`,
            [req.user.id]
        )

        res.json({ sessions: result.rows })

    } catch (err) {
        console.log('get history error:', err.message)
        res.status(500).json({ message: 'something went wrong' })
    }
})


module.exports = router