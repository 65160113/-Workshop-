module.exports = {
  testEnvironment: "node", // บอก Jest ว่าเราเทสฝั่ง Backend (Node.js)
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/config/", // ละเว้นการตรวจ coverage ในโฟลเดอร์ config (เช่น ไฟล์ต่อ DB)
  ],
  testMatch: [
    "**/tests/**/*.test.js", // ให้ Jest วิ่งหาไฟล์ที่ลงท้ายด้วย .test.js ในโฟลเดอร์ tests
  ],
};
