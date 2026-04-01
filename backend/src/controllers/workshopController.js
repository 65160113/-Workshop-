// backend/src/controllers/workshopController.js

// 1. เปลี่ยนวิธี Import โดยใส่ปีกกา {} เพื่อดึงเอาเฉพาะ pool ออกมา
const { pool } = require("../config/db.config");

class WorkshopController {
  async getAllWorkshops(req, res) {
    try {
      // 🌟 อัปเกรด SQL: เพิ่ม enrolled_count สำหรับหน้า Home ด้วย!
      const [workshops] = await pool.query(`
        SELECT w.workshop_id as id, 
               w.title as name, 
               COALESCE(w.location_detail, w.meeting_url, 'รอประกาศสถานที่') as location, 
               DATE_FORMAT(w.start_time, '%d %M %Y') as date, 
               w.max_seats as seats,
               w.category_id,
               (SELECT COUNT(*) FROM enrollments e WHERE e.workshop_id = w.workshop_id) as enrolled_count
        FROM workshops w 
        WHERE w.status = 'approved'
        ORDER BY w.start_time ASC
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

      // 🌟 อัปเกรดคำสั่ง SQL: ดึงครบทั้ง หมวดหมู่, แพลตฟอร์ม, และยอดคนจอง
      const [workshops] = await pool.query(
        `
        SELECT w.workshop_id as id, 
               w.organizer_id,
               w.title as name, 
               w.description,
               w.speaker_name as speaker,
               COALESCE(w.location_detail, w.meeting_url, 'รอประกาศสถานที่') as location, 
               DATE_FORMAT(w.start_time, '%d %M %Y') as date, 
               CONCAT(DATE_FORMAT(w.start_time, '%H:%i'), ' - ', DATE_FORMAT(w.end_time, '%H:%i')) as time,
               w.max_seats as seats,
               c.name as category_name, 
               p.name as platform_name, 

               /* เพิ่ม 5 บรรทัดนี้ เพื่อให้ฟอร์มแก้ไขดึงไปใช้ได้ง่ายๆ */
               w.category_id,
               w.platform_id,
               DATE_FORMAT(w.start_time, '%Y-%m-%d') as raw_date,
               DATE_FORMAT(w.start_time, '%H:%i') as raw_start_time,
               DATE_FORMAT(w.end_time, '%H:%i') as raw_end_time,
               
               (SELECT COUNT(*) FROM enrollments e WHERE e.workshop_id = w.workshop_id) as enrolled_count
        FROM workshops w
        LEFT JOIN categories c ON w.category_id = c.category_id
        LEFT JOIN platforms p ON w.platform_id = p.platform_id
        WHERE w.workshop_id = ?
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
        categoryId,
        platformId,
      } = req.body;

      if (
        !name ||
        !date ||
        !startTime ||
        !location ||
        !seats ||
        !categoryId ||
        !platformId
      ) {
        return res
          .status(400)
          .json({ message: "กรุณากรอกข้อมูลสำคัญและเลือกตัวเลือกให้ครบถ้วน" });
      }

      // 2. แปลงวันที่และเวลาให้เป็น DATETIME ของ MySQL (YYYY-MM-DD HH:MM:SS)
      const start_time_db = `${date} ${startTime}:00`;
      const end_time_db = endTime ? `${date} ${endTime}:00` : start_time_db;

      // 3. กำหนดค่าเริ่มต้นสำหรับช่องที่จำเป็น
      const status = "pending"; // หรือ 'approved'
      const organizer_id = req.user.id;

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
          categoryId,
          platformId,
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
  //ฟังก์ชันสำหรับแก้ไขข้อมูล Workshop
  async updateWorkshop(req, res) {
    try {
      const { id } = req.params; // รับ ID ของงานจาก URL
      const organizerId = req.user.id; // ดึง ID ของคนที่ล็อคอินอยู่มาเช็คสิทธิ์

      const {
        name,
        date,
        startTime,
        endTime,
        location,
        speaker,
        seats,
        description,
        categoryId,
        platformId,
      } = req.body;

      // ตรวจสอบข้อมูลเบื้องต้น
      if (
        !name ||
        !date ||
        !startTime ||
        !location ||
        !seats ||
        !categoryId ||
        !platformId
      ) {
        return res
          .status(400)
          .json({ message: "กรุณากรอกข้อมูลสำคัญให้ครบถ้วน" });
      }

      // แปลงวันที่และเวลาให้เป็น DATETIME ของ MySQL (YYYY-MM-DD HH:MM:SS)
      const start_time_db = `${date} ${startTime}:00`;
      const end_time_db = endTime ? `${date} ${endTime}:00` : start_time_db;

      // สั่ง SQL เพื่ออัปเดตข้อมูล
      // (สำคัญ: เช็ค WHERE organizer_id = ? ด้วย ป้องกันคนอื่นมาแอบแก้ข้ามงาน)
      const [result] = await pool.execute(
        `UPDATE workshops 
         SET title = ?, description = ?, speaker_name = ?, start_time = ?, end_time = ?, 
             max_seats = ?, location_detail = ?, category_id = ?, platform_id = ?
         WHERE workshop_id = ? AND organizer_id = ?`,
        [
          name,
          description || null,
          speaker || null,
          start_time_db,
          end_time_db,
          seats,
          location,
          categoryId,
          platformId,
          id,
          organizerId,
        ],
      );

      if (result.affectedRows === 0) {
        return res
          .status(403)
          .json({ message: "คุณไม่มีสิทธิ์แก้ไขงานนี้ หรือไม่พบข้อมูลครับ" });
      }

      res.status(200).json({ message: "📝 อัปเดตข้อมูล Workshop สำเร็จ!" });
    } catch (error) {
      console.error("Update Workshop Error:", error.message);
      res
        .status(500)
        .json({ message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูลลง Database" });
    }
  }
  // ดึงรายการ Workshop ที่รออนุมัติ (status = 'pending')
  async getPendingWorkshops(req, res) {
    try {
      // ดึงเฉพาะงานที่ status เป็น pending
      const [workshops] = await pool.query(`
        SELECT w.workshop_id as id, 
               w.title as name, 
               w.speaker_name as speaker,
               DATE_FORMAT(w.start_time, '%d %M %Y') as date,
               u.first_name as organizer_name
        FROM workshops w
        JOIN users u ON w.organizer_id = u.user_id
        WHERE w.status = 'pending'
        ORDER BY w.start_time ASC
      `);

      res.status(200).json(workshops);
    } catch (error) {
      console.error("Fetch Pending Error:", error.message);
      res
        .status(500)
        .json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลงานที่รออนุมัติ" });
    }
  }

  // 🌟 2. อัปเดตสถานะ (Approve / Reject)
  async updateWorkshopStatus(req, res) {
    try {
      const { id } = req.params; // รับ ID ของงานจาก URL
      const { status } = req.body; // รับสถานะที่จะเปลี่ยน ('approved' หรือ 'rejected')

      // เช็คว่าส่งสถานะมาถูกต้องไหม
      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "สถานะไม่ถูกต้องครับ" });
      }

      // สั่งอัปเดตลง Database
      const [result] = await pool.query(
        "UPDATE workshops SET status = ? WHERE workshop_id = ?",
        [status, id],
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "ไม่พบ Workshop นี้ในระบบ" });
      }

      res
        .status(200)
        .json({ message: `อัปเดตสถานะเป็น ${status} เรียบร้อยแล้ว!` });
    } catch (error) {
      console.error("Update Status Error:", error.message);
      res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตสถานะ" });
    }
  }
  // 🌟 ฟังก์ชันดึงเฉพาะงานที่ "ฉัน" (Organizer) เป็นคนสร้าง
  async getMyWorkshops(req, res) {
    try {
      // req.user.id ได้มาจาก verifyToken ตอนล็อคอิน
      const organizerId = req.user.id;

      const [workshops] = await pool.query(
        `
        SELECT w.workshop_id as id, 
               w.title as name, 
               COALESCE(w.location_detail, w.meeting_url, 'รอประกาศสถานที่') as location, 
               DATE_FORMAT(w.start_time, '%d %M %Y') as date, 
               w.status
        FROM workshops w
        WHERE w.organizer_id = ?
        ORDER BY w.start_time DESC
      `,
        [organizerId],
      ); // ดึงงานใหม่สุดขึ้นก่อน (DESC)

      res.status(200).json(workshops);
    } catch (error) {
      console.error("Fetch My Workshops Error:", error.message);
      res
        .status(500)
        .json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลงานของคุณ" });
    }
  }
  async getWorkshopAttendees(req, res) {
    try {
      const { id } = req.params;

      const query = `
        SELECT u.first_name, u.last_name, u.email, e.registered_at 
        FROM enrollments e
        JOIN users u ON e.user_id = u.user_id
        WHERE e.workshop_id = ? AND e.status = 'active'
        ORDER BY e.registered_at ASC
      `;

      const [attendees] = await pool.query(query, [id]);

      res.status(200).json(attendees);
    } catch (error) {
      console.error("Error fetching attendees:", error);
      res
        .status(500)
        .json({ message: "เกิดข้อผิดพลาดในการดึงรายชื่อผู้สมัคร" });
    }
  }
}

module.exports = new WorkshopController();
