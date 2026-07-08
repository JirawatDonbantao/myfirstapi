require('dotenv').config()
const pool = require('./db')
const express = require('express')
const axios = require('axios')
const cors = require('cors')
const app = express()

const PORT = process.env.PORT || 3000
const APP_NAME = process.env.APP_NAME || 'API'
const SECRET_MESSAGE = process.env.SECRET_MESSAGE || 'ไม่มีข้อความ'

app.use(cors())
app.use(express.json())

// ✅ Middleware ต้องอยู่ก่อน Route ทุกตัว
app.use((req, res, next) => {
  const time = new Date().toISOString()
  console.log(`[${time}] ${req.method} ${req.url}`)
  next()
})

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

app.get('/secret', (req, res) => {
  res.json({ secret: SECRET_MESSAGE })
})

app.get('/error-test', (req, res) => {
  throw new Error('นี่คือ Error จำลองสำหรับทดสอบ!')
})

// Route Weather (เพิ่มการบันทึกประวัติอัตโนมัติ)
app.get('/weather/:city', async (req, res) => {
  const city = req.params.city
  const apiKey = process.env.WEATHER_API_KEY
  console.log(`มีคนขอข้อมูลอากาศเมือง: ${city}`)
  try {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
    )
    const data = response.data

    // ✅ บันทึกประวัติการค้นหาอัตโนมัติ
    pool.query(
      'INSERT INTO search_history (city) VALUES ($1)',
      [data.location.name]
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
    res.status(500).json({ status: 'error', message: error.message })
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
    console.error(`❌ Database Error: ${error.message}`)
    res.status(500).json({ status: 'error', message: error.message })
  }
})

// Error Handler ต้องอยู่หลัง Route ทั้งหมด
app.use((err, req, res, next) => {
  console.error(`❌ Error: ${err.message}`)
  res.status(500).json({ status: 'error', message: err.message })
})

// app.listen ต้องอยู่ล่างสุดของไฟล์เสมอ
app.listen(PORT, () => {
  console.log(`✅ ${APP_NAME} รันอยู่ที่ Port ${PORT}`)
})