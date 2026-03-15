// backend/src/routes/authRoutes.js
const express = require("express");
const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// เมื่อมีคนยิง POST มาที่ /register ให้ Controller จัดการ
// (ใช้ .bind เพื่อไม่ให้สูญเสีย context ของคำว่า this ในคลาส)
router.post("/register", authController.register.bind(authController));

// เพิ่มเส้นทางสำหรับ Login
router.post('/login', authController.login.bind(authController));

// 🌟 2. เพิ่ม API เส้นดึงข้อมูลตัวเอง (GET /me)
router.get("/me", verifyToken, authController.getMyProfile.bind(authController));

module.exports = router;
