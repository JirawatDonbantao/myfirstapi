require('dotenv').config()
const pool = require('./db')
const express = require('express')
const axios = require('axios')
const cors = require('cors')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const APP_NAME = process.env.APP_NAME || 'API'
const SECRET_MESSAGE = process.env.SECRET_MESSAGE || 'ไม่มีข้อความ'

app.use(cors({
  origin: process.env.FRONTEND_URL // เก็บ URL frontend ไว้ใน env variable
}))

app.use(express.json())

// ✅ Middleware ต้องอยู่ก่อน Route ทุกตัว
app.use((req, res, next) => {
  const time = new Date().toISOString()
  console.log(`[${time}] ${req.method} ${req.url}`)
  next()
})

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ status: 'error', message: 'กรุณาล็อกอิน' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Token ไม่ถูกต้องหรือหมดอายุ' })
  }
}

function optionalAuthenticate(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    req.user = null // ไม่มี token = ไม่รู้ว่าใครค้น แต่ยังทำงานต่อได้
    return next()
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // มี token ถูกต้อง = รู้ว่าใครค้น
  } catch (error) {
    req.user = null // token ผิด/หมดอายุ = ถือว่าไม่ได้ login แต่ไม่ปฏิเสธ request
  }

  next() // ไม่ว่าจะมี user หรือไม่ ก็ทำงานต่อเสมอ
}

// Routes ทั้งหมด
app.get('/', (req, res) => {
  res.json({ app: APP_NAME, message: 'ทำงานได้แล้ว', status: 'ok' })
})

app.get('/time', (req, res) => {
  res.json({ time: new Date().toISOString(), message: 'เวลาปัจจุบัน' })
})

app.get('/hello/:name', (req, res) => {
  const name = req.params.name
  res.json({ message: `สวัสดี ${name}!` })
})

app.get('/secret', authenticate, (req, res) => {
  res.json({ secret: SECRET_MESSAGE, requestedBy: req.user.username })
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ status: 'error', message: 'กรุณากรอก username และ password' })
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10)

    const result = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
      [username, passwordHash]
    )

    res.status(201).json({ status: 'ok', user: result.rows[0] })
  } catch (error) {
    console.error(`❌ Register Error: ${error.message}`)
    if (error.code === '23505') {
      return res.status(409).json({ status: 'error', message: 'มีชื่อผู้ใช้นี้อยู่แล้ว' })
    }
    res.status(500).json({ status: 'error', message: 'เกิดข้อผิดพลาด กรุณาลองใหม่ภายหลัง' })
  }
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ status: 'error', message: 'กรุณากรอก username และ password' })
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username])
    const user = result.rows[0]

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' })
    }

    const isMatch = await bcrypt.compare(password, user.password_hash)

    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' })
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ status: 'ok', token })
  } catch (error) {
    console.error(`❌ Login Error: ${error.message}`)
    res.status(500).json({ status: 'error', message: 'เกิดข้อผิดพลาด กรุณาลองใหม่ภายหลัง' })
  }
})

app.get('/error-test', (req, res) => {
  throw new Error('นี่คือ Error จำลองสำหรับทดสอบ!')
})

// Route Weather (เพิ่มการบันทึกประวัติอัตโนมัติ)
app.get('/weather/:city', optionalAuthenticate, async (req, res) => {
  const city = req.params.city
  const apiKey = process.env.WEATHER_API_KEY
  console.log(`มีคนขอข้อมูลอากาศเมือง: ${city}`)
  try {
    const response = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
    )
    const data = response.data

    const userId = req.user ? req.user.userId : null

    pool.query(
      'INSERT INTO search_history (city, user_id) VALUES ($1, $2)',
      [data.location.name, userId]
    ).catch(err => console.error(`❌ บันทึกประวัติไม่สำเร็จ: ${err.message}`))

    res.json({
      city: data.location.name,
      country: data.location.country,
      temp_c: data.current.temp_c,
      feels_like: data.current.feelslike_c,
      humidity: data.current.humidity,
      wind_kph: data.current.wind_kph,
      condition: data.current.condition.text,
      icon: data.current.condition.icon
    })
  } catch (error) {
    console.error(`❌ Weather Error: ${error.message}`)
    res.status(404).json({
      status: 'error',
      message: `ไม่พบข้อมูลเมือง "${city}"`
    })
  }
})

// บันทึกประวัติการค้นหาแบบ Manual (ยังเก็บไว้ใช้ทดสอบได้)
app.post('/history', async (req, res) => {
  const { city } = req.body

  if (!city) {
    return res.status(400).json({ status: 'error', message: 'กรุณาระบุชื่อเมือง' })
  }

  try {
    const result = await pool.query(
      'INSERT INTO search_history (city) VALUES ($1) RETURNING *',
      [city]
    )
    console.log(`บันทึกประวัติ: ${city}`)
    res.json(result.rows[0])
  } catch (error) {
    console.error(`❌ Database Error: ${error.message}`)
    res.status(500).json({ status: 'error', message: 'เกิดข้อผิดพลาด กรุณาลองใหม่ภายหลัง' })
  }
})

// ดึงประวัติการค้นหาล่าสุด 5 รายการ
app.get('/history', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM search_history ORDER BY searched_at DESC LIMIT 5'
    )
    res.json(result.rows)
  } catch (error) {
  console.error(`❌ Database Error: ${error.message}`) // log ไว้ฝั่ง server เท่านั้น
  res.status(500).json({ status: 'error', message: 'เกิดข้อผิดพลาด กรุณาลองใหม่ภายหลัง' }) // ข้อความทั่วไปให้ user
}
})

// Error Handler ต้องอยู่หลัง Route ทั้งหมด
app.use((err, req, res, next) => {
  console.error(`❌ Error: ${err.message}`)
  res.status(500).json({ status: 'error', message: 'เกิดข้อผิดพลาดของระบบ กรุณาลองใหม่ภายหลัง' })
})


module.exports = app