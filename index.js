// บรรทัดแรกสุดเลย — สำคัญมาก
require('dotenv').config()

const express = require('express')
const app = express()

// อ่านค่าจาก .env
const PORT = process.env.PORT || 3000
const APP_NAME = process.env.APP_NAME || 'API'
const SECRET_MESSAGE = process.env.SECRET_MESSAGE || 'ไม่มีข้อความ'

// Route หลัก
app.get('/', (req, res) => {
  res.json({
    app: APP_NAME,
    message: 'ทำงานได้แล้ว',
    status: 'ok'
  })
})

// Route เวลา
app.get('/time', (req, res) => {
  res.json({
    time: new Date().toISOString(),
    message: 'เวลาปัจจุบัน'
  })
})

// Route ทักทาย
app.get('/hello/:name', (req, res) => {
  const name = req.params.name
  res.json({
    message: `สวัสดี ${name}!`
  })
})

// Route ใหม่ — ทดสอบ .env
app.get('/secret', (req, res) => {
  res.json({
    secret: SECRET_MESSAGE
  })
})

app.listen(PORT, () => {
  console.log(`${APP_NAME} รันอยู่ที่ Port ${PORT}`)
})