const { Pool } = require('pg')

// เชื่อมต่อฐานข้อมูลผ่าน DATABASE_URL ที่ตั้งไว้ใน Railway Variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

module.exports = pool