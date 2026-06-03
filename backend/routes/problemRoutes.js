const express = require('express')
const router = express.Router()
const pool = require('../config/db')


router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, title, difficulty, topic FROM problems ORDER BY id ASC'
        )

        if (result.rows.length === 0) {
            return res.json({ message: 'no problems found, seed the database first', problems: [] })
        }

        res.json({ problems: result.rows })

    } catch (err) {
        console.log('get problems error:', err.message)
        res.status(500).json({ message: 'something went wrong' })
    }
})


router.get('/:id', async (req, res) => {
    const problemId = req.params.id

    try {
        const result = await pool.query(
            'SELECT * FROM problems WHERE id = $1',
            [problemId]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'problem not found' })
        }

        const problem = result.rows[0]

        problem.examples = JSON.parse(problem.examples)
        problem.test_cases = JSON.parse(problem.test_cases)

        res.json({ problem })

    } catch (err) {
        console.log('get problem by id error:', err.message)
        res.status(500).json({ message: 'something went wrong' })
    }
})


module.exports = router