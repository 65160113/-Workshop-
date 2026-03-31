// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require('./src/routes/authRoutes'); 
const workshopRoutes = require("./src/routes/workshopRoutes");
const enrollmentRoutes = require("./src/routes/enrollmentRoutes");
const masterRoutes = require("./src/routes/masterRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// 🌟 แก้ไข CORS: ใส่ Array เพื่ออนุญาตหลายเว็บไซต์พร้อมกัน
const allowedOrigins = [
  "http://localhost:5173",                   // ให้หน้าบ้านในเครื่องเราต่อได้
  "https://workshop-alpha-brown.vercel.app", // ให้เว็บจริงบน Vercel ต่อได้
  process.env.CLIENT_URL                     // เผื่อใช้ตัวแปร .env ในอนาคต
].filter(Boolean); // กรองค่าที่อาจจะเป็น undefined ทิ้ง

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json()); // ให้ API รับข้อมูลเป็น JSON ได้

// Health Check API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running normally.",
  });
});

// เพิ่มเส้นทาง (Routes) ของระบบ
app.use('/api/auth', authRoutes);
app.use("/api/workshops", workshopRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api", masterRoutes);
app.use("/api/admin", adminRoutes);

// เริ่มเปิด Server (ต้องมีแค่อันเดียว และอยู่ล่างสุดเสมอ!)
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});