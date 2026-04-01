# D2: Design Patterns Document

ในการพัฒนาระบบ Workshop Management System ได้มีการนำ **Software Design Patterns** มาประยุกต์ใช้เพื่อแก้ปัญหาการออกแบบโครงสร้างซอฟต์แวร์ ทำให้โค้ดเป็นระเบียบ นำกลับมาใช้ใหม่ได้ (Reusable) และดูแลรักษาง่าย โดยในระบบนี้มีการใช้ 5 Patterns หลัก ดังนี้:

---

## 1. MVC (Model-View-Controller) Pattern
เป็น Pattern พื้นฐานที่ใช้ในการแยกส่วนการแสดงผล (View) ออกจากการประมวลผล (Controller) และการจัดการข้อมูล (Model) อย่างชัดเจน
* **จุดที่ใช้งานในระบบ:** โครงสร้างหลักของฝั่ง Backend (`backend/src/`)
  * **Model:** การจัดการ Data Layer โดยมีการแยกชั้น Data Access ออกมาไว้ในโฟลเดอร์ `repositories/` เพื่อโต้ตอบกับฐานข้อมูล MySQL อย่างเป็นระเบียบ
  * **View:** หน้าจอฝั่ง Frontend (React.js) ที่ทำหน้าที่รับและแสดงผลข้อมูลให้ผู้ใช้
  * **Controller:** ไฟล์ในโฟลเดอร์ `controllers/` ที่รับ Request จาก Router มาประมวลผลตรรกะทางธุรกิจ (โดยมีการเรียกใช้งาน `services/` ร่วมด้วย) ก่อนส่งข้อมูลกลับไปให้ View
* **เหตุผลที่ใช้:** ช่วยแยกความรับผิดชอบ (Separation of Concerns) ทำให้ฝั่ง Frontend และ Backend สามารถพัฒนาควบคู่กันไปได้โดยอิสระ และหากต้องการเปลี่ยนหน้าตาเว็บ (UI) ก็ไม่ต้องไปยุ่งกับตรรกะฝั่งหลังบ้าน

## 2. Singleton Pattern
เป็น Creational Pattern ที่รับประกันว่าคลาสหรือออบเจ็กต์นั้นจะถูกสร้างขึ้นมาเพียง **"อินสแตนซ์เดียว (Single Instance)"** ตลอดการทำงานของแอปพลิเคชัน และมีจุดเรียกใช้งานร่วมกันจากส่วนกลาง
* **จุดที่ใช้งานในระบบ:** ไฟล์ `backend/src/config/db.config.js` 
* **ตัวอย่างการทำงาน:** ระบบทำการสร้าง **Database Connection Pool** (`mysql.createPool`) เพียงครั้งเดียวตอนที่เซิร์ฟเวอร์เริ่มทำงาน จากนั้นทุกๆ ส่วนที่ต้องการดึงข้อมูล จะ `require` ตัวแปร `pool` ตัวเดียวกันนี้ไปใช้งาน
* **เหตุผลที่ใช้:** เพื่อป้องกันปัญหาการสร้าง Connection ใหม่ทุกครั้งที่มีคนเรียก API (ซึ่งจะทำให้ฐานข้อมูลล่มจาก Connection Overload) การใช้ Pool แบบ Singleton ช่วยประหยัดทรัพยากร (Memory & CPU) และบริหารจัดการคิวการเชื่อมต่อฐานข้อมูลได้อย่างมีประสิทธิภาพสูงสุด

## 3. Chain of Responsibility Pattern
เป็น Behavioral Pattern ที่อนุญาตให้ส่งต่อ Request ไปตาม "ห่วงโซ่ของตัวประมวลผล (Handlers)" โดยแต่ละจุดสามารถตัดสินใจว่าจะประมวลผล Request นั้น หรือจะส่งต่อให้ Handler ถัดไป หรือจะปฏิเสธการเข้าถึง
* **จุดที่ใช้งานในระบบ:** ระบบ Middleware ของ Express.js ในไฟล์เส้นทาง (`backend/src/routes/`) และไฟล์จัดการสิทธิ์ `backend/src/middleware/authMiddleware.js`
* **ตัวอย่างการทำงาน:** เมื่อมีการเรียก API เช่น `router.get("/pending", verifyToken, verifyRoles("admin", "approver"), workshopController.getPendingWorkshops);`
  1. `verifyToken` ตรวจสอบก่อนว่ามีบัตร (Token) ไหม ถ้าไม่มีก็เตะออก (Error 401) ถ้ามีก็ใช้ `next()` ส่งต่อ
  2. `verifyRoles` ตรวจสอบต่อว่าบัตรนั้นมีสิทธิ์ระดับ "admin" หรือ "approver" หรือไม่ ถ้าไม่ใช่ก็เตะออก (Error 403) ถ้าใช่ก็ใช้ `next()` ส่งต่อ
  3. `workshopController` คือปลายทางที่ได้ทำงานและส่งข้อมูลกลับไป
