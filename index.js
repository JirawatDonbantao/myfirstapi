require('dotenv').config()

const app = require('./app')

const PORT = process.env.PORT || 3000
const APP_NAME = process.env.APP_NAME || 'API'

app.listen(PORT, () => {
  console.log(`✅ ${APP_NAME} รันอยู่ที่ Port ${PORT}`)
})