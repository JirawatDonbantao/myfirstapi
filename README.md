# 🚀 MyFirstAPI

โปรเจกต์ API แรกของฉัน สร้างด้วย Node.js และ Express พร้อม Deploy ขึ้น Cloud จริงบน Railway ปัจจุบันมีระบบ **สมัครสมาชิก/เข้าสู่ระบบ** ด้วย JWT และเชื่อมต่อฐานข้อมูล PostgreSQL แบบ Production จริง

เป็นส่วนหนึ่งของการเรียนรู้ **DevOps และ Cloud Engineering** ตั้งแต่พื้นฐาน — จากศูนย์จนถึง Deploy ระบบขึ้น Production จริง

🔗 **Live API:** [myfirstapi-production-40f1.up.railway.app](https://myfirstapi-production-40f1.up.railway.app)

---

## 📖 เกี่ยวกับโปรเจกต์นี้

นี่คือ RESTful API ที่ครอบคลุมพื้นฐานสำคัญของการพัฒนาและ Deploy Backend บน Cloud ได้แก่:

- การสร้าง API ด้วย Express
- การจัดการ Environment Variables อย่างปลอดภัย
- ระบบ Logging และ Error Handling
- การเชื่อมต่อกับ API ภายนอก (WeatherAPI)
- การเชื่อมต่อฐานข้อมูล PostgreSQL (Railway) พร้อมบันทึกประวัติการค้นหา
- **ระบบ Authentication ด้วย JWT** — สมัครสมาชิก, เข้าสู่ระบบ, และป้องกัน Route สำคัญ
- การเข้ารหัส Password ด้วย bcrypt (ไม่เก็บ Password แบบข้อความล้วน)
- การ Deploy และ Redeploy บน Cloud Platform (Railway)

---

## 🛠️ Tech Stack

| เทคโนโลยี | ใช้ทำอะไร |
|---|---|
| **Node.js** | JavaScript Runtime |
| **Express** | Web Framework สำหรับสร้าง API |
| **dotenv** | จัดการ Environment Variables |
| **axios** | ยิง HTTP Request ไปยัง API ภายนอก |
| **cors** | อนุญาตการเรียก API ข้าม Domain (จำกัดเฉพาะ Frontend ที่กำหนด) |
| **pg (node-postgres)** | เชื่อมต่อและจัดการฐานข้อมูล PostgreSQL |
| **bcrypt** | เข้ารหัส (Hash) Password ก่อนบันทึกลงฐานข้อมูล |
| **jsonwebtoken** | สร้างและตรวจสอบ JWT Token สำหรับ Authentication |
| **Railway** | Cloud Platform สำหรับ Deploy (PaaS) — ทั้ง API และ PostgreSQL |
| **Git & GitHub** | Version Control |

---

## ✨ Features / API Endpoints

| Method | Endpoint | Auth | คำอธิบาย |
|---|---|---|---|
| `GET` | `/` | - | ตรวจสอบว่า API ทำงานปกติ |
| `GET` | `/time` | - | คืนค่าเวลาปัจจุบันของ Server |
| `GET` | `/hello/:name` | - | ทักทายตามชื่อที่ส่งมา |
| `GET` | `/secret` | 🔒 ต้อง Login | ทดสอบ Route ที่ป้องกันด้วย Authentication |
| `GET` | `/error-test` | - | จำลอง Error เพื่อทดสอบ Error Handler |
| `POST` | `/register` | - | สมัครสมาชิกใหม่ (Password จะถูก Hash ก่อนบันทึก) |
| `POST` | `/login` | - | เข้าสู่ระบบ รับ JWT Token กลับมาใช้งาน |
| `GET` | `/weather/:city` | 🔓 Login ได้ (ไม่บังคับ) | ดึงข้อมูลสภาพอากาศ หากแนบ Token จะบันทึกประวัติผูกกับผู้ใช้ |
| `POST` | `/history` | - | บันทึกประวัติการค้นหาแบบ Manual |
| `GET` | `/history` | - | ดึงประวัติการค้นหาล่าสุด 5 รายการ |

### ตัวอย่างการเรียกใช้ — สมัครสมาชิก

```bash
POST /register
Content-Type: application/json

{
  "username": "wat",
  "password": "mypassword123"
}
```

**Response:**
```json
{
  "status": "ok",
  "user": { "id": 1, "username": "wat" }
}
```

### ตัวอย่างการเรียกใช้ — เข้าสู่ระบบ

```bash
POST /login
Content-Type: application/json

{
  "username": "wat",
  "password": "mypassword123"
}
```

**Response:**
```json
{
  "status": "ok",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### ตัวอย่างการเรียกใช้ — Route ที่ต้อง Login

```bash
GET /secret
Authorization: Bearer <token>
```

### ตัวอย่างการเรียกใช้ — เช็คอากาศ

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

## 🗄️ Database Schema

**ตาราง `users`**

| คอลัมน์ | ประเภท | คำอธิบาย |
|---|---|---|
| `id` | SERIAL PRIMARY KEY | เลขลำดับผู้ใช้ |
| `username` | VARCHAR(50) UNIQUE NOT NULL | ชื่อผู้ใช้ ห้ามซ้ำ |
| `password_hash` | VARCHAR(255) NOT NULL | Password ที่ Hash แล้วด้วย bcrypt |
| `created_at` | TIMESTAMP | วันเวลาที่สมัคร |

**ตาราง `search_history`**

| คอลัมน์ | ประเภท | คำอธิบาย |
|---|---|---|
| `id` | SERIAL PRIMARY KEY | เลขลำดับ |
| `city` | VARCHAR(100) NOT NULL | ชื่อเมืองที่ค้นหา |
| `searched_at` | TIMESTAMP | วันเวลาที่ค้นหา |
| `user_id` | INTEGER REFERENCES users(id) | ผู้ใช้ที่ค้นหา (NULL หากไม่ได้ Login) |

---

## 🏗️ Architecture

```
Client (Browser)
      │
      ├── Register / Login ──▶ Railway (Express API) ──▶ PostgreSQL (users table)
      │                                │
      │                          JWT Token ออกกลับมา
      │                                │
      ▼                                ▼
Weather Request (+ Token)  ──▶ Railway (Express API) ──▶ WeatherAPI.com
                                       │
                                       ▼
                          PostgreSQL (search_history + user_id)
```

---

## 🚀 Getting Started (รันโปรเจกต์นี้เอง)

### สิ่งที่ต้องมีก่อน
- Node.js (v18 หรือสูงกว่า)
- npm
- PostgreSQL Database (เช่นผ่าน Railway)
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
DATABASE_PUBLIC_URL=your_postgres_connection_string
JWT_SECRET=your_random_secret_key
FRONTEND_URL=http://localhost:5500

# สร้างตารางในฐานข้อมูล (รันผ่าน psql หรือ Railway Console)
# ดูโครงสร้างตารางที่หัวข้อ Database Schema ด้านบน

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
| `DATABASE_PUBLIC_URL` | Connection String เชื่อมต่อ PostgreSQL |
| `JWT_SECRET` | กุญแจลับสำหรับเซ็นและตรวจสอบ JWT Token (ต้องสุ่มให้ยาวและคาดเดายาก) |
| `FRONTEND_URL` | URL ของ Frontend ที่อนุญาตให้เรียก API ผ่าน CORS |

---

## 📚 สิ่งที่ได้เรียนรู้จากโปรเจกต์นี้

- ความแตกต่างระหว่าง IaaS, PaaS และ SaaS ผ่านการใช้งาน Railway จริง
- Git workflow พื้นฐาน: `init`, `add`, `commit`, `push`, `revert`
- การป้องกันข้อมูลสำคัญด้วย Environment Variables และ `.gitignore`
- การเขียน Middleware สำหรับ Logging และ Error Handling ใน Express
- การเชื่อมต่อกับ External API ด้วย axios
- การแก้ปัญหา CORS เมื่อมี Frontend เรียกใช้ API จากคนละ Domain
- การออกแบบและเชื่อมโยงตารางฐานข้อมูล PostgreSQL ด้วย Foreign Key
- **หลักการ Authentication vs Authorization และ IAM**
- **การ Hash Password ด้วย bcrypt แทนการเก็บ Plain Text**
- **การสร้างและตรวจสอบ JWT Token สำหรับระบบ Login**
- **การเขียน Middleware แบบบังคับ (Authentication) และไม่บังคับ (Optional Authentication)**
- **หลัก Data Protection — ไม่เปิดเผยรายละเอียด Error ที่ไม่จำเป็นให้ผู้ใช้เห็น**
- การทดสอบ API ด้วย Postman (Register, Login, Protected Routes)

---

## 🗺️ โปรเจกต์นี้เป็นส่วนหนึ่งของ

คอร์สเรียน **Cloud Computing & DevOps** — เส้นทางสู่การเป็น Cloud/DevOps Engineer

ดูโปรเจกต์ถัดไป: [weather-app](https://github.com/JirawatDonbantao/weather-app) — Full-Stack Weather Application ที่เชื่อมต่อกับ API นี้ พร้อมระบบ Login

---

*Built with 💻 by [JirawatDonbantao](https://github.com/JirawatDonbantao)*
