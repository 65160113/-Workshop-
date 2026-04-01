// backend/src/controllers/enrollmentController.js
const { pool } = require("../config/db.config");

class EnrollmentController {
  // ดึงประวัติการสมัครของตัวเอง (ใช้โชว์หน้า My Account)
  async getMyEnrollments(req, res) {
    try {
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

  // กดปุ่มสมัคร Workshop (เวอร์ชันแก้บั๊กสมัครซ้ำ + เช็คที่นั่ง)
  async enrollWorkshop(req, res) {
    try {
      const userId = req.user.id || req.user.user_id || req.user.userId;
      const { workshopId } = req.body;

      // --- สเต็ป 1: เช็คที่นั่งว่างก่อน (นับเฉพาะคนที่เป็น active) ---
      const [workshop] = await pool.query(
        `SELECT max_seats, 
         (SELECT COUNT(*) FROM enrollments WHERE workshop_id = ? AND status = 'active') as enrolled_count 
         FROM workshops WHERE workshop_id = ?`,
        [workshopId, workshopId],
      );

      if (workshop.length === 0) {
        return res.status(404).json({ message: "ไม่พบ Workshop นี้" });
      }

      const { max_seats, enrolled_count } = workshop[0];
      if (enrolled_count >= max_seats) {
        return res.status(400).json({ message: "ขออภัยครับ ที่นั่งเต็มแล้ว" });
      }

      // --- สเต็ป 2: เช็คประวัติการสมัครเก่า ---
      const [existing] = await pool.query(
        "SELECT * FROM enrollments WHERE user_id = ? AND workshop_id = ?",
        [userId, workshopId],
      );

      if (existing.length > 0) {
        const currentStatus = existing[0].status;

        // ถ้ายังเป็น active อยู่ -> อันนี้คือสมัครซ้ำจริง
        if (currentStatus === "active") {
          return res
            .status(400)
            .json({ message: "คุณได้ลงทะเบียน Workshop นี้ไปแล้วครับ" });
        }

        // ถ้าสถานะเป็น cancelled -> ให้ UPDATE กลับเป็น active (แก้บั๊กสมัครใหม่ไม่ได้)
        await pool.execute(
          "UPDATE enrollments SET status = 'active', registered_at = NOW() WHERE user_id = ? AND workshop_id = ?",
          [userId, workshopId],
        );
        return res
          .status(200)
          .json({ message: "กลับมาลงทะเบียนอีกครั้งสำเร็จ!" });
      }

      // --- สเต็ป 3: ถ้าไม่เคยมีประวัติเลย -> INSERT ใหม่ ---
      await pool.execute(
        `INSERT INTO enrollments (user_id, workshop_id, status) VALUES (?, ?, 'active')`,
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
