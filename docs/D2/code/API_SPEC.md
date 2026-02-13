# 🔌 API Specifications
> **Project:** University Workshop Registration System
> **Version:** 1.0.0
> **Base URL:** `http://localhost:3000/api`

## 🔐 Authentication (ระบบยืนยันตัวตน)

### 1. Register (สมัครสมาชิก)
* **Endpoint:** `POST /auth/register`
* **Access:** Public
* **Description:** ลงทะเบียนผู้ใช้งานใหม่

**Request Body:**
```json
{
  "username": "student01",
  "password": "password123",
  "first_name": "Somchai",
  "last_name": "Jaidee",
  "email": "somchai@univ.ac.th",
  "role": "student", // student, organizer
  "faculty_id": 1
}
```
Response (201 Created):

```json
{
  "message": "User registered successfully",
  "userId": 101
}
```
### 2. Login (เข้าสู่ระบบ)
* **Endpoint:** `POST /auth/login`
* **Access:** Public
* **Description:** ตรวจสอบรหัสผ่านและรับ Token

**Request Body:**
```json
{
  "username": "student01",
  "password": "password123"
}
```
Response (200 OK):

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR...", // JWT Token
  "user": {
    "id": 101,
    "username": "student01",
    "role": "student",
    "first_name": "Somchai"
  }
}
```
## 📚 Workshops (จัดการข้อมูลกิจกรรม)
### 3. Get All Workshops (ดูรายการกิจกรรมทั้งหมด)
* **Endpoint:** `GET /workshops`
* **Access:** Public
* **Description:** ดึงข้อมูลกิจกรรมทั้งหมด (รองรับการค้นหา)
* **Query Params:** `?search=react&category_id=2`

Response (200 OK):

```json
[
  {
    "workshop_id": 1,
    "title": "Basic React Workshop",
    "description": "Learn React from zero",
    "start_time": "2023-12-01 09:00:00",
    "seats_available": 25,
    "status": "Approved",
    "category_name": "Technology",
    "organizer_name": "Ajarn Dang"
  },
  {
    "workshop_id": 2,
    "title": "English for Career",
    ...
  }
]
```
### 4. Get Workshop Detail (ดูรายละเอียดกิจกรรม)
* **Endpoint:** `GET /workshops/:id`
* **Access:** Public
Response (200 OK):

```json
{
  "workshop_id": 1,
  "title": "Basic React Workshop",
  "description": "Full day workshop...",
  "meeting_url": "[https://zoom.us/j/123456](https://zoom.us/j/123456)", // เห็นเฉพาะคนที่ลงทะเบียนแล้ว
  "organizer_id": 5,
  "participants_count": 25,
  "max_seats": 50
}
```
### 5. Create Workshop (สร้างกิจกรรมใหม่)
* **Endpoint:** `POST /workshops`
* **Access:** Organizer Only (Requires Token)
* **Header:** Authorization: Bearer <token>

Request Body:

```json
{
  "title": "Advanced Node.js",
  "description": "Deep dive into Backend",
  "start_time": "2023-12-15 09:00:00",
  "end_time": "2023-12-15 16:00:00",
  "capacity": 30,
  "meeting_url": "[https://meet.google.com/abc-defg-hij](https://meet.google.com/abc-defg-hij)",
  "category_id": 1,
  "platform_id": 1
}
```
Response (201 Created):

```json
{
  "message": "Workshop created successfully",
  "workshop_id": 55
}
```
### 6. Update Status (อนุมัติกิจกรรม - Admin Only)
* **Endpoint:** `PATCH /workshops/:id/status`
* **Access:** Admin / Approver Only

Request Body:

```json
{
  "status": "Approved" // หรือ "Rejected"
}
```

## 📝 Enrollments (การลงทะเบียน)
### 7. Enroll in Workshop (สมัครเข้าร่วม)
* **Endpoint:** `POST /enrollments`
* **Access:** Student Only
Request Body:

```json
{
  "workshop_id": 1
}
```
Response (201 Created):

```json
{
  "message": "Enrollment successful",
  "enrollment_id": 501
}
```
Error Response (400 Bad Request):

```json
{
  "error": "Workshop is full" // หรือ "Already enrolled"
}
```
### 8. Get My History (ดูประวัติการสมัครของฉัน)
* **Endpoint:** `GET /users/me/enrollments`
* **Access:** Student Only

Response (200 OK):

```json
[
  {
    "enrollment_id": 501,
    "workshop_title": "Basic React Workshop",
    "registered_at": "2023-11-20 10:30:00",
    "status": "Active"
  }
]
```
### 9. Cancel Enrollment (ยกเลิกการสมัคร)
* **Endpoint:** `DELETE /enrollments/:id`
* **Access:** Student Only (Owner)

Response (200 OK):

```json
{
  "message": "Enrollment cancelled successfully"
}
```
## 📊 Admin & Reports (รายงานผล)
### 10. Get Workshop Attendees (ดูรายชื่อคนเข้าอบรม)
* **Endpoint:** `GET /workshops/:id/attendees`
* **Access:** Organizer / Admin Only

Response (200 OK):

```json
[
  {
    "user_id": 101,
    "full_name": "Somchai Jaidee",
    "email": "somchai@univ.ac.th",
    "faculty": "Science",
    "registered_at": "2023-11-20"
  },
  {
    "user_id": 102,
    "full_name": "Somsri Rakrian",
    ...
  }
]
```