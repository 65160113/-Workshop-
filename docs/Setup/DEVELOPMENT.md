# 🛠️ Development Environment Setup Guide
**Project:** University Workshop Registration System

คู่มือนี้สำหรับนักพัฒนาในทีม เพื่อตั้งค่าสภาพแวดล้อมจำลอง (Local Environment) ในเครื่องของตนเอง

## 💻 System Requirements (ความต้องการของระบบ)
* **OS:** Windows 10+ / macOS / Linux 
* **RAM:** 8GB minimum 
* **Tools:**
  * Node.js (v18 หรือสูงกว่า) 
  * MySQL Server (v8.0)
  * Git
  * VS Code (แนะนำให้ลง Extension: `Database Client` หรือ `MySQL` สำหรับดูข้อมูลในฐานข้อมูล)

---

## 🚀 Installation Steps (ขั้นตอนการติดตั้ง)

### 1. Clone Repository
ดาวน์โหลดโค้ดโปรเจกต์ลงเครื่อง
```bash
git clone https://github.com/65160113/-Workshop-.git
cd -Workshop-
```
### 2. รับกุญแจเชื่อมต่อ Database 🔑
เนื่องจากตอนนี้ระบบเราใช้ฐานข้อมูลบน Cloud (Aiven) ร่วมกันทั้งทีม:

1.ทักหา Dev เพื่อขอรับไฟล์ .env สำหรับเชื่อมต่อระบบ

2.ห้าม Push ไฟล์ .env ขึ้น GitHub เด็ดขาด!

### 3. Setup Backend (หลังบ้าน)
```bash
1. เข้าไปที่โฟลเดอร์ backend
cd backend

2. ติดตั้ง Library ต่างๆ
npm install

3. นำไฟล์ .env ที่ได้จาก Dev มาวางไว้ในโฟลเดอร์ backend

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

* [ ] Database: ใน Terminal ของ Backend ไม่ฟ้อง Error และขึ้นข้อความว่าเชื่อมต่อ Database สำเร็จ (เพราะดึงข้อมูลจาก Cloud ได้)

## 🛠️ Troubleshooting (ปัญหาที่พบบ่อย)
#### 🔴 Port 3000 หรือ 5173 ถูกใช้งานอยู่ (Port Already in Use)

วิธีแก้: มีโปรแกรมอื่นแย่งพอร์ตนี้อยู่ ให้ปิดโปรแกรมนั้น หรือเปลี่ยนค่า PORT ในไฟล์ .env 

#### 🔴 Database Connection Failed (เชื่อมต่อฐานข้อมูลไม่ได้ / Error 500)
วิธีแก้: 

1. เช็คอินเทอร์เน็ตของคุณ (เพราะต้องต่อเน็ตเพื่อดึงข้อมูลจาก Cloud)

2. ตรวจสอบไฟล์ .env ในโฟลเดอร์ backend ว่ามีข้อมูลครบถ้วน และไม่ได้พิมพ์ชื่อไฟล์ผิด (ต้องเป็น .env เฉยๆ ไม่มีนามสกุลอื่นต่อท้าย)

#### 🔴 Dependencies not installing (ลง npm install ไม่ผ่าน)
วิธีแก้: ให้ลบโฟลเดอร์ node_modules และไฟล์ package-lock.json ทิ้ง แล้วลองสั่ง npm install ใหม่อีกครั้ง 