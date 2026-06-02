
const jwt = require('jsonwebtoken')
require('dotenv').config()

function protect(req, res, next) {
    const token = req.cookies.token


    if (!token) {
        return res.status(401).json({ message: 'please login first' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded

        next()

    } catch (err) {
        console.log('auth error:', err.message)
        return res.status(401).json({ message: 'session expired, please login again' })
    }
}

module.exports = protect