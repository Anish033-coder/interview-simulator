const express = require('express')
const router = express.Router()
const axios = require('axios')
require('dotenv').config()

const languageIds = {
    javascript: 63,
    python: 71,
    java: 62,
    cpp: 54
}


router.post('/', async (req, res) => {
    const code = req.body.code
    const language = req.body.language
    const stdin = req.body.stdin || ''

    if (!code || !language) {
        return res.status(400).json({ message: 'code and language are required' })
    }

    const langId = languageIds[language]
    if (!langId) {
        return res.status(400).json({ message: 'unsupported language' })
    }

    try {
        const submitResponse = await axios.post(
            `${process.env.JUDGE0_URL}/submissions`,
            {
                source_code: code,
                language_id: langId,
                stdin: stdin
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                },
                params: {
                    base64_encoded: 'false',
                    wait: 'false'
                }
            }
        )

        const token = submitResponse.data.token
        console.log('judge0 submission token:', token)

        let result = null
        let attempts = 0
        const maxAttempts = 10

        while (attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 1000))

            const resultResponse = await axios.get(
                `${process.env.JUDGE0_URL}/submissions/${token}`,
                {
                    headers: {
                        'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
                        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                    },
                    params: {
                        base64_encoded: 'false'
                    }
                }
            )

            result = resultResponse.data
            console.log('judge0 status:', result.status.description)

            if (result.status.id !== 1 && result.status.id !== 2) {
                break
            }

            attempts++
        }

        if (!result) {
            return res.status(500).json({ message: 'code execution timed out' })
        }

        res.json({
            stdout: result.stdout || '',
            stderr: result.stderr || '',
            compile_output: result.compile_output || '',
            status: result.status.description,
            time: result.time,
            memory: result.memory
        })

    } catch (err) {
        console.log('execute error:', err.message)
        res.status(500).json({ message: 'something went wrong with code execution' })
    }
})


module.exports = router