const express = require('express')
const router = express.Router()
const axios = require('axios')
const pool = require('../config/db')
require('dotenv').config()


const languageMap = {
    javascript: 'javascript',
    python: 'python',
    java: 'java',
    cpp: 'cpp'
}

const fileNames = {
    javascript: 'main.js',
    python: 'main.py',
    java: 'Main.java',
    cpp: 'main.cpp'
}


async function runOnGlot(code, language, stdin) {
    const glotLanguage = languageMap[language]

    const response = await axios.post(
        `https://glot.io/api/run/${glotLanguage}/latest`,
        {
            files: [
                {
                    name: fileNames[language],
                    content: code
                }
            ],
            stdin: stdin
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${process.env.GLOT_API_TOKEN}`
            }
        }
    )

    return response.data
}


router.post('/', async (req, res) => {
    const code = req.body.code
    const language = req.body.language
    const stdin = req.body.stdin || ''

    if (!code || !language) {
        return res.status(400).json({ message: 'code and language are required' })
    }

    if (!languageMap[language]) {
        return res.status(400).json({ message: 'unsupported language' })
    }

    try {
        const data = await runOnGlot(code, language, stdin)

        res.json({
            stdout: data.stdout || '',
            stderr: data.stderr || data.error || '',
            compile_output: '',
            status: data.stderr || data.error ? 'Error' : 'Executed'
        })

    } catch (err) {
        console.log('execute error:', err.message)
        res.status(500).json({ message: 'something went wrong with code execution' })
    }
})


router.post('/submit', async (req, res) => {
    const code = req.body.code
    const language = req.body.language
    const problemId = req.body.problemId

    if (!code || !language || !problemId) {
        return res.status(400).json({ message: 'code, language and problemId are required' })
    }

    if (!languageMap[language]) {
        return res.status(400).json({ message: 'unsupported language' })
    }

    try {
        const result = await pool.query(
            'SELECT test_cases FROM problems WHERE id = $1',
            [problemId]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'problem not found' })
        }

        const testCases = JSON.parse(result.rows[0].test_cases)

        const testResults = []
        let passedCount = 0


        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i]

            const data = await runOnGlot(code, language, testCase.input)
            const actualOutput = (data.stdout || '').trim()
            const expectedOutput = (testCase.expected_output || '').trim()

            const passed = actualOutput === expectedOutput

            if (passed) {
                passedCount++
            }

            testResults.push({
                testCaseNumber: i + 1,
                input: testCase.input,
                expectedOutput: expectedOutput,
                actualOutput: actualOutput,
                passed: passed,
                stderr: data.stderr || data.error || ''
            })
        }

        res.json({
            results: testResults,
            passed: passedCount,
            total: testCases.length
        })

    } catch (err) {
        console.log('submit error:', err.message)
        res.status(500).json({ message: 'something went wrong while checking your solution' })
    }
})


module.exports = router