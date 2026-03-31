// backend/src/controllers/adminController.js
const { pool } = require("../config/db.config");

class AdminController {
  async getDashboardStats(req, res) {
    try {
      // ใช้ Promise.all รัน SQL 4 คำสั่งพร้อมกันเพื่อความไว!
      const [
        [totalWorkshops],
        [totalUsers],
        [totalEnrollments],
        [pendingWorkshops],
      ] = await Promise.all([
        pool.query("SELECT COUNT(*) as count FROM workshops"),
        pool.query("SELECT COUNT(*) as count FROM users"),
        pool.query("SELECT COUNT(*) as count FROM enrollments"),
        pool.query(
          "SELECT COUNT(*) as count FROM workshops WHERE status = 'pending'",
        ),
      ]);

      // ส่งตัวเลขกลับไปให้หน้าบ้าน
      res.status(200).json({
        totalWorkshops: totalWorkshops[0].count,
        totalUsers: totalUsers[0].count,
        totalEnrollments: totalEnrollments[0].count,
        pendingWorkshops: pendingWorkshops[0].count,
      });
    } catch (error) {
      console.error("Dashboard Stats Error:", error.message);
      res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงสถิติของระบบ" });
    }
  }
  // ฟังก์ชันดึงรายชื่อผู้ใช้งานทั้งหมด
  async getAllUsers(req, res) {
    try {
      const [users] = await pool.query(`
        SELECT user_id as id, 
               first_name, 
               last_name, 
               email, 
               role, 
               DATE_FORMAT(created_at, '%d %b %Y') as joined_date 
        FROM users 
        ORDER BY created_at DESC
      `);
      res.status(200).json(users);
    } catch (error) {
      console.error("Get Users Error:", error.message);
      res
        .status(500)
        .json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้งาน" });
    }
  }

  // ฟังก์ชันอัปเดตสิทธิ์ (Role) ของผู้ใช้งาน
  async updateUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body; // รับค่า role ใหม่ ('user', 'organizer', 'admin')

      // ดักไว้ก่อน เผื่อมีคนส่ง role มั่วๆ มา
      if (!["user", "organizer", "approver", "admin"].includes(role)) {
        return res
          .status(400)
          .json({ message: "สิทธิ์การใช้งานไม่ถูกต้องครับ" });
      }

      // ห้ามแอดมินเปลี่ยนสิทธิ์ตัวเอง 
      if (req.user.id.toString() === id.toString()) {
        return res
          .status(403)
          .json({ message: "ไม่สามารถเปลี่ยนสิทธิ์ของตัวเองได้ครับ" });
      }

      const [result] = await pool.query(
        "UPDATE users SET role = ? WHERE user_id = ?",
        [role, id],
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "ไม่พบผู้ใช้งานนี้ในระบบ" });
      }

      res
        .status(200)
        .json({ message: `เลื่อนขั้นเป็น ${role} เรียบร้อยแล้ว!` });
    } catch (error) {
      console.error("Update Role Error:", error.message);
      res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตสิทธิ์" });
    }
  }
}

module.exports = new AdminController();
