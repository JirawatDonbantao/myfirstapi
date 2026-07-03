require('dotenv').config()

const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000
const APP_NAME = process.env.APP_NAME || 'API'
const SECRET_MESSAGE = process.env.SECRET_MESSAGE || 'ไม่มีข้อความ'

// ✅ Middleware — บันทึกทุก Request ที่เข้ามา
app.use((req, res, next) => {
  const time = new Date().toISOString()
  console.log(`[${time}] ${req.method} ${req.url}`)
  next()
})

app.get('/', (req, res) => {
  console.log('มีคนเข้าหน้าหลัก') // ← Log
  res.json({
    app: APP_NAME,
    message: 'ทำงานได้แล้ว',
    status: 'ok'
  })
})

app.get('/time', (req, res) => {
  console.log('มีคนขอเวลา') // ← Log
  res.json({
    time: new Date().toISOString(),
    message: 'เวลาปัจจุบัน'
  })
})

app.get('/hello/:name', (req, res) => {
  const name = req.params.name
  console.log(`มีคนทักทาย: ${name}`) // ← Log
  res.json({
    message: `สวัสดี ${name}!`
  })
})

app.get('/secret', (req, res) => {
  console.log('มีคนขอ Secret') // ← Log
  res.json({
    secret: SECRET_MESSAGE
  })
})

// ✅ Route จำลอง Error — เพื่อทดสอบ Error Log
app.get('/error-test', (req, res) => {
  console.log('กำลังจะเกิด Error....')
  throw new Error('นี่คือ Error จำลองสำหรับทดสอบ!')
})

// ✅ Error Handler — จัดการ Error ทั้งหมด
app.use((err, req, res, next) => {
  console.error(`❌ Error: ${err.message}`) // ← Log Error
  res.status(500).json({
    status: 'error',
    message: err.message
  })
})

app.listen(PORT, () => {
  console.log(`✅ ${APP_NAME} รันอยู่ที่ Port ${PORT}`)
  console.log(`✅ เวลาเริ่มต้น: ${new Date().toISOString()}`)
})