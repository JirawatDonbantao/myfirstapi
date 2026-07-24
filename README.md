![Run Tests](https://github.com/JirawatDonbantao/myfirstapi/actions/workflows/test.yml/badge.svg)
# 🚀 MyFirstAPI

โปรเจกต์ API แรกของฉัน สร้างด้วย Node.js และ Express พร้อม Deploy ขึ้น Cloud จริงบน **Render** เชื่อมต่อฐานข้อมูล **Neon PostgreSQL** มีระบบ **สมัครสมาชิก/เข้าสู่ระบบ** ด้วย JWT

เป็นส่วนหนึ่งของการเรียนรู้ **DevOps และ Cloud Engineering** ตั้งแต่พื้นฐาน — จากศูนย์จนถึง Deploy ระบบขึ้น Production จริง

🔗 **Live API:** [myfirstapi-rjv4.onrender.com](https://myfirstapi-rjv4.onrender.com)

---

## 📖 เกี่ยวกับโปรเจกต์นี้

นี่คือ RESTful API ที่ครอบคลุมพื้นฐานสำคัญของการพัฒนาและ Deploy Backend บน Cloud ได้แก่:

- การสร้าง API ด้วย Express
- การจัดการ Environment Variables อย่างปลอดภัย
- ระบบ Logging และ Error Handling
- การเชื่อมต่อกับ API ภายนอก (WeatherAPI)
- การเชื่อมต่อฐานข้อมูล PostgreSQL (Neon) พร้อมบันทึกประวัติการค้นหา
- ระบบ Authentication ด้วย JWT — สมัครสมาชิก, เข้าสู่ระบบ, และป้องกัน Route สำคัญ
- การเข้ารหัส Password ด้วย bcrypt
- **Automated Testing** ด้วย Jest + Supertest
- **CI (Continuous Integration)** ด้วย GitHub Actions — รัน Test อัตโนมัติทุกครั้งที่ push
- การ Deploy และ Redeploy บน Cloud Platform (Render)

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
| **Jest + Supertest** | เขียนและรัน Automated Test |
| **GitHub Actions** | รัน Test อัตโนมัติทุกครั้งที่ push (CI) |
| **Render** | Cloud Platform สำหรับ Deploy Backend (PaaS) |
| **Neon** | PostgreSQL แบบ Serverless สำหรับฐานข้อมูล |
| **Git & GitHub** | Version Control |

---

## ✨ Features / API Endpoints

| Method | Endpoint | Auth | คำอธิบาย |
|---|---|---|---|
| `GET` | `/` | - | ตรวจสอบว่า API ทำงานปกติ (Health Check) |
| `GET` | `/time` | - | คืนค่าเวลาปัจจุบันของ Server |
| `GET` | `/hello/:name` | - | ทักทายตามชื่อที่ส่งมา |
| `GET` | `/secret` | 🔒 ต้อง Login | ทดสอบ Route ที่ป้องกันด้วย Authentication |
| `POST` | `/register` | - | สมัครสมาชิกใหม่ (Password จะถูก Hash ก่อนบันทึก) |
| `POST` | `/login` | - | เข้าสู่ระบบ รับ JWT Token กลับมาใช้งาน |
| `GET` | `/weather/:city` | 🔓 Login ได้ (ไม่บังคับ) | ดึงข้อมูลสภาพอากาศ หากแนบ Token จะบันทึกประวัติผูกกับผู้ใช้ |
| `POST` | `/history` | - | บันทึกประวัติการค้นหาแบบ Manual |
| `GET` | `/history` | - | ดึงประวัติการค้นหาล่าสุด 5 รายการ |

---

## 🗄️ Database Schema (Neon PostgreSQL)

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
      ├── Register / Login ──▶ Render (Express API) ──▶ Neon PostgreSQL (users)
      │                                │
      │                          JWT Token ออกกลับมา
      │                                │
      ▼                                ▼
Weather Request (+ Token)  ──▶ Render (Express API) ──▶ WeatherAPI.com
                                       │
                                       ▼
                          Neon PostgreSQL (search_history + user_id)
```

**CI Pipeline:**
```
Push โค้ด ──▶ GitHub Actions รัน Jest ──▶ ✅/❌ แจ้งผลบน GitHub
        └──▶ Render ตรวจจับโค้ดใหม่ ──▶ Build + Deploy อัตโนมัติ
```

---

## 🚀 Getting Started (รันโปรเจกต์นี้เอง)

### สิ่งที่ต้องมีก่อน
- Node.js (v18 หรือสูงกว่า)
- npm
- PostgreSQL Database (แนะนำ [Neon](https://neon.tech) — ฟรี ไม่มีวันหมดอายุ)
- WeatherAPI Key (สมัครฟรีที่ [weatherapi.com](https://www.weatherapi.com))

### ขั้นตอนติดตั้ง

```bash
git clone https://github.com/JirawatDonbantao/myfirstapi.git
cd myfirstapi
npm install

# สร้างไฟล์ .env แล้วใส่ค่าตามนี้
PORT=3000
APP_NAME=MyFirstAPI
SECRET_MESSAGE=your_secret_message
WEATHER_API_KEY=your_weatherapi_key
DATABASE_URL=your_neon_connection_string
JWT_SECRET=your_random_secret_key
FRONTEND_URL=http://localhost:5500

npm start
```

### รัน Test

```bash
npx jest
```

---

## 🔐 Environment Variables

| Variable | คำอธิบาย |
|---|---|
| `PORT` | Port ที่ Server จะรัน (Render กำหนดให้อัตโนมัติเมื่อ Deploy) |
| `APP_NAME` | ชื่อแอปพลิเคชัน |
| `SECRET_MESSAGE` | ข้อความทดสอบสำหรับ route `/secret` |
| `WEATHER_API_KEY` | API Key จาก WeatherAPI.com |
| `DATABASE_URL` | Connection String เชื่อมต่อ Neon PostgreSQL |
| `JWT_SECRET` | กุญแจลับสำหรับเซ็นและตรวจสอบ JWT Token |
| `FRONTEND_URL` | URL ของ Frontend ที่อนุญาตให้เรียก API ผ่าน CORS (ห้ามมี `/` ต่อท้าย) |

---

## 📚 สิ่งที่ได้เรียนรู้จากโปรเจกต์นี้

- ความแตกต่างระหว่าง IaaS, PaaS และ SaaS ผ่านการใช้งาน Cloud Platform จริง
- Git workflow: `init`, `add`, `commit`, `push`, `revert`
- การป้องกันข้อมูลสำคัญด้วย Environment Variables และ `.gitignore`
- การเขียน Middleware สำหรับ Logging, Error Handling และ Authentication
- หลักการ Authentication vs Authorization, IAM, Least Privilege
- การ Hash Password ด้วย bcrypt และสร้าง JWT Token
- **การเขียน Automated Test ด้วย Jest + Supertest**
- **การตั้งค่า CI ด้วย GitHub Actions ให้รัน Test อัตโนมัติทุก push**
- **การย้าย Backend + Database ข้าม Cloud Platform (Railway → Render + Neon) โดยไม่แก้โค้ด core ใดๆ เลย** — พิสูจน์ว่าการออกแบบผ่าน Environment Variables มาตรฐานช่วยให้ย้ายแพลตฟอร์มได้ง่าย
- การ Debug ปัญหาจริง เช่น CORS mismatch, Environment Variable ตั้งผิด service, filename ผิด

---

## 🗺️ โปรเจกต์นี้เป็นส่วนหนึ่งของ

คอร์สเรียน **Cloud Computing & DevOps** — เส้นทางสู่การเป็น Cloud/DevOps Engineer

ดูโปรเจกต์ถัดไป: [weather-app](https://github.com/JirawatDonbantao/weather-app) — Full-Stack Weather Application ที่เชื่อมต่อกับ API นี้

---

*Built with 💻 by [JirawatDonbantao](https://github.com/JirawatDonbantao)*
