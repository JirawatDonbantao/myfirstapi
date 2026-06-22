const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.json({
    message: 'สวัสดี! API ทำงานได้แล้ว',
    status: 'ok'
  })
})

app.get('/time', (req, res) => {
  res.json({
    time: new Date().toISOString(),
    message: 'เวลาปัจจุบัน'
  })
})

// โค้ดพัง ทดสอบการย้อนกลับ
app.get('/broken', (req, res) => {
  throw new Error('โค้ดพังแล้ว!')
})


app.get('/hello/:name', (req, res) => {
  const name = req.params.name
  res.json({
    message: `สวัสดี ${name}!`
  })
})

app.listen(PORT, () => {
  console.log(`Server รันอยู่ที่ Port ${PORT}`)
})