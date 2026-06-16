const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const db = require('./config/db')

const app = express()


app.use(cors({
    origin: [
        'http://localhost:5173',
        process.env.FRONTEND_URL
    ],
    credentials: true
}))


app.use(express.json())
app.use(cookieParser())


app.use('/api/auth', require('./routes/authRoutes'))

app.use('/api/problems', require('./routes/problemRoutes'))
app.use('/api/execute', require('./routes/executeRoutes'))
app.use('/api/ai', require('./routes/aiRoutes'))
app.use('/api/sessions', require('./routes/sessionRoutes'))


app.get('/api/health', (req, res) => {
    res.json({ message: 'server is running' })
})


const PORT = process.env.PORT || 5001

app.listen(PORT, () => {
    console.log('server started on port', PORT)
})