// backend/src/controllers/masterController.js
// 🌟 นำเข้า pool ตัวเชื่อมต่อ Database 
const { pool } = require("../config/db.config");

class MasterController {
  async getCategories(req, res) {
    try {
      const [rows] = await pool.execute("SELECT * FROM categories");
      res.status(200).json(rows);
    } catch (error) {
      console.error("Categories Error:", error);
      res.status(500).json({ message: "ไม่สามารถดึงข้อมูลหมวดหมู่ได้" });
    }
  }

  async getPlatforms(req, res) {
    try {
      const [rows] = await pool.execute("SELECT * FROM platforms");
      res.status(200).json(rows);
    } catch (error) {
      console.error("Platforms Error:", error);
      res.status(500).json({ message: "ไม่สามารถดึงข้อมูลช่องทางอบรมได้" });
    }
  }

  async getFaculties(req, res) {
    try {
      const [rows] = await pool.execute("SELECT * FROM faculties");
      res.status(200).json(rows);
    } catch (error) {
      console.error("Faculties Error:", error);
      res.status(500).json({ message: "ไม่สามารถดึงข้อมูลคณะได้" });
    }
  }
}

module.exports = new MasterController();
