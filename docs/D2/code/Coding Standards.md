# 📘 Coding Standards
## University Workshop Registration System

Version: 1.0  
Last Updated: February 2026  
Owner: Development Team  
Approved By: Tech Lead / Scrum Master  

---

# 📋 Table of Contents
1. Project Overview
2. Naming Conventions
3. Code Structure
4. Comments & Documentation
5. Error Handling
6. Testing Standards
7. Security Standards
8. Git & Pull Request Rules
9. Common Issues to Avoid
10. References

---

# 1️⃣ Project Overview

## System Name
University Workshop Registration System

## Description
ระบบลงทะเบียน Workshop สำหรับมหาวิทยาลัย  
รองรับ Student / Organizer / Admin / Approver

## Tech Stack
- Frontend: React + Vite + TailwindCSS
- Backend: Node.js + Express.js
- Database: MySQL
- Authentication: JWT

## Environment
- Development
- Testing
- Production

## Tools
- Node.js 18+
- ESLint
- Prettier
- GitHub
- Jest

---

# 2️⃣ Naming Conventions

## Class Names
- PascalCase
- ใช้คำนาม

Backend Classes :
class AuthService {}
class WorkshopController {}
class WorkshopRepository {}

Frontend Components :
const LoginForm = () => { ... }
const WorkshopCard = () => { ... }


---

## Function / Method Names
- camelCase
- ใช้คำกริยา

Getters :
getUserById(id)
findActiveWorkshops()

Actions :
registerStudent(studentId, workshopId)
updateWorkshopStatus(id, status)
deleteEnrollment(id)

Checkers (Returns Boolean) :
isSeatAvailable(workshopId)
hasUserRegistered(userId)


---

## Variable Names
- camelCase
- ชื่อชัดเจน

const totalSeats = 50;

const isWorkshopActive = true;

const currentUser = await userRepository.findById(id);

const workshopList = [];

---

## Constants
const MAX_LOGIN_ATTEMPTS = 5;

const DEFAULT_PAGE_SIZE = 20;

const JWT_EXPIRATION = '1d';

const WORKSHOP_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};


---

# 3️⃣ Code Structure

## Backend Structure
server/
controllers/
services/
models/
routes/
middleware/
config/
utils/


Rules:
- route → controller → service → model
- ห้าม query database ใน route
- business logic อยู่ service เท่านั้น

---

## Frontend Structure
src/
pages/
components/
services/
hooks/
layouts/
utils/


Rules:
- 1 component ต่อ 1 file
- API calls อยู่ services
- ใช้ functional components

---

# 4️⃣ Comments & Documentation

## JSDoc Required
/**

สมัคร workshop

@param {number} userId

@param {number} workshopId
*/


## Comment Guidelines
ควร comment:
- business logic
- algorithm
- security reason

ห้าม:
- comment obvious code
- comment ที่ล้าสมัย

---

# 5️⃣ Error Handling

Rules:
- ใช้ try/catch
- ใช้ custom error class
- return HTTP status code ถูกต้อง
- ไม่ส่ง stack trace ไป frontend

Example:
try {
const data = await service.createWorkshop(req.body)
} catch(error){
return res.status(500).json({message:error.message})
}


---

# 6️⃣ Testing Standards

Tool:
- Jest

Test Structure:
tests/
unit/
integration/


Naming:
auth.test.js
workshop.service.test.js


Coverage Target:
- Functions ≥ 80%
- Lines ≥ 80%

---

# 7️⃣ Security Standards

Required:
- Validate input ทุก API
- Hash password ด้วย bcrypt
- ใช้ JWT middleware
- ใช้ parameterized query
- ใช้ environment variables

Forbidden:
- Hardcoded password
- SQL injection
- plaintext password
- log sensitive data

---

# 8️⃣ Git & Pull Request Rules

## Branch Naming
main
develop
feature/*
bugfix/*
hotfix/*


---

## Commit Message
feat: add workshop creation
fix: login validation bug
docs: update README
refactor: split controller


---

## Pull Request Checklist
- [ ] Code lint ผ่าน
- [ ] Tests ผ่าน
- [ ] Reviewer ≥ 1 คน
- [ ] Description ครบ
- [ ] ไม่มี conflict

---