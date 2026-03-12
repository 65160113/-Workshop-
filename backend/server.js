// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require('./src/routes/authRoutes'); 
const workshopRoutes = require("./src/routes/workshopRoutes");
const enrollmentRoutes = require("./src/routes/enrollmentRoutes");
const masterRoutes = require("./src/routes/masterRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// Middlewares พื้นฐาน
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json()); // ให้ API รับข้อมูลเป็น JSON ได้

// Health Check API (เอาไว้เทสว่า Server รันติดไหม)
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
// TODO: เดี๋ยวเราจะเอา Route ของ Auth มาใส่ตรงนี้

// เริ่มเปิด Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
