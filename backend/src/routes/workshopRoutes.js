// backend/src/routes/workshopRoutes.js
const express = require("express");
const router = express.Router();
const workshopController = require("../controllers/workshopController");

// เมื่อมีคนเรียก GET /api/workshops ให้วิ่งไปทำงานที่ Controller
router.get("/", workshopController.getAllWorkshops);
router.get("/:id", workshopController.getWorkshopById);

module.exports = router;
