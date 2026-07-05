require('dotenv').config()

const express = require('express')
const axios = require('axios')        // ← รวมไว้บนสุด
const app = express()

const PORT = process.env.PORT || 3000
const APP_NAME = process.env.APP_NAME || 'API'
const SECRET_MESSAGE = process.env.SECRET_MESSAGE || 'ไม่มีข้อความ'

// ✅ Middleware ต้องอยู่ก่อน Route ทุกตัว
app.use((req, res, next) => {
  const time = new Date().toISOString()
  console.log(`[${time}] ${req.method} ${req.url}`)
  next()
})

// Routes ทั้งหมดอยู่หลัง Middleware
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

// Route Weather
app.get('/weather/:city', async (req, res) => {
  const city = req.params.city
  const apiKey = process.env.WEATHER_API_KEY
  console.log(`มีคนขอข้อมูลอากาศเมือง: ${city}`)
  try {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
    )
    const data = response.data
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

// Error Handler ต้องอยู่หลังสุดเสมอ
app.use((err, req, res, next) => {
  console.error(`❌ Error: ${err.message}`)
  res.status(500).json({ status: 'error', message: err.message })
})

app.listen(PORT, () => {
  console.log(`✅ ${APP_NAME} รันอยู่ที่ Port ${PORT}`)
})