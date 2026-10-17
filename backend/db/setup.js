const fs = require('node:fs')
const path = require('node:path')
const pool = require('../config/db')
async function setup() {
  try {
    await pool.query(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'))
    console.log('Created initial schema. Run npm run db:seed once to add problems.')
  } catch (error) {
    console.error('Schema setup failed:', error.message)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}
setup()
