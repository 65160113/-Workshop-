// backend/src/routes/workshopRoutes.js
const express = require("express");
const router = express.Router();
const workshopController = require("../controllers/workshopController");
const { verifyToken, verifyRoles } = require("../middleware/authMiddleware");

// เมื่อมีคนเรียก GET /api/workshops ให้วิ่งไปทำงานที่ Controller
router.get("/", workshopController.getAllWorkshops);
router.get("/:id", workshopController.getWorkshopById);
router.post("/", workshopController.createWorkshop);
router.post(
  "/",
  verifyToken,
  verifyRoles("admin", "organizer"),
  workshopController.createWorkshop,
);

module.exports = router;
