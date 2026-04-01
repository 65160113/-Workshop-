# D2: System Architecture Document

เอกสารฉบับนี้อธิบายโครงสร้างสถาปัตยกรรมของระบบ Workshop Management System โดยใช้รูปแบบ **Multi-tier Architecture** ซึ่งมีการแบ่งแยกหน้าที่การทำงาน (Separation of Concerns) ออกเป็น 5 Layers เพื่อให้ระบบมีความยืดหยุ่น ดูแลรักษาง่าย และรองรับการขยายตัวในอนาคต (Scalability)

---

## 1. Presentation Layer (UI / Frontend)
ชั้นนี้รับผิดชอบในการแสดงผลและโต้ตอบกับผู้ใช้งาน (User Interface & User Experience) โดยตรง ไม่มีการประมวลผลตรรกะทางธุรกิจที่ซับซ้อนในชั้นนี้
* **เทคโนโลยีที่ใช้:** React.js, Tailwind CSS, DaisyUI, React Router DOM
* **หน้าที่หลัก:**
  * รับข้อมูลขาเข้าจากผู้ใช้งานผ่านฟอร์ม (เช่น ฟอร์มสร้าง Workshop, ฟอร์มแก้ไขโปรไฟล์)
  * จัดการ State ของหน้าจอ (ใช้ `useState`, `useEffect`)
  * ตรวจสอบความถูกต้องของข้อมูลเบื้องต้นฝั่งไคลเอนต์ (Client-side Validation)
  * ส่งคำขอ (HTTP Requests) ผ่าน `axios` ไปยัง Business Layer
  * แสดงผลข้อมูลสถิติ (Admin Dashboard) และรายการต่างๆ ในรูปแบบที่เข้าใจง่าย

## 2. Business Layer (Application / Logic)
ชั้นนี้เปรียบเสมือนสมองของระบบ ทำหน้าที่จัดการตรรกะทางธุรกิจ (Business Rules) และประมวลผลข้อมูลที่ได้รับมาจาก Presentation Layer
* **เทคโนโลยีที่ใช้:** Node.js, Express.js
* **หน้าที่หลัก:**
  * **Controllers:** (`workshopController.js`, `adminController.js`) รับ Request จาก Routing มาประมวลผล
  * **Business Logic:** เช่น การตรวจสอบเงื่อนไขว่าผู้ใช้มีสิทธิ์กดอนุมัติ Workshop หรือไม่ (Approve/Reject), การคำนวณจำนวนที่นั่งว่าง, และการรวบรวมข้อมูลสถิติสำหรับ Dashboard
  * เตรียมข้อมูลให้อยู่ในรูปแบบ JSON ก่อนส่งกลับไปยัง Presentation Layer

## 3. Persistence Layer (Data Access)
ชั้นนี้ทำหน้าที่เป็นตัวกลางระหว่าง Business Layer และ Data Layer เพื่อลดความซับซ้อนในการเขียนคำสั่งเชื่อมต่อฐานข้อมูลโดยตรงในฝั่ง Logic
* **เทคโนโลยีที่ใช้:** `mysql2/promise` (Connection Pool)
* **หน้าที่หลัก:**
  * จัดการการเชื่อมต่อฐานข้อมูล (Database Connection Management)
  * แปลงคำสั่งจาก Business Logic ให้เป็นคำสั่ง SQL (CRUD Operations: Create, Read, Update, Delete)
  * ป้องกันการโจมตีแบบ SQL Injection โดยใช้ Parameterized Queries (`?` ในคำสั่ง execute)
  * จัดการ Transaction กรณีที่มีการทำงานหลายขั้นตอนพร้อมกัน

## 4. Data Layer (Database)
ชั้นล่างสุดของระบบ ทำหน้าที่จัดเก็บข้อมูลทั้งหมดของแอปพลิเคชันอย่างถาวร
* **เทคโนโลยีที่ใช้:** MySQL (Relational Database)
* **หน้าที่หลัก:**
  * จัดเก็บข้อมูลผู้ใช้งาน (Users), ข้อมูลงาน (Workshops), การลงทะเบียน (Enrollments), หมวดหมู่ (Categories) และรูปแบบการจัดงาน (Platforms)
  * บังคับใช้ความสมบูรณ์ของข้อมูล (Data Integrity) ผ่าน Primary Key, Foreign Key และ Constraints ต่างๆ

## 5. Cross-cutting Layer
ชั้นนี้ประกอบด้วยกลไกและฟังก์ชันที่ถูกเรียกใช้งานจากหลายๆ Layer ในระบบ (ตัดขวางทุก Layer) เพื่ออำนวยความสะดวกและรักษาความปลอดภัย
* **เทคโนโลยีที่ใช้:** JSON Web Token (JWT), `bcryptjs`, `cors`, `dotenv`
* **หน้าที่หลัก:**
  * **Authentication & Authorization:** ระบบยืนยันตัวตนด้วย JWT และการจัดการสิทธิ์การเข้าถึงแบบ Role-Based Access Control (RBAC) ผ่าน Middleware (`verifyToken`, `verifyRoles`) โดยแบ่งสิทธิ์เป็น Admin, Approver, Organizer และ User
  * **Security & CORS:** การอนุญาต Cross-Origin Resource Sharing เพื่อให้ Frontend และ Backend คุยกันได้อย่างปลอดภัย
  * **Configuration Management:** การจัดการตัวแปรสภาพแวดล้อม (Environment Variables) ผ่านไฟล์ `.env`
  * **Error Handling & Logging:** การดักจับและตอบกลับข้อผิดพลาด (Try/Catch blocks) ในทุกๆ API Endpoint