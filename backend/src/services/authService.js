// backend/src/services/authService.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

class AuthService {
  async register(userData) {
    const { username, password, email, firstName, lastName } = userData;

    // 1. เช็คว่ามี Username หรือ Email นี้ในระบบหรือยัง
    const existingUser = await userRepository.findByEmailOrUsername(
      email,
      username,
    );
    if (existingUser) {
      throw new Error("Username or Email already exists");
    }

    // 2. เข้ารหัสผ่าน (Hash Password) ด้วยความปลอดภัยระดับ 10
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. ส่งข้อมูลไปบันทึกลง Database ผ่าน Repository
    const newUserId = await userRepository.createUser({
      username,
      passwordHash,
      email,
      firstName,
      lastName,
    });

    return { id: newUserId, username, email };
  }
  async login(username, password) {
    // 1. หา User ในระบบ (แอบส่ง username ไปเช็คทั้งช่องอีเมลและชื่อผู้ใช้)
    const user = await userRepository.findByEmailOrUsername(username, username);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // 2. เช็คว่ารหัสผ่านที่ส่งมา ตรงกับที่ Hash เก็บไว้ไหม
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatch) {
      throw new Error("Invalid credentials");
    }

    // 3. สร้าง JWT Token
    const payload = {
      id: user.user_id,
      username: user.username,
      role: user.role,
    };

    // ดึงรหัสลับจาก .env มาเข้ารหัส Token (ถ้าไม่มีจะใช้ค่า Default)
    const secretKey = process.env.JWT_SECRET || "super_secret_key";
    const token = jwt.sign(payload, secretKey, { expiresIn: "1d" });

    return { user: payload, token };
  }
}

module.exports = new AuthService();
