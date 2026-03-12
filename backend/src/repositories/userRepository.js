// backend/src/repositories/userRepository.js
const { pool } = require("../config/db.config");

class UserRepository {
  // 🌟 คืนชีพการหาด้วย Email หรือ Username
  async findByEmailOrUsername(email, username) {
    const query = "SELECT * FROM users WHERE email = ? OR username = ?";
    const [rows] = await pool.query(query, [email, username]);
    return rows[0];
  }

  // 🌟 ใส่คอลัมน์ให้ครบ
  async createUser(userData) {
    const {
      username,
      passwordHash,
      email,
      firstName,
      lastName,
      faculty_id,
      role,
    } = userData;

    const query = `
      INSERT INTO users (username, password_hash, email, first_name, last_name, role, faculty_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(query, [
      username,
      passwordHash,
      email,
      firstName,
      lastName,
      role,
      faculty_id,
    ]);

    return result.insertId;
  }
}

module.exports = new UserRepository();
