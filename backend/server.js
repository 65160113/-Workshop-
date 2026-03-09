// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require('./src/routes/authRoutes'); 
const { testConnection } = require("./src/config/db.config.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares พื้นฐาน
app.use(cors());
app.use(express.json()); // ให้ API รับข้อมูลเป็น JSON ได้

// ทดสอบเชื่อมต่อ Database ตอนเปิด Server
testConnection();

// Health Check API (เอาไว้เทสว่า Server รันติดไหม)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running normally.",
  });
});

// เพิ่มเส้นทาง (Routes) ของระบบ
app.use('/api/auth', authRoutes);

// TODO: เดี๋ยวเราจะเอา Route ของ Auth มาใส่ตรงนี้

// เริ่มเปิด Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
