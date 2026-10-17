const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

// pg opens connections lazily when a route or seed script queries the pool.
module.exports = pool
