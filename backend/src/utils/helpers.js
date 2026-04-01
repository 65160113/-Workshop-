// backend/src/utils/helpers.js

// 1. ฟังก์ชันเช็คว่าอีเมลถูกต้องไหม (มี @ มี . ไหม)
const isValidEmail = (email) => {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// 2. ฟังก์ชันคำนวณที่นั่งว่าง
const calculateAvailableSeats = (maxSeats, enrolled) => {
  if (maxSeats < 0 || enrolled < 0) return 0; // ห้ามติดลบ
  const available = maxSeats - enrolled;
  return available > 0 ? available : 0; // ห้ามที่นั่งเหลือติดลบ
};

// 3. ฟังก์ชันเช็คสถานะ Workshop ว่าเต็มหรือยัง
const isWorkshopFull = (maxSeats, enrolled) => {
  return enrolled >= maxSeats;
};

module.exports = {
  isValidEmail,
  calculateAvailableSeats,
  isWorkshopFull,
};
