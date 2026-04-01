# D2: Coding Standards Document

เอกสารฉบับนี้กำหนดมาตรฐานและข้อปฏิบัติในการเขียนโค้ด (Coding Standards) สำหรับโครงการ Workshop Management System เพื่อให้ซอร์สโค้ดของทั้งฝั่ง Frontend และ Backend มีความเป็นระเบียบ อ่านง่าย ดูแลรักษาง่าย (Maintainability) และทำงานร่วมกันในทีมได้อย่างมีประสิทธิภาพ

---

## 1. การตั้งชื่อ (Naming Conventions)

การตั้งชื่อตัวแปร ฟังก์ชัน และไฟล์ต่างๆ ต้องสื่อความหมายชัดเจน โดยยึดหลักเกณฑ์ดังนี้:

### 1.1 ตัวแปรและฟังก์ชัน (Variables & Functions)
* **รูปแบบ:** `camelCase` (ตัวพิมพ์เล็กนำหน้า ตัวต่อไปขึ้นต้นด้วยตัวพิมพ์ใหญ่)
* **กฎเกณฑ์:** * ชื่อตัวแปรควรเป็นคำนาม (Noun) เช่น `userData`, `workshopList`, `isApproved` (สำหรับ Boolean)
    * ชื่อฟังก์ชันควรเป็นคำกริยา (Verb) นำหน้า เพื่อสื่อถึงการกระทำ เช่น `getUserById()`, `calculateTotalSeats()`, `handleUpdateStatus()`
* **ตัวอย่าง:**
    ```javascript
    const maxSeats = 50;
    const fetchPendingWorkshops = async () => { ... };
    ```

### 1.2 ไฟล์และคอมโพเนนต์ (Files & Components)
* **รูปแบบ Frontend (React):** `PascalCase` สำหรับชื่อไฟล์ Component (.jsx)
    * ตัวอย่าง: `AdminDashboardPage.jsx`, `WorkshopCard.jsx`, `Navbar.jsx`
* **รูปแบบ Backend (Node.js):** `camelCase` สำหรับชื่อไฟล์ทั่วไป (.js)
    * ตัวอย่าง: `adminController.js`, `workshopRoutes.js`, `authMiddleware.js`

### 1.3 ตัวแปรค่าคงที่และสภาพแวดล้อม (Constants & Environment Variables)
* **รูปแบบ:** `UPPER_SNAKE_CASE` (ตัวพิมพ์ใหญ่ทั้งหมด คั่นด้วยขีดล่าง)
* **ตัวอย่าง:**
    ```javascript
    const MAX_UPLOAD_SIZE = 5242880;
    const API_URL = process.env.VITE_API_URL;
    ```

### 1.4 ฐานข้อมูล (Database Tables & Columns)
* **รูปแบบ:** `snake_case` (ตัวพิมพ์เล็กทั้งหมด คั่นด้วยขีดล่าง)
* **กฎเกณฑ์:** ชื่อตารางควรเป็นพหูพจน์ (Plural)
* **ตัวอย่าง:** ตาราง `users`, `workshops`, ฟิลด์ `user_id`, `start_time`

---

## 2. การจัดรูปแบบโค้ด (Formatting & Style)

เพื่อให้โครงสร้างโค้ดสม่ำเสมอ โครงการนี้ใช้ **Prettier** และ **ESLint** เป็นเครื่องมือหลักในการจัดฟอร์แมต

### 2.1 การย่อหน้า (Indentation)
* ใช้ **Space** (ช่องว่าง) จำนวน **2 spaces** ต่อ 1 แท็บ (Tab) เสมอ เพื่อไม่ให้โค้ดลึกเกินไป

### 2.2 เครื่องหมายคำพูด (Quotes)
* **Frontend (JSX):** ใช้ Double Quotes (`""`) สำหรับ HTML/JSX attributes
* **Backend & JS Logic:** อนุโลมให้ใช้ได้ทั้ง Single Quotes (`''`) และ Double Quotes (`""`) แต่แนะนำให้ใช้ Double Quotes ตามมาตรฐาน Prettier
* **ตัวอย่าง:** `<div className="text-center">`

### 2.3 การใช้วงเล็บปีกกา (Braces)
* เปิดวงเล็บปีกกา `{` ในบรรทัดเดียวกับคำสั่ง (K&R Style)
* **ตัวอย่าง:**
    ```javascript
    if (userRole === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/");
    }
    ```

### 2.4 เครื่องหมายเซมิโคลอน (Semicolons)
* ให้ใส่เซมิโคลอน `;` ที่จุดสิ้นสุดของ Statement เสมอ เพื่อป้องกันข้อผิดพลาดจาก Automatic Semicolon Insertion (ASI) ของ JavaScript

---

## 3. การอธิบายโค้ด (Comments)

การเขียน Comment ควรเขียนเพื่ออธิบาย **"ทำไมถึงเขียนแบบนี้" (Why)** มากกว่า "เขียนอะไร" (What) เนื่องจากโค้ดที่ดีควรสื่อความหมายด้วยตัวมันเองอยู่แล้ว (Self-documenting code)

### 3.1 Inline Comments
* ใช้ `//` สำหรับอธิบายลอจิกสั้นๆ ในบรรทัดที่ซับซ้อน หรืออธิบายเหตุผลทางธุรกิจ (Business Rule)
* **ตัวอย่าง:**
    ```javascript
    // แอบแกะ Token ดูว่าใช่ Admin จริงไหม ถ้าไม่ใช่เตะกลับหน้าแรกเลย
    const payload = JSON.parse(atob(token.split(".")[1]));
    ```

### 3.2 Function Documentation (JSDoc Style)
* ใช้ `/** ... */` สำหรับฟังก์ชันหรือ API ที่มีความซับซ้อน เพื่ออธิบายพารามิเตอร์และผลลัพธ์ที่ส่งกลับ
* **ตัวอย่าง:**
    ```javascript
    /**
     * อัปเดตสถานะของ Workshop (Approve/Reject)
     * @param {Object} req - Express request object (รับ params.id และ body.status)
     * @param {Object} res - Express response object
     * @returns {JSON} แจ้งผลการอัปเดตสถานะ
     */
    async updateWorkshopStatus(req, res) { ... }
    ```

### 3.3 TODO Comments
* หากมีส่วนที่ต้องกลับมาแก้ไขหรือทำต่อ ให้ใช้ `// TODO:` ตามด้วยสิ่งที่ต้องทำ เพื่อให้ง่ายต่อการค้นหา
* **ตัวอย่าง:** `// TODO: เพิ่มระบบส่งอีเมลแจ้งเตือนเมื่อ Workshop ได้รับการอนุมัติ`