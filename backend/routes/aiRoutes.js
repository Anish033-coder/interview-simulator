const express = require('express')
const router = express.Router()
const axios = require('axios')
const protect = require('../middleware/auth')
require('dotenv').config()


router.post('/review', protect, async (req, res) => {
    const code = req.body.code
    const problemTitle = req.body.problemTitle
    const problemDescription = req.body.problemDescription

    if (!code || !problemTitle) {
        return res.status(400).json({ message: 'code and problem title are required' })
    }

    const prompt = `You are a senior software engineer conducting a technical interview.

The candidate is solving this problem:
Problem: ${problemTitle}
Description: ${problemDescription}

This is their current code:
${code}

Your job is to ask ONE short follow-up question about their code.
Focus on time complexity, space complexity, or edge cases.
Never give away the answer or suggest improvements directly.
Just ask one question, nothing else. No greeting, no explanation.`

    try {
        const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: 'claude-sonnet-4-20250514',
                max_tokens: 150,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.CLAUDE_API_KEY,
                    'anthropic-version': '2023-06-01'
                }
            }
        )

        const question = response.data.content[0].text

        res.json({ question })

    } catch (err) {
        console.log('ai review error:', err.message)
        res.status(500).json({ message: 'something went wrong with ai review' })
    }
})


module.exports = router