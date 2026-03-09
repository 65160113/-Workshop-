# 🛠️ Development Environment Setup Guide
**Project:** University Workshop Registration System

คู่มือนี้สำหรับนักพัฒนาในทีม เพื่อตั้งค่าสภาพแวดล้อมจำลอง (Local Environment) ในเครื่องของตนเอง

## 💻 System Requirements (ความต้องการของระบบ)
* **OS:** Windows 10+ / macOS / Linux 
* **RAM:** 8GB minimum [cite: 1739]
* **Tools:**
  * Node.js (v18 หรือสูงกว่า) 
  * MySQL Server (v8.0)
  * Git

---

## 🚀 Installation Steps (ขั้นตอนการติดตั้ง)

### 1. Clone Repository
ดาวน์โหลดโค้ดโปรเจกต์ลงเครื่อง
```bash
git clone https://github.com/65160113/-Workshop-.git
cd -Workshop-
```

### 2. Setup Database (ตั้งค่าฐานข้อมูล)
1.เปิดโปรแกรม XAMPP หรือ MAMP แล้วกด Start ที่ MySQL ให้ทำงาน

2.เปิดเบราว์เซอร์เข้าไปที่ http://localhost/phpmyadmin หรือใช้โปรแกรมจัดการฐานข้อมูล

3.รันคำสั่ง SQL จากไฟล์ที่เราเตรียมไว้:
* รันไฟล์ backend/database/schema.sql (เพื่อสร้างตาราง)
* รันไฟล์ backend/database/seeds.sql (เพื่อใส่ข้อมูลจำลอง)

### 3. Setup Backend (หลังบ้าน)
```bash
1. เข้าไปที่โฟลเดอร์ backend
cd backend

2. ติดตั้ง Library ต่างๆ
npm install

3. คัดลอกไฟล์ตั้งค่า และกรอกข้อมูลให้ตรงกับเครื่องตัวเอง
cp .env.example .env

4. รันเซิร์ฟเวอร์
npm run dev
```
(Backend จะรันที่ http://localhost:3000)

### 4. Setup Frontend (หน้าบ้าน)
เปิด Terminal หน้าต่างใหม่ แล้วพิมพ์ตามนี้:
```Bash# 
1. เข้าไปที่โฟลเดอร์ frontend
cd frontend

# 2. ติดตั้ง Library ต่างๆ
npm install

# 3. รันเซิร์ฟเวอร์หน้าบ้าน
npm run dev
```
(Frontend จะรันที่ http://localhost:5173 หรือพอร์ตที่ Vite กำหนด)✅ 

## Verification (วิธีตรวจสอบว่าติดตั้งเสร็จสมบูรณ์)

ถ้าคุณติดตั้งถูกต้อง จะต้องได้ผลลัพธ์ดังนี้: 
* [ ] Backend: เข้าไปที่ http://localhost:3000/api/health ต้องเห็นข้อความบอกว่าระบบทำงานปกติ

* [ ] Frontend: เข้าเว็บแอปพลิเคชันผ่าน Browser ได้ หน้าตาเว็บแสดงผลปกติ 

* [ ] Database: โค้ด Backend ไม่ฟ้อง Error การเชื่อมต่อ Database (Connected successfully) 

## 🛠️ Troubleshooting (ปัญหาที่พบบ่อย)
#### 🔴 Port 3000 หรือ 5173 ถูกใช้งานอยู่ (Port Already in Use)

วิธีแก้: มีโปรแกรมอื่นแย่งพอร์ตนี้อยู่ ให้ปิดโปรแกรมนั้น หรือเปลี่ยนค่า PORT ในไฟล์ .env 

#### 🔴 Database Connection Failed (เชื่อมต่อฐานข้อมูลไม่ได้)
วิธีแก้: 

1.เช็คว่า MySQL ในเครื่องรันอยู่หรือไม่ (Service is running) 

2.เช็คไฟล์ .env ว่าใส่ Username / Password ของ MySQL ในเครื่องตัวเองถูกต้องหรือไม่ 

#### 🔴 Dependencies not installing (ลง npm install ไม่ผ่าน)
วิธีแก้: ให้ลบโฟลเดอร์ node_modules และไฟล์ package-lock.json ทิ้ง แล้วลองสั่ง npm install ใหม่อีกครั้ง 