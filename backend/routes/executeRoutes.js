const express = require('express')
const router = express.Router()
const axios = require('axios')
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


router.post('/', async (req, res) => {
    const code = req.body.code
    const language = req.body.language
    const stdin = req.body.stdin || ''

    if (!code || !language) {
        return res.status(400).json({ message: 'code and language are required' })
    }

    const glotLanguage = languageMap[language]
    if (!glotLanguage) {
        return res.status(400).json({ message: 'unsupported language' })
    }

    try {
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

        const data = response.data

         res.json({
            stdout: data.stdout || '',
            stderr: data.stderr || data.error || '',
            compile_output: '',
            status: data.stderr || data.error ? 'Error' : 'Accepted'
        })

    } catch (err) {
        console.log('execute error:', err.message)
        res.status(500).json({ message: 'something went wrong with code execution' })
    }
})


module.exports = router