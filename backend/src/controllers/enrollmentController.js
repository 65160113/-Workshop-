// backend/src/controllers/enrollmentController.js
const { pool } = require("../config/db.config");

class EnrollmentController {
  // 1. ดึงประวัติการสมัครของตัวเอง (ใช้โชว์หน้า My Account)
  async getMyEnrollments(req, res) {
    try {
      // ดึง ID ผู้ใช้จาก Token (รองรับการตั้งชื่อตัวแปรที่หลากหลายเผื่อไว้ครับ)
      const userId = req.user.id || req.user.user_id || req.user.userId;

      const [enrollments] = await pool.query(
        `
        SELECT w.workshop_id as id, 
               w.title as name, 
               DATE_FORMAT(w.start_time, '%d %M %Y') as date, 
               e.status 
        FROM enrollments e
        JOIN workshops w ON e.workshop_id = w.workshop_id
        WHERE e.user_id = ?
        ORDER BY w.start_time DESC
      `,
        [userId],
      );

      res.status(200).json(enrollments);
    } catch (error) {
      console.error("Fetch Enrollments Error:", error.message);
      res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลประวัติ" });
    }
  }

  // 2. กดปุ่มสมัคร Workshop
  async enrollWorkshop(req, res) {
    try {
      const userId = req.user.id || req.user.user_id || req.user.userId;
      const { workshopId } = req.body;

      // เช็คก่อนว่าเคยสมัครไปหรือยัง
      const [existing] = await pool.query(
        "SELECT * FROM enrollments WHERE user_id = ? AND workshop_id = ?",
        [userId, workshopId],
      );
      if (existing.length > 0) {
        return res
          .status(400)
          .json({ message: "คุณได้ลงทะเบียน Workshop นี้ไปแล้วครับ" });
      }

      // บันทึกลงฐานข้อมูล
      await pool.query(
        'INSERT INTO enrollments (user_id, workshop_id, status) VALUES (?, ?, "active")',
        [userId, workshopId],
      );

      res.status(201).json({ message: "ลงทะเบียนสำเร็จ!" });
    } catch (error) {
      console.error("Enroll Error:", error.message);
      res.status(500).json({ message: "เกิดข้อผิดพลาดในการลงทะเบียน" });
    }
  }
}

module.exports = new EnrollmentController();
