// backend/src/repositories/userRepository.js
const { pool } = require("../config/db.config");

class UserRepository {
  // หา User จาก Email หรือ Username
  async findByEmailOrUsername(email, username) {
    const query = "SELECT * FROM users WHERE email = ? OR username = ?";
    const [rows] = await pool.query(query, [email, username]);
    return rows[0]; // คืนค่าตัวแรกที่เจอ (ถ้าไม่มีจะตอบกลับเป็น undefined)
  }

  // สร้าง User ใหม่
  async createUser(userData) {
    const { username, passwordHash, email, firstName, lastName } = userData;
    const query = `
      INSERT INTO users (username, password_hash, email, first_name, last_name, role)
      VALUES (?, ?, ?, ?, ?, 'student')
    `;
    const [result] = await pool.query(query, [
      username,
      passwordHash,
      email,
      firstName,
      lastName,
    ]);
    return result.insertId; // คืนค่า ID ของคนที่เพิ่งสมัคร
  }
}

module.exports = new UserRepository();
