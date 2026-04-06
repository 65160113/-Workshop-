# 🎓 University Workshop Registration System
> ระบบลงทะเบียนอบรมและเวิร์กชอปออนไลน์ (Online Workshop Registration System)

## Project Overview (ภาพรวมโครงการ)
**University Workshop Registration System** เป็นเว็บแอปพลิเคชันแบบ Full-Stack ที่พัฒนาขึ้นเพื่อแก้ปัญหาความยุ่งยากในการลงทะเบียนอบรมแบบเดิม โดยเปลี่ยนมาใช้ระบบออนไลน์ที่เป็นศูนย์กลาง ช่วยให้การจัดการข้อมูลเป็นระบบ ลดความซ้ำซ้อน และอำนวยความสะดวกให้กับทั้งผู้จัดงานและนักศึกษา

**Key Objectives:**
- **Streamline:** ลดขั้นตอนการสมัครและการจัดการเอกสาร
- **Real-time:** ตรวจสอบที่นั่งว่างและสถานะการสมัครได้ทันที
- **Secure:** มีระบบยืนยันตัวตนและการจัดการสิทธิ์ผู้ใช้งาน

---

## Tech Stack (เทคโนโลยีที่ใช้)

### Frontend (หน้าบ้าน)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Backend (หลังบ้าน)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![ExpressJS](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

### Database (ฐานข้อมูล)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)

---

## User Roles & Features (ผู้ใช้งานและฟีเจอร์)

ระบบรองรับผู้ใช้งาน 5 กลุ่มหลัก โดยมีฟีเจอร์เด่นดังนี้:

### 1. Guest (ผู้เยี่ยมชม)
- ค้นหาและดูรายการ Workshop ทั้งหมด
- ดูรายละเอียดกิจกรรม (วัน/เวลา/สถานที่)

### 2. Student (นักศึกษา)
- **Enrollment:** สมัครเข้าร่วมกิจกรรม (ตรวจสอบที่นั่งว่างอัตโนมัติ)
- **History:** ดูประวัติการสมัครของตนเอง
- **Cancellation:** ยกเลิกการสมัครได้ด้วยตนเอง

### 3. Organizer (ผู้จัดอบรม)
- **Create Workshop:** สร้างกิจกรรมใหม่และระบุรายละเอียด
- **Manage:** แก้ไขข้อมูลและตรวจสอบรายชื่อผู้ลงทะเบียน

### 4. Approver (ผู้อนุมัติ)
- ตรวจสอบความถูกต้องของกิจกรรม
- อนุมัติ (Approve) หรือไม่อนุมัติ (Reject) กิจกรรมก่อนเผยแพร่

### 5. Admin (ผู้ดูแลระบบ)
- จัดการข้อมูลพื้นฐาน (คณะ, สาขา, แพลตฟอร์ม)
- จัดการบัญชีผู้ใช้งาน

---

## Deployment & Infrastructure (โครงสร้างพื้นฐานและการติดตั้ง)

ระบบถูกนำขึ้นใช้งานจริงบนระบบ Cloud (Cloud Native Architecture) เพื่อให้รองรับการสเกลและเข้าถึงได้ตลอดเวลา:

- **Frontend Hosting:** ![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white) 
  - นำหน้าบ้านขึ้นใช้งานบน **Vercel** เพื่อประสิทธิภาพการโหลดหน้าเว็บที่รวดเร็ว (Edge Network)
- **Backend Hosting:** ![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)
  - นำ API หลังบ้านขึ้นใช้งานบน **Render.com** (Web Service) รองรับการรัน Node.js ตลอด 24 ชั่วโมง
- **Cloud Database:** ![Aiven](https://img.shields.io/badge/Aiven-FF3B30.svg?style=for-the-badge&logo=aiven&logoColor=white)
  - ย้ายฐานข้อมูลจาก Local ไปไว้บน **Aiven Cloud (MySQL)** เพื่อความปลอดภัยและสำรองข้อมูลแบบ Real-time

---

## CI/CD Pipeline (ระบบอัตโนมัติ)

โปรเจกต์นี้มีการใช้แนวทางการพัฒนาแบบ **Continuous Integration และ Continuous Deployment (CI/CD)** ผ่าน **GitHub Apps Integration** เพื่อลดข้อผิดพลาดจากมนุษย์ (Human Error) และทำให้ระบบอัปเดตแบบ Zero-Downtime:

1. **Source Control:** นักพัฒนาผลักดัน (Push) โค้ดขึ้นสู่ GitHub Repository ใน Branch `main`
2. **Automated Trigger:** ระบบ GitHub Apps จะส่งสัญญาณไปที่ Vercel และ Render โดยอัตโนมัติ
3. **Auto Build & Deploy:** - **Vercel** ทำการ Build React Application และอัปเดตหน้าเว็บทันที
   - **Render** ทำการติดตั้ง Dependencies (`npm install`) และรีสตาร์ทเซิร์ฟเวอร์ Node.js ใหม่โดยอัตโนมัติ

---

## Testing & Quality Assurance (การทดสอบระบบ)

เพื่อให้ระบบมีความเสถียรสูงสุด เราได้พัฒนาระบบทดสอบอัตโนมัติ (Automated Testing) ด้วย:
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

- **Unit Testing:** ทดสอบฟังก์ชันย่อยและสูตรคำนวณ (Logic) แบบเฉพาะจุด
- **Integration Testing (Supertest):** ทดสอบ API Routes ทุกเส้นทางแบบ End-to-End รวมถึงจำลองสถานการณ์ Database ล่ม (Mocking) เพื่อทดสอบระบบ Error Handling
- **Test Coverage:** โค้ดฝั่ง Backend ผ่านการทดสอบทั้งหมด **33 Test Cases** และมีระดับความครอบคลุม (Test Coverage) สูงถึง **91.3%**