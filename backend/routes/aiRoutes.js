const express = require('express')
const router = express.Router()
const { GoogleGenerativeAI } = require('@google/generative-ai')
const protect = require('../middleware/auth')
require('dotenv').config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)


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
        
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

        const result = await model.generateContent(prompt)
        const response = await result.response
        const question = response.text()

        res.json({ question })

    } catch (err) {
        console.log('ai review error:', err.message)
        console.log('gemini error details:', err)
        res.status(500).json({ message: 'something went wrong with ai review' })
    }
})


module.exports = router