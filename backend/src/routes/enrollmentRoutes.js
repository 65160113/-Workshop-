// backend/src/routes/enrollmentRoutes.js
const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");
const { verifyToken } = require("../middleware/authMiddleware"); // เอาตัวตรวจบัตรมาใช้

// ต้องมี Token (ต้อง Login) ถึงจะใช้ 2 เส้นนี้ได้
router.get("/my-workshops", verifyToken, enrollmentController.getMyEnrollments);
router.post("/", verifyToken, enrollmentController.enrollWorkshop);

module.exports = router;
