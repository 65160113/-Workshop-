**Test Plan Document**

## **1\. Introduction**

* โปรเจกต์ : ระบบลงทะเบียนอบรมและเวิร์กชอปออนไลน์  
* เวอร์ชัน : 1.0  
* วันที่ : 23 มีนาคม 2569  
* ผู้เขียน : กมลนัทธ์ ทรงมิตร / ขวัญข้าว เสาโร

## **2\. Testing Scope**

* ฟีเจอร์ที่ทดสอบ  
1. การจัดการบัญชี และสิทธิ์การเข้าถึง  
2. การค้นหาและกรองเวิร์กชอป  
3. การสร้างเวิร์กชอป และการลงทะเบียนเวิร์กชอป  
4. การอนุมัติเวิร์กชอป  
5. การบริหารจัดการบัญชีผู้ใช้งานโดยผู้ดูแล  
* ฟีเจอร์ที่ไม่ทดสอบ

## **3\. กลยุทธ์การทดสอบ (Testing Strategy)**

* Unit Testing  
* ทดสอบ: ฟังก์ชัน, methods, logic  
* ขอบเขต: 47 test cases  
* Coverage: \>= 80%  
* Framework: Jest

การยืนยันตัวตน (Authentication) — 12 กรณี

* test\_register\_withValidEmail\_returnsUser  
* test\_register\_withDuplicateEmail\_throwsError  
* test\_register\_withInvalidEmail\_throwsError  
* test\_register\_withEmptyFields\_throwsError  
* test\_login\_withCorrectCredentials\_returnsToken  
* test\_login\_withWrongPassword\_throwsError  
* test\_login\_withNonExistingUser\_throwsError  
* test\_validateToken\_withValidToken\_returnsUser  
* test\_validateToken\_withExpiredToken\_returnsNull  
* test\_validateToken\_withInvalidToken\_returnsNull  
* test\_logout\_clearsToken  
* test\_passwordEncryption\_storesHashedPassword

การสร้างและแก้ไข (Workshop) — 14 กรณี

* test\_createWorkshop\_withValidData\_succeeds  
* test\_createWorkshop\_withMissingFields\_throwsError  
* test\_createWorkshop\_withInvalidDate\_throwsError  
* test\_getAllWorkshops\_returnsList  
* test\_getWorkshopById\_withValidId\_returnsWorkshop  
* test\_getWorkshopById\_withInvalidId\_returnsNull  
* test\_updateWorkshop\_withValidData\_succeeds  
* test\_updateWorkshop\_withInvalidId\_throwsError  
* test\_enrollWorkshop\_withAvailableSeats\_succeeds  
* test\_enrollWorkshop\_whenFull\_throwsError  
* test\_enrollWorkshop\_withDuplicateUser\_throwsError  
* test\_cancelEnrollment\_withValidUser\_succeeds  
* test\_cancelEnrollment\_withNonExistingUser\_throwsError  
* test\_getParticipants\_returnsUserList

การจองที่นั่งและลงทะเบียน (Seat / Enrollment) — 12 กรณี

* test\_sendEmailNotification\_onStatusChange\_within60Seconds  
* test\_sendNotification\_toCorrectUser\_byIssueId  
* test\_sendNotification\_toSamo\_onNewIssueInFaculty  
* test\_sendNotification\_toOfficer\_onForwardFromSamo  
* test\_sendEmergencyAlert\_toAllUsers\_bySeverity  
* test\_notification\_channel\_email\_savesToTable  
* test\_notification\_channel\_app\_savesToTable  
* test\_getNotificationHistory\_byUserId\_returnsCorrectList  
* test\_notification\_mustLinkToIssueOrAlert\_notBoth  
* test\_notification\_withNullIssueAndNullAlert\_throwsConstraintError  
* test\_saveNotificationSettings\_toggleOffEmail\_doesNotSend  
* test\_saveNotificationSettings\_filterByCategory\_onlySendsRelevant

(Utility Functions) — 9 กรณี

* test\_isValidEmail\_withValidEmail\_returnsTrue  
* test\_isValidEmail\_withoutAtSymbol\_returnsFalse  
* test\_isValidEmail\_withoutDot\_returnsFalse  
* test\_isValidEmail\_withEmptyString\_returnsFalse  
* test\_isValidEmail\_withUndefined\_returnsFalse  
* test\_formatDate\_withValidDate\_returnsFormattedString  
* test\_formatDate\_withInvalidDate\_returnsError  
* test\_generateUniqueId\_returnsDifferentValues  
* test\_generateUniqueId\_returnsNonEmptyString

### **Integration Testing**

