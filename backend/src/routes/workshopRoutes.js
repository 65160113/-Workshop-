const express = require("express");
const router = express.Router();
const workshopController = require("../controllers/workshopController");
const { verifyToken, verifyRoles } = require("../middleware/authMiddleware");

// ==========================================
// 🌟 กลุ่มที่ 1: เส้นทางแบบ Static (คำเฉพาะ) ต้องอยู่ด้านบน!
// ==========================================

// ดู Workshop ทั้งหมด (ใครก็ดูได้)
router.get("/", workshopController.getAllWorkshops);

// ดู Workshop ที่รออนุมัติ (เฉพาะ admin, approver)
router.get(
  "/pending",
  verifyToken,
  verifyRoles("admin", "approver"),
  workshopController.getPendingWorkshops,
);

// ดู Workshop ของตัวเอง (เฉพาะ admin, organizer)
router.get(
  "/my-workshops",
  verifyToken,
  verifyRoles("admin", "organizer"),
  workshopController.getMyWorkshops,
);

// สร้าง Workshop ใหม่
router.post(
  "/",
  verifyToken,
  verifyRoles("admin", "organizer"),
  workshopController.createWorkshop,
);

// ==========================================
// 🌟 กลุ่มที่ 2: เส้นทางแบบ Dynamic (มี /:id) ต้องอยู่ด้านล่าง!
// ==========================================

// ดูรายละเอียด Workshop รายตัว
router.get("/:id", workshopController.getWorkshopById);

router.get(
  "/:id/attendees",
  verifyToken,
  verifyRoles("admin", "organizer"), 
  workshopController.getWorkshopAttendees,
);

// อัปเดตสถานะ (Approve/Reject)
router.patch(
  "/:id/status",
  verifyToken,
  verifyRoles("admin", "approver"),
  workshopController.updateWorkshopStatus,
);

// แก้ไขข้อมูล Workshop
router.put(
  "/:id",
  verifyToken,
  verifyRoles("admin", "organizer"),
  workshopController.updateWorkshop,
);

module.exports = router;
