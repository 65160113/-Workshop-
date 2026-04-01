# D2: Data Dictionary

เอกสารฉบับนี้อธิบายโครงสร้างและรายละเอียดของแต่ละฟิลด์ (Fields) ในฐานข้อมูล `workshop_db` ที่ใช้ในระบบ Workshop Management System โดยแบ่งออกเป็นตาราง Master Data, ตารางข้อมูลผู้ใช้ และตารางธุรกรรม (Transactions)

---

## 1. ตาราง Master Data (ข้อมูลพื้นฐาน)

### 1.1 Table: `faculties` (เก็บข้อมูลคณะ)
| ชื่อฟิลด์ (Field) | ชนิดข้อมูล (Data Type) | ข้อจำกัด (Constraints) | คำอธิบาย (Description) |
| :--- | :--- | :--- | :--- |
| `faculty_id` | INT | PK, AUTO_INCREMENT | รหัสประจำคณะ (Primary Key) |
| `name` | VARCHAR(100) | UNIQUE, NOT NULL | ชื่อคณะ |

### 1.2 Table: `categories` (เก็บข้อมูลหมวดหมู่ Workshop)
| ชื่อฟิลด์ (Field) | ชนิดข้อมูล (Data Type) | ข้อจำกัด (Constraints) | คำอธิบาย (Description) |
| :--- | :--- | :--- | :--- |
| `category_id` | INT | PK, AUTO_INCREMENT | รหัสหมวดหมู่ (Primary Key) |
| `name` | VARCHAR(100) | UNIQUE, NOT NULL | ชื่อหมวดหมู่กิจกรรม |

### 1.3 Table: `platforms` (เก็บข้อมูลรูปแบบการจัดงาน)
| ชื่อฟิลด์ (Field)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | ชนิดข้อมูล (Data Type) | ข้อจำกัด (Constraints) | คำอธิบาย (Description) |
| :--- | :--- | :--- | :--- |
| `platform_id` | INT | PK, AUTO_INCREMENT | รหัสรูปแบบการจัดงาน (Primary Key) |
| `name` | VARCHAR(50) | UNIQUE, NOT NULL | รูปแบบการจัด (เช่น Zoom, Google Meet, On-site) |

---

## 2. ตารางผู้ใช้งานและสิทธิ์ (Users & Roles)

### 2.1 Table: `users` (เก็บข้อมูลสมาชิกในระบบ)
| ชื่อฟิลด์ (Field)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | ชนิดข้อมูล (Data Type) | ข้อจำกัด (Constraints) | คำอธิบาย (Description) |
| :--- | :--- | :--- | :--- |
| `user_id` | INT | PK, AUTO_INCREMENT | รหัสประจำตัวผู้ใช้งาน (Primary Key) |
| `username` | VARCHAR(50) | UNIQUE, NOT NULL | ชื่อผู้ใช้สำหรับล็อกอิน |
| `password_hash` | VARCHAR(255) | NOT NULL | รหัสผ่านที่ผ่านการเข้ารหัส (Hashed) |
| `email` | VARCHAR(100) | UNIQUE, NOT NULL | อีเมลติดต่อ |
| `first_name` | VARCHAR(100) | NOT NULL | ชื่อจริง |
| `last_name` | VARCHAR(100) | NOT NULL | นามสกุล |
| `role` | ENUM | DEFAULT 'student', NOT NULL | สิทธิ์การใช้งาน ('student', 'organizer', 'admin', 'approver') |
| `faculty_id` | INT | FK (NULLABLE) | อ้างอิงรหัสคณะ (เชื่อมตาราง `faculties`) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | วันและเวลาที่สมัครสมาชิก |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | วันและเวลาที่แก้ไขข้อมูลโปรไฟล์ล่าสุด |

---

## 3. ตารางธุรกรรมหลัก (Main Transactions)

### 3.1 Table: `workshops` (เก็บรายละเอียดกิจกรรม Workshop)
| ชื่อฟิลด์ (Field)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | ชนิดข้อมูล (Data Type) | ข้อจำกัด (Constraints) | คำอธิบาย (Description) |
| :--- | :--- | :--- | :--- |
| `workshop_id` | INT | PK, AUTO_INCREMENT | รหัสกิจกรรม (Primary Key) |
| `title` | VARCHAR(255) | NOT NULL | ชื่อหัวข้อกิจกรรม |
| `description` | TEXT | NULL | รายละเอียดกิจกรรม |
| `speaker_name` | VARCHAR(150)| NULL | ชื่อวิทยากรบรรยาย |
| `start_time` | DATETIME | NOT NULL | วันและเวลาที่เริ่มกิจกรรม |
| `end_time` | DATETIME | NOT NULL | วันและเวลาที่สิ้นสุดกิจกรรม |
| `max_seats` | INT | NOT NULL | จำนวนที่นั่งสูงสุดที่เปิดรับสมัคร |
| `meeting_url` | TEXT | NULL | ลิงก์ห้องเรียนออนไลน์ |
| `location_detail` | TEXT | NULL | รายละเอียดสถานที่จัดงาน (On-site) |
| `status` | ENUM | DEFAULT 'pending' | สถานะของงาน ('pending', 'approved', 'rejected') |
| `organizer_id` | INT | FK, NOT NULL | รหัสผู้จัดงาน (เชื่อมตาราง `users`) |
| `category_id` | INT | FK (NULLABLE) | รหัสหมวดหมู่ (เชื่อมตาราง `categories`) |
| `platform_id` | INT | FK (NULLABLE) | รหัสรูปแบบจัดงาน (เชื่อมตาราง `platforms`) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | วันและเวลาที่สร้าง Workshop |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | วันและเวลาที่แก้ไขข้อมูลล่าสุด |

### 3.2 Table: `enrollments` (เก็บประวัติการลงทะเบียน)
| ชื่อฟิลด์ (Field)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | ชนิดข้อมูล (Data Type) | ข้อจำกัด (Constraints) | คำอธิบาย (Description) |
| :--- | :--- | :--- | :--- |
| `enrollment_id` | INT | PK, AUTO_INCREMENT | รหัสการลงทะเบียน (Primary Key) |
| `user_id` | INT | FK, NOT NULL | รหัสผู้สมัคร (เชื่อมตาราง `users`) |
| `workshop_id` | INT | FK, NOT NULL | รหัสกิจกรรมที่สมัคร (เชื่อมตาราง `workshops`) |
| `status` | ENUM | DEFAULT 'active' | สถานะการสมัคร ('active', 'cancelled') |
| `registered_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | วันและเวลาที่กดยืนยันการลงทะเบียน |

*(หมายเหตุ: มีการทำ `UNIQUE KEY` คู่กันระหว่าง `user_id` และ `workshop_id` เพื่อป้องกันผู้ใช้งานกดสมัครงานเดิมซ้ำซ้อน)*