// backend/tests/integration/workshop.integration.test.js
const request = require("supertest");
const express = require("express");

// 1. จำลอง (Mock) Database เพื่อไม่ให้กระทบข้อมูลจริง
jest.mock("../../src/config/db.config", () => ({
  pool: {
    query: jest.fn(),
    execute: jest.fn(),
  },
}));

// 2. จำลอง (Mock) ระบบ Auth เพื่อผ่านด่าน Token และ Role ไปเลย
jest.mock("../../src/middleware/authMiddleware", () => ({
  verifyToken: (req, res, next) => {
    req.user = { id: 1, role: "admin" }; // สมมติว่าเป็น Admin ล็อคอินเข้ามา
    next();
  },
  verifyRoles:
    (...roles) =>
    (req, res, next) => {
      next(); // ให้ผ่านด่านเช็ค Role ไปเลย
    },
}));

// 3. นำเข้า Routes และตั้งค่า Express App จำลอง
const workshopRoutes = require("../../src/routes/workshopRoutes");
const { pool } = require("../../src/config/db.config");

const app = express();
app.use(express.json());
app.use("/api/workshops", workshopRoutes);

// =======================
// เริ่มต้นการทดสอบ 5 Suites 
// =======================
describe("🔗 Workshop API Integration Tests", () => {
  // ล้างค่า Mock ทุกครั้งก่อนเริ่มเทสใหม่
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Suite 1: ทดสอบการดึง Workshop ทั้งหมด (หน้า Home)
  describe("Suite 1: GET /api/workshops", () => {
    it("ควรคืนค่า 200 และส่งข้อมูล Workshop กลับมาเป็น Array", async () => {
      // สะกดจิต DB ให้คืนค่า Array จำลอง
      pool.query.mockResolvedValue([[{ id: 1, name: "React Basic" }]]);

      const res = await request(app).get("/api/workshops");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].name).toBe("React Basic");
    });
  });

  // Suite 2: ทดสอบการดึงข้อมูล Workshop รายตัว
  describe("Suite 2: GET /api/workshops/:id", () => {
    it("ควรคืนค่า 200 เมื่อส่ง ID ที่มีอยู่จริง", async () => {
      pool.query.mockResolvedValue([
        [{ id: 1, name: "React Basic", speaker: "Shadow" }],
      ]);

      const res = await request(app).get("/api/workshops/1");

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe("React Basic");
    });

    it("ควรคืนค่า 404 เมื่อหา Workshop ไม่เจอ", async () => {
      pool.query.mockResolvedValue([[]]); // DB คืนค่า Array ว่าง

      const res = await request(app).get("/api/workshops/999");

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("ไม่พบ Workshop นี้ครับ");
    });
  });

  // Suite 3: ทดสอบการสร้าง Workshop ใหม่
  describe("Suite 3: POST /api/workshops", () => {
    it("ควรคืนค่า 201 เมื่อส่งข้อมูลครบถ้วน", async () => {
      pool.execute.mockResolvedValue([{ insertId: 10 }]); // จำลองว่า Insert สำเร็จได้ ID 10

      const newWorkshop = {
        name: "New Gen Tech",
        date: "2026-05-01",
        startTime: "10:00",
        location: "Burapha IT",
        seats: 50,
        categoryId: 1,
        platformId: 1,
      };

      const res = await request(app).post("/api/workshops").send(newWorkshop);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toContain("สำเร็จ");
    });

    it("ควรคืนค่า 400 เมื่อส่งข้อมูลไม่ครบ", async () => {
      const res = await request(app)
        .post("/api/workshops")
        .send({ name: "No Date" });

      expect(res.statusCode).toBe(400); // 400 Bad Request
    });
  });

  // Suite 4: ทดสอบการดึง Workshop ของตัวเอง (My Workshops)
  describe("Suite 4: GET /api/workshops/my-workshops", () => {
    it("ควรคืนค่า 200 และดึงข้อมูลงานของผู้สร้างได้", async () => {
      pool.query.mockResolvedValue([[{ id: 1, name: "My Own Work" }]]);

      const res = await request(app).get("/api/workshops/my-workshops");

      expect(res.statusCode).toBe(200);
      expect(res.body[0].name).toBe("My Own Work");
    });
  });

  // Suite 5: ทดสอบการอนุมัติ/ไม่อนุมัติ (Approve/Reject)
  describe("Suite 5: PATCH /api/workshops/:id/status", () => {
    it("ควรคืนค่า 200 เมื่อเปลี่ยนสถานะสำเร็จ", async () => {
      pool.query.mockResolvedValue([{ affectedRows: 1 }]); // จำลองว่า Update สำเร็จ 1 แถว

      const res = await request(app)
        .patch("/api/workshops/1/status")
        .send({ status: "approved" });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toContain("เรียบร้อยแล้ว");
    });

    it("ควรคืนค่า 400 เมื่อส่งสถานะแปลกๆ มา", async () => {
      const res = await request(app)
        .patch("/api/workshops/1/status")
        .send({ status: "hacked_status" });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("สถานะไม่ถูกต้องครับ");
    });
  });

  // Suite 6: ทดสอบการแก้ไข Workshop (updateWorkshop)
  describe("Suite 6: PUT /api/workshops/:id", () => {
    it("ควรคืนค่า 200 เมื่อแก้ไขข้อมูลสำเร็จ", async () => {
      pool.execute.mockResolvedValue([{ affectedRows: 1 }]);

      const res = await request(app).put("/api/workshops/1").send({
        name: "Updated Workshop",
        date: "2026-05-01",
        startTime: "10:00",
        location: "Zoom",
        seats: 50,
        categoryId: 1,
        platformId: 1,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toContain("อัปเดตข้อมูล Workshop สำเร็จ");
    });

    it("ควรคืนค่า 403 เมื่อไม่มีสิทธิ์แก้ไข หรือไม่พบงาน", async () => {
      pool.execute.mockResolvedValue([{ affectedRows: 0 }]); // จำลองว่า Update ไม่สำเร็จ

      const res = await request(app).put("/api/workshops/99").send({
        name: "Updated Workshop",
        date: "2026-05-01",
        startTime: "10:00",
        location: "Zoom",
        seats: 50,
        categoryId: 1,
        platformId: 1,
      });

      expect(res.statusCode).toBe(403);
    });
  });

  // Suite 7: ทดสอบดึงรายชื่อคนสมัคร (getWorkshopAttendees)
  describe("Suite 7: GET /api/workshops/:id/attendees", () => {
    it("ควรคืนค่า 200 และได้รายชื่อผู้สมัคร", async () => {
      pool.query.mockResolvedValue([
        [{ first_name: "Shadow", email: "test@test.com" }],
      ]);

      const res = await request(app).get("/api/workshops/1/attendees");

      expect(res.statusCode).toBe(200);
      expect(res.body[0].first_name).toBe("Shadow");
    });
  });

  // Suite 8: ทดสอบดึงงานที่รออนุมัติ (getPendingWorkshops)
  describe("Suite 8: GET /api/workshops/pending", () => {
    it("ควรคืนค่า 200 และได้รายการงาน pending", async () => {
      pool.query.mockResolvedValue([[{ id: 2, status: "pending" }]]);

      const res = await request(app).get("/api/workshops/pending");

      expect(res.statusCode).toBe(200);
    });
  });

  // Suite 9: ทดสอบกรณีระบบมีปัญหา Error 500 (Catch Block)
  describe("Suite 9: Error Handling (500)", () => {
    it("ควรคืนค่า 500 เมื่อ Database มีปัญหาตอนดึงข้อมูล", async () => {
      // จำลองให้ Database พัง (โยน Error ออกมา)
      pool.query.mockRejectedValue(new Error("Database Down!"));

      const res = await request(app).get("/api/workshops");

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("เกิดข้อผิดพลาดในการดึงข้อมูล Workshop");
    });
  });
});
