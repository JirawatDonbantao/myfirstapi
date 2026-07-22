const request = require('supertest')
const app = require('../app')

describe('พื้นฐาน API ที่ไม่แตะฐานข้อมูล', () => {

  test('GET / ควรตอบว่า API ทำงานปกติ', async () => {
    const response = await request(app).get('/')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('ok')
  })

  test('GET /time ควรคืนค่าเวลาปัจจุบัน', async () => {
    const response = await request(app).get('/time')
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('time')
  })

  test('GET /hello/:name ควรทักทายด้วยชื่อที่ส่งมา', async () => {
    const response = await request(app).get('/hello/Wat')
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('สวัสดี Wat!')
  })

  test('GET /secret โดยไม่มี token ควรถูกปฏิเสธ', async () => {
    const response = await request(app).get('/secret')
    expect(response.status).toBe(401)
  })

})