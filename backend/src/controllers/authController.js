// backend/src/controllers/authController.js
const authService = require("../services/authService");

class AuthController {
  async register(req, res) {
    try {
      // 1. รับข้อมูลจากหน้าบ้าน
      const { username, password, email, firstName, lastName } = req.body;

      // 2. Validate พื้นฐาน (เช็คว่าส่งข้อมูลมาครบไหม)
      if (!username || !password || !email || !firstName || !lastName) {
        return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
      }

      // 3. เรียกใช้งาน Service ให้ทำการสมัครสมาชิก
      const newUser = await authService.register(req.body);

      // 4. ตอบกลับหน้าบ้านว่าสมัครสำเร็จ (HTTP 201 Created)
      res.status(201).json({
        message: "สมัครสมาชิกสำเร็จ!",
        user: newUser,
      });
    } catch (error) {
      console.error("Register Error:", error.message);

      // ถ้า Error มาจากอีเมล/ชื่อผู้ใช้ซ้ำ (HTTP 409 Conflict)
      if (error.message === "Username or Email already exists") {
        return res
          .status(409)
          .json({ message: "Username หรือ Email นี้มีผู้ใช้งานแล้ว" });
      }

      // Error อื่นๆ จากเซิร์ฟเวอร์ (HTTP 500)
      res.status(500).json({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
    }
  }
  async login(req, res) {
    try {
      const { username, password } = req.body;

      // 1. ตรวจสอบว่าส่งข้อมูลมาครบไหม
      if (!username || !password) {
        return res.status(400).json({ message: 'กรุณากรอก Username และ Password ให้ครบถ้วน' });
      }

      // 2. เรียกใช้งาน Service
      const result = await authService.login(username, password);

      // 3. ตอบกลับหน้าบ้านพร้อม Token (HTTP 200 OK)
      res.status(200).json({
        message: 'เข้าสู่ระบบสำเร็จ!',
        user: result.user,
        token: result.token
      });

    } catch (error) {
      console.error('Login Error:', error.message);
      
      // ถ้า Error มาจากรหัสผิด หรือไม่มี User (HTTP 401 Unauthorized)
      if (error.message === 'Invalid credentials') {
         return res.status(401).json({ message: 'Username หรือ Password ไม่ถูกต้อง' });
      }
      
      // Error อื่นๆ (HTTP 500)
      res.status(500).json({ message: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
    }
  }
}

module.exports = new AuthController();
