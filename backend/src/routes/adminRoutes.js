// backend/src/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyToken, verifyRoles } = require("../middleware/authMiddleware");

// กำหนดให้เฉพาะคนที่ล็อคอิน และมี Role เป็น "admin" เท่านั้นที่เข้าได้
router.get(
  "/stats",
  verifyToken,
  verifyRoles("admin", "approver"),
  adminController.getDashboardStats,
);

// 🌟 เส้นทางดูรายชื่อผู้ใช้งานทั้งหมด
router.get(
  "/users",
  verifyToken,
  verifyRoles("admin"),
  adminController.getAllUsers,
);

// 🌟 เส้นทางอัปเดตสิทธิ์ (Role) ผู้ใช้งาน
router.patch(
  "/users/:id/role",
  verifyToken,
  verifyRoles("admin"),
  adminController.updateUserRole
);

module.exports = router;
