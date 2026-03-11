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

      const [workshops] = await pool.query(
        `
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
      `,
        [id],
      );

      // ถ้าไม่เจอ Workshop
      if (workshops.length === 0) {
        return res.status(404).json({ message: "ไม่พบ Workshop นี้ครับ" });
      }

      res.status(200).json(workshops[0]);
    } catch (error) {
      console.error("Fetch Workshop Detail Error:", error.message);
      res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }
  }
  async createWorkshop(req, res) {
    try {
      // 1. รับข้อมูลจากหน้าบ้าน
      const {
        name,
        date,
        startTime,
        endTime,
        location,
        speaker,
        seats,
        description,
      } = req.body;

      if (!name || !date || !startTime || !location || !seats) {
        return res
          .status(400)
          .json({ message: "กรุณากรอกข้อมูลสำคัญให้ครบถ้วน" });
      }

      // 2. แปลงวันที่และเวลาให้เป็น DATETIME ของ MySQL (YYYY-MM-DD HH:MM:SS)
      // เอาวันที่มาต่อกับเวลา แล้วเติมวินาที :00 เข้าไป
      const start_time_db = `${date} ${startTime}:00`;

      // ถ้าไม่มีเวลาจบ ให้ตีเนียนใช้เวลาเดียวกับตอนเริ่มไปก่อน
      const end_time_db = endTime ? `${date} ${endTime}:00` : start_time_db;

      // 3. กำหนดค่าเริ่มต้นสำหรับช่องที่จำเป็น (เดี๋ยวเราค่อยมาเชื่อมกับระบบ Login ทีหลัง)
      const status = "pending"; // หรือ 'approved'
      const organizer_id = 2; // ยืม ID เลข 2 ตามในรูปไปก่อน
      const category_id = 1;
      const platform_id = 1;

      // 4. สั่งร่ายเวทย์ SQL ให้ตรงกับชื่อคอลัมน์ในรูปเป๊ะๆ!
      const [result] = await pool.execute(
        `INSERT INTO workshops 
         (title, description, speaker_name, start_time, end_time, max_seats, location_detail, status, organizer_id, category_id, platform_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          description || null,
          speaker || null,
          start_time_db,
          end_time_db,
          seats,
          location,
          status,
          organizer_id,
          category_id,
          platform_id,
        ],
      );

      res.status(201).json({
        message: "🎉 สร้าง Workshop สำเร็จแล้วครับลูกพี่!",
        insertId: result.insertId,
      });
    } catch (error) {
      console.error("Create Workshop Error:", error.message);
      res
        .status(500)
        .json({ message: "เกิดข้อผิดพลาดในการบันทึกข้อมูลลง Database" });
    }
  }
}

module.exports = new WorkshopController();
