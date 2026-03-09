// backend/src/config/db.config.js
require("dotenv").config();
const mysql = require("mysql2/promise");

// สร้าง Connection Pool (Singleton Pattern ตามมาตรฐานที่เราเขียนไว้)
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "workshop_db",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ฟังก์ชันสำหรับทดสอบการเชื่อมต่อ
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully!");
    connection.release();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
};

module.exports = { pool, testConnection };