* ทดสอบ: การทำงานร่วมกันระหว่างโมดูล  
* ขอบเขต: 5 ชุดทดสอบ  
1. การดึงข้อมูล Workshop (Retrieval)  
* ดึง Workshop ทั้งหมด → 200 OK \+ Array ของ Workshop  
* กรณี DB error → 500 Internal Server Error  
* ดึงข้อมูล Workshop รายตัว (มีข้อมูล) → 200 OK \+ ข้อมูล Workshop  
* ดึงข้อมูล Workshop รายตัว (ไม่มีข้อมูล) → 404 Not Found  
* ดึง Workshop ของตัวเอง → 200 OK \+ รายการของผู้ใช้  
* ดึงรายชื่อคนสมัคร→ 200 OK \+ รายชื่อผู้สมัคร  
* ดึงงานที่รออนุมัติ → 200 OK \+ รายการ pending  
2. การสร้างและแก้ไข Workshop (Create & Update)  
* สร้าง Workshop ใหม่ (ข้อมูลครบ) → 201 Created  
* สร้าง Workshop ใหม่ (ข้อมูลไม่ครบ) → 400 Bad Request  
* DB error → 500 Internal Server Error  
* แก้ไข Workshop (สำเร็จ) → 200 OK  
* แก้ไข Workshop (ไม่มีสิทธิ์/ไม่พบ) → 403 Forbidden  
* DB error → 500 Internal Server Error  
3. การจัดการสถานะ Workshop (Workflow / Status)  
* เปลี่ยนสถานะการอนุมัติ/ไม่อนุมัติ (status ถูกต้อง) → 200 OK  
* เปลี่ยนสถานะการอนุมัติ/ไม่อนุมัติ (status ไม่ถูกต้อง) → 400 Bad Request  
* DB error → 500 Internal Server Error  
4. การสมัครและยกเลิก (Enrollment)  
* เช็คสถานะการสมัคร (สมัครแล้ว) → 200 OK \+ isEnrolled: true  
* เช็คสถานะการสมัคร (ยังไม่สมัคร) → 200 OK \+ isEnrolled: false  
* DB error → 500 Internal Server Error  
* ยกเลิกการสมัคร (สำเร็จ) → 200 OK  
* ยกเลิกการสมัคร (ไม่พบข้อมูล/กดยกเลิกซ้ำ) → 400 Bad Request  
* DB error → 500 Internal Server Error  
5. การจัดการข้อผิดพลาด (Error Handling)  
* กรณีระบบมีปัญหา (DB ล่ม) → 500 Internal Server Error  
* เช็คสถานะการสมัคร → 500  
* ยกเลิกการสมัคร → 500  
* แก้ไข Workshop → 500  
* สร้าง Workshop → 500  
* เปลี่ยนสถานะ → 500 

### **System Testing / End-to-End**

* ทดสอบ: กระบวนการทำงานตั้งแต่ต้นจนจบ  
* Scenario: 7 สถานการณ์

Scenario 1: ผู้ใช้ดู Workshop

* เปิดหน้า Home → ระบบดึงรายการ Workshop → แสดงข้อมูลสำเร็จ

 Scenario 2: ดูรายละเอียด Workshop

* เลือก Workshop → แสดงรายละเอียด → ถ้าไม่พบ → แจ้ง 404 

Scenario 3: สร้าง Workshop ใหม่

* กรอกข้อมูลครบ → สร้างสำเร็จ → ได้ข้อความยืนยัน → กรอกไม่ครบ → แจ้ง 400 

Scenario 4: ผู้ใช้จัดการ Workshop ของตัวเอง

* ดู My Workshops → แก้ไขข้อมูล → บันทึกสำเร็จ → ถ้าไม่มีสิทธิ์ → 403 

Scenario 5: ระบบอนุมัติ Workshop 

* ผู้ดูแลเปลี่ยน status → สำเร็จ → ส่ง status ผิด → 400

Scenario 6: การสมัครและยกเลิก

* ผู้ใช้เช็คสถานะ → สมัครแล้ว/ยังไม่สมัคร → กดยกเลิก → สำเร็จ / ถ้าไม่พบ → 400

Scenario 7: ระบบล่ม (Error Handling)

* Database ล่ม → ทุก API ที่เกี่ยวข้อง → 500

### **UAT (User Acceptance Testing)**

* ทดสอบกับ: ตัวแทนผู้ใช้จริง  
* scenarios: 4 สถานการณ์จากการใช้งานจริง  
* scenarios 1: นักศึกษา — ลงทะเบียนกิจกรรมเวิร์กชอป ทำสำเร็จภายใน 5 นาที  
* scenarios 2: ผู้จัดอบรม — สร้างกิจกรรมเวิร์กชอป ทำสำเร็จภายใน 5 นาที  
* scenarios 3: ผู้อนุมัติ — อนุมัติกิจกรรมที่ผู้จัดอบรมสร้าง ทำสำเร็จภายใน 15 นาที  
* scenarios 4: ผู้ดูแลระบบ — จัดการสิทธิ์ผู้ใช้งาน ทำสำเร็จภายใน 10 นาที

## **4\. Test Tools & Environment**

* ทดสอบหน่วย: Jest  
* ทดสอบการผสานระบบ: Supertest / Postman  
* ทดสอบครบวงจร: Playwright

ตัวชี้วัดการทดสอบ (Test Metrics)

* ความครอบคลุมโค้ด: \>= 80%  
* อัตราการผ่านการทดสอบ: 100% (ทุกกรณีต้องผ่าน)  
* จำนวนข้อผิดพลาดระดับวิกฤตที่ยอมรับได้: 0  
* เวลาในการรันการทดสอบทั้งหมด: \< 2 นาที