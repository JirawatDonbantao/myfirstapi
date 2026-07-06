# 🚀 MyFirstAPI

โปรเจกต์ API แรกของฉัน สร้างด้วย Node.js และ Express พร้อม Deploy ขึ้น Cloud จริงบน Railway

เป็นส่วนหนึ่งของการเรียนรู้ **DevOps และ Cloud Engineering** ตั้งแต่พื้นฐาน — จากศูนย์จนถึง Deploy ระบบขึ้น Production จริง

🔗 **Live API:** [myfirstapi-production-40f1.up.railway.app](https://myfirstapi-production-40f1.up.railway.app)

---

## 📖 เกี่ยวกับโปรเจกต์นี้

นี่คือ RESTful API เริ่มต้นที่ครอบคลุมพื้นฐานสำคัญของการพัฒนาและ Deploy Backend บน Cloud ได้แก่:

- การสร้าง API ด้วย Express
- การจัดการ Environment Variables อย่างปลอดภัย
- ระบบ Logging และ Error Handling
- การเชื่อมต่อกับ API ภายนอก (WeatherAPI)
- การ Deploy และ Redeploy บน Cloud Platform (Railway)

---

## 🛠️ Tech Stack

| เทคโนโลยี | ใช้ทำอะไร |
|---|---|
| **Node.js** | JavaScript Runtime |
| **Express** | Web Framework สำหรับสร้าง API |
| **dotenv** | จัดการ Environment Variables |
| **axios** | ยิง HTTP Request ไปยัง API ภายนอก |
| **cors** | อนุญาตการเรียก API ข้าม Domain |
| **Railway** | Cloud Platform สำหรับ Deploy (PaaS) |
| **Git & GitHub** | Version Control |

---

## ✨ Features / API Endpoints

| Method | Endpoint | คำอธิบาย |
|---|---|---|
| `GET` | `/` | ตรวจสอบว่า API ทำงานปกติ |
| `GET` | `/time` | คืนค่าเวลาปัจจุบันของ Server |
| `GET` | `/hello/:name` | ทักทายตามชื่อที่ส่งมา |
| `GET` | `/secret` | ทดสอบการอ่านค่าจาก Environment Variables |
| `GET` | `/error-test` | จำลอง Error เพื่อทดสอบ Error Handler |
| `GET` | `/weather/:city` | ดึงข้อมูลสภาพอากาศปัจจุบันของเมืองที่ระบุ |

### ตัวอย่างการเรียกใช้

```bash
GET /weather/Bangkok
```

**Response:**
```json
{
  "city": "Bangkok",
  "country": "Thailand",
  "temp_c": 30.4,
  "feels_like": 38.1,
  "humidity": 79,
  "wind_kph": 16.2,
  "condition": "Light rain shower",
  "icon": "//cdn.weatherapi.com/weather/64x64/night/353.png"
}
```

---

## 🏗️ Architecture

```
Client (Browser)
      │
      ▼
Railway (Node.js + Express API)
      │
      ▼
WeatherAPI.com (External Data Source)
```

---

## 🚀 Getting Started (รันโปรเจกต์นี้เอง)

### สิ่งที่ต้องมีก่อน
- Node.js (v18 หรือสูงกว่า)
- npm
- WeatherAPI Key (สมัครฟรีที่ [weatherapi.com](https://www.weatherapi.com))

### ขั้นตอนติดตั้ง

```bash
# Clone โปรเจกต์
git clone https://github.com/JirawatDonbantao/myfirstapi.git
cd myfirstapi

# ติดตั้ง dependencies
npm install

# สร้างไฟล์ .env แล้วใส่ค่าตามนี้
PORT=3000
APP_NAME=MyFirstAPI
SECRET_MESSAGE=your_secret_message
WEATHER_API_KEY=your_weatherapi_key

# รันโปรเจกต์
npm start
```

เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

---

## 🔐 Environment Variables

โปรเจกต์นี้ใช้ไฟล์ `.env` เก็บข้อมูลสำคัญ (ไม่ถูก commit ขึ้น GitHub เพื่อความปลอดภัย)

| Variable | คำอธิบาย |
|---|---|
| `PORT` | Port ที่ Server จะรัน (Railway กำหนดให้อัตโนมัติเมื่อ Deploy) |
| `APP_NAME` | ชื่อแอปพลิเคชัน |
| `SECRET_MESSAGE` | ข้อความทดสอบสำหรับ route `/secret` |
| `WEATHER_API_KEY` | API Key จาก WeatherAPI.com |

---

## 📚 สิ่งที่ได้เรียนรู้จากโปรเจกต์นี้

- ความแตกต่างระหว่าง IaaS, PaaS และ SaaS ผ่านการใช้งาน Railway จริง
- Git workflow พื้นฐาน: `init`, `add`, `commit`, `push`, `revert`
- การป้องกันข้อมูลสำคัญด้วย Environment Variables และ `.gitignore`
- การเขียน Middleware สำหรับ Logging และ Error Handling ใน Express
- การ Debug ปัญหา Deploy จริง เช่น Environment Variables ที่มีช่องว่าง, Commit ไม่ตรงกับ Deploy
- การเชื่อมต่อกับ External API ด้วย axios
- การแก้ปัญหา CORS เมื่อมี Frontend เรียกใช้ API จากคนละ Domain

---

## 🗺️ โปรเจกต์นี้เป็นส่วนหนึ่งของ

คอร์สเรียน **Cloud Computing & DevOps** — เส้นทางสู่การเป็น Cloud/DevOps Engineer

ดูโปรเจกต์ถัดไป: [weather-app](https://github.com/JirawatDonbantao/weather-app) — Full-Stack Weather Application ที่เชื่อมต่อกับ API นี้

---

*Built with 💻 by [JirawatDonbantao](https://github.com/JirawatDonbantao)*
