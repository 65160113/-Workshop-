// backend/src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // ดึง Token จาก Header ที่หน้าบ้านส่งมาให้
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "กรุณาเข้าสู่ระบบก่อนครับ" });

  // ถอดรหัส Token
  jwt.verify(
    token,
    process.env.JWT_SECRET || "super_secret_key",
    (err, decoded) => {
      if (err)
        return res.status(403).json({ message: "Token ไม่ถูกต้องหรือหมดอายุ" });
      req.user = decoded; // เก็บข้อมูล ID ผู้ใช้ที่ถอดรหัสได้ไว้ใช้ต่อ
      next();
    },
  );
};

const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // ถ้าไม่มีข้อมูล user หรือ Role ไม่ตรงกับที่อนุญาต
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "⛔ Access Denied: คุณไม่มีสิทธิ์เข้าถึงในส่วนนี้ครับ",
      });
    }
    next(); // ถ้าเป็น admin หรือ organizer ก็ผ่านได้!
  };
};

module.exports = { verifyToken , verifyRoles };
