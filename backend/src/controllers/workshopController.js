// backend/src/controllers/workshopController.js

// 1. เปลี่ยนวิธี Import โดยใส่ปีกกา {} เพื่อดึงเอาเฉพาะ pool ออกมา
const { pool } = require("../config/db.config");

class WorkshopController {
  async getAllWorkshops(req, res) {
    try {
      // 2. เปลี่ยนจาก db.query เป็น pool.query
      const [workshops] = await pool.query(`
        SELECT workshop_id as id, 
               title as name, 
               COALESCE(location_detail, meeting_url, 'รอประกาศสถานที่') as location, 
               DATE_FORMAT(start_time, '%d %M %Y') as date, 
               max_seats as seats 
        FROM workshops 
        ORDER BY start_time ASC
      `);

      res.status(200).json(workshops);
    } catch (error) {
      console.error("Fetch Workshops Error:", error.message);
      res
        .status(500)
        .json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล Workshop" });
    }
  }
  async getWorkshopById(req, res) {
    try {
      const { id } = req.params; // รับ ID มาจาก URL
      
      const [workshops] = await pool.query(`
        SELECT workshop_id as id, 
               title as name, 
               description,
               speaker_name as speaker,
               COALESCE(location_detail, meeting_url, 'รอประกาศสถานที่') as location, 
               DATE_FORMAT(start_time, '%d %M %Y') as date, 
               CONCAT(DATE_FORMAT(start_time, '%H:%i'), ' - ', DATE_FORMAT(end_time, '%H:%i')) as time,
               max_seats as seats 
        FROM workshops 
        WHERE workshop_id = ?
      `, [id]);

      // ถ้าไม่เจอ Workshop
      if (workshops.length === 0) {
        return res.status(404).json({ message: 'ไม่พบ Workshop นี้ครับ' });
      }

      res.status(200).json(workshops[0]);
    } catch (error) {
      console.error('Fetch Workshop Detail Error:', error.message);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
    }
  }
}

module.exports = new WorkshopController();
