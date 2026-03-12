// backend/src/routes/masterRoutes.js
const express = require("express");
const router = express.Router();
const masterController = require("../controllers/masterController");

// เปิด 2 เส้นทางให้หน้าบ้านมาดูดข้อมูล 
router.get("/categories", masterController.getCategories);
router.get("/platforms", masterController.getPlatforms);
router.get("/faculties", masterController.getFaculties);

module.exports = router;