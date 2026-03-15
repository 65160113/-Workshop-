// backend/src/controllers/authController.js
const authService = require("../services/authService");
const { pool } = require("../config/db.config");

class AuthController {
  async register(req, res) {
    try {
      // 🌟 รับค่ามาให้ครบ
      const {
        username,
        password,
        email,
        firstName,
        lastName,
        facultyId,
        role,
      } = req.body;

      if (
        !username ||
        !password ||
        !email ||
        !firstName ||
        !lastName ||
        !facultyId
      ) {
        return res
          .status(400)
          .json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน และเลือกคณะด้วยครับ" });
      }

      const newUser = await authService.register({
        username,
        password,
        email,
        firstName,
        lastName,
        faculty_id: facultyId,
        role: role || "student",
      });

      // 4. ตอบกลับหน้าบ้านว่าสมัครสำเร็จ
      res.status(201).json({
        message: "สมัครสมาชิกสำเร็จ!",
        user: newUser,
      });
    } catch (error) {
      console.error("Register Error:", error.message);

      if (
        error.message === "Username or Email already exists" ||
        error.message === "Username already exists"
      ) {
        return res
          .status(409)
          .json({ message: "Username นี้มีผู้ใช้งานแล้วครับ" });
      }

      res.status(500).json({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
    }
  }

  // 🌟 คืนชีพฟังก์ชัน login ตัวเต็มตรงนี้ครับ!
  async login(req, res) {
    try {
      const { username, password } = req.body;

      // 1. ตรวจสอบว่าส่งข้อมูลมาครบไหม
      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "กรุณากรอก Username และ Password ให้ครบถ้วน" });
      }

      // 2. เรียกใช้งาน Service
      const result = await authService.login(username, password);

      // 3. ตอบกลับหน้าบ้านพร้อม Token (HTTP 200 OK)
      res.status(200).json({
        message: "เข้าสู่ระบบสำเร็จ!",
        user: result.user,
        token: result.token,
      });
    } catch (error) {
      console.error("Login Error:", error.message);

      // ถ้า Error มาจากรหัสผิด หรือไม่มี User (HTTP 401 Unauthorized)
      if (error.message === "Invalid credentials") {
        return res
          .status(401)
          .json({ message: "Username หรือ Password ไม่ถูกต้อง" });
      }

      // Error อื่นๆ (HTTP 500)
      res.status(500).json({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
    }
  }
  // 🌟 2. เพิ่มฟังก์ชันดึงข้อมูลโปรไฟล์ของตัวเอง
  async getMyProfile(req, res) {
    try {
      // req.user.id ถูกแกะมาจาก Token โดย Middleware
      const userId = req.user.id; 

      const [users] = await pool.query(
        `SELECT user_id, first_name, last_name, email, role 
         FROM users 
         WHERE user_id = ?`,
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({ message: "ไม่พบข้อมูลผู้ใช้งานครับ" });
      }

      res.status(200).json(users[0]);
    } catch (error) {
      console.error("Get Profile Error:", error.message);
      res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์" });
    }
  }
}

module.exports = new AuthController();
