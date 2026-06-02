const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

pool.connect((err, client, release) => {
    if (err) {
        console.log('database connection failed:', err.message)
        return
    }
    console.log('database connected')
    release()
})

module.exports = pool