* **เหตุผลที่ใช้:** ทำให้ระบบ Security มีความยืดหยุ่นสูง สามารถนำ Middleware ตัวเดิมไปแปะขวาง API เส้นไหนก็ได้โดยไม่ต้องเขียนโค้ดตรวจสอบสิทธิ์ซ้ำๆ ในทุก Controller

## 4. Observer Pattern (ผ่าน React Hooks)
เป็น Behavioral Pattern ที่กำหนดความสัมพันธ์แบบ One-to-Many เมื่อออบเจ็กต์หนึ่ง (Subject/State) มีการเปลี่ยนแปลงสถานะ ออบเจ็กต์อื่นๆ ที่ติดตามอยู่ (Observers/UI Components) จะได้รับการแจ้งเตือนและอัปเดตตัวเองโดยอัตโนมัติ
* **จุดที่ใช้งานในระบบ:** การจัดการ State ในฝั่ง Frontend (React.js) ด้วย `useState` และ `useEffect` (เช่นในหน้า `AdminDashboardPage.jsx` หรือ `EditWorkshopPage.jsx`)
* **ตัวอย่างการทำงาน:** เมื่อ Admin กดปุ่ม "Approve" งาน ระบบจะส่ง API ไปอัปเดตหลังบ้าน และเรียกฟังก์ชัน `fetchData()` ใหม่ ทำให้ตัวแปร State `workshops` และ `stats` เปลี่ยนแปลง ส่งผลให้ React ทำการ Re-render ตารางและกล่องตัวเลขสถิติบนหน้าจอทันทีโดยไม่ต้องกดรีเฟรชหน้าเว็บ
* **เหตุผลที่ใช้:** ทำให้หน้าเว็บมีการตอบสนองแบบ Real-time (Reactive UI) และลดความซับซ้อนในการต้องเขียนคำสั่งจัดการ DOM (Document Object Model) ด้วยตัวเอง (เช่น การใช้ `document.getElementById`)

## 5. Repository Pattern
เป็น Architectural Pattern ที่ทำหน้าที่เป็นตัวกลาง (Abstraction Layer) ระหว่าง Business Logic กับ Data Source (ฐานข้อมูล)
* **จุดที่ใช้งานในระบบ:** โฟลเดอร์ `backend/src/repositories/` (เช่น `userRepository.js`) และการทำงานร่วมกับโฟลเดอร์ `services/`
* **ตัวอย่างการทำงาน:** แทนที่ Controller หรือ Service จะเขียนคำสั่ง SQL (เช่น `SELECT * FROM users`) โดยตรง ระบบจะเรียกใช้งานผ่าน Repository เช่น `await userRepository.findAll()` เพื่อให้ Repository เป็นผู้จัดการคำสั่ง SQL และคืนค่าเป็น Data Object กลับมา
* **เหตุผลที่ใช้:** 
1. โค้ดใน Controller และ Service จะสะอาดและอ่านง่ายขึ้นมากเพราะไม่ต้องมีคำสั่ง SQL ปะปน
  2. ลดความซ้ำซ้อนของการเขียนคำสั่ง SQL เดิมๆ ในหลายๆ ที่ (DRY - Don't Repeat Yourself)
  3. หากในอนาคตมีการเปลี่ยนโครงสร้างฐานข้อมูล หรือเปลี่ยนเครื่องมือ (เช่น ไปใช้ ORM อย่าง Prisma หรือ Sequelize) ก็สามารถแก้ไขแค่ในโฟลเดอร์ `repositories` โดยไม่กระทบกับ Business Logic ของระบบเลย