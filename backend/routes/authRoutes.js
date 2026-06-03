
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')
require('dotenv').config()


router.post('/register', async (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password


    if (!name || !email || !password) {
        return res.status(400).json({ message: 'all fields are required' })
    }

    try {

        const emailCheck = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        )

        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ message: 'email already registered' })
        }

         const hashedPassword = await bcrypt.hash(password, 10)

        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedPassword]
        )

        const newUser = result.rows[0]

        const token = jwt.sign(
            { id: newUser.id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(201).json({
            message: 'account created successfully',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        })

    } catch (err) {
    console.error(err);

    res.status(500).json({
        message: err.message
    });
}
})


router.post('/login', async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    if (!email || !password) {
        return res.status(400).json({ message: 'all fields are required' })
    }

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        )

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'wrong email or password' })
        }

        const user = result.rows[0]

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: 'wrong email or password' })
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.json({
            message: 'logged in successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })

    } catch (err) {
        console.log('login error:', err.message)
        res.status(500).json({ message: 'something went wrong' })
    }
})


/router.post('/logout', (req, res) => {
    res.cookie('token', '', { httpOnly: true, maxAge: 0 })
    res.json({ message: 'logged out successfully' })
})


router.get('/me', (req, res) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: 'not logged in' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        res.json({
            user: {
                id: decoded.id,
                email: decoded.email
            }
        })
    } catch (err) {
        res.status(401).json({ message: 'session expired' })
    }
})


module.exports = router