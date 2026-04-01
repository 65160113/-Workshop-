// backend/tests/unit/helpers.test.js
const {
  isValidEmail,
  calculateAvailableSeats,
  isWorkshopFull,
} = require("../../src/utils/helpers");

describe("🛠️ Helpers Utility Unit Tests", () => {
  // ==========================================
  // ชุดที่ 1: เทสฟังก์ชันตรวจสอบอีเมล (isValidEmail)
  // ==========================================
  describe("isValidEmail()", () => {
    test("1. อีเมลรูปแบบถูกต้อง ต้องคืนค่า true", () => {
      expect(isValidEmail("shadow@burapha.ac.th")).toBe(true);
    });

    test("2. อีเมลไม่มี @ ต้องคืนค่า false", () => {
      expect(isValidEmail("shadowburapha.ac.th")).toBe(false);
    });

    test("3. อีเมลไม่มี . (dot) ต้องคืนค่า false", () => {
      expect(isValidEmail("shadow@burapha")).toBe(false);
    });

    test("4. ส่งค่าว่าง (Empty String) ต้องคืนค่า false", () => {
      expect(isValidEmail("")).toBe(false);
    });

    test("5. ไม่ส่งค่าอะไรเลย (Undefined) ต้องคืนค่า false", () => {
      expect(isValidEmail()).toBe(false);
    });
  });

  // ==========================================
  // ชุดที่ 2: เทสฟังก์ชันคำนวณที่นั่ง (calculateAvailableSeats)
  // ==========================================
  describe("calculateAvailableSeats()", () => {
    test("6. รับคนได้ 100 สมัครแล้ว 20 ต้องเหลือที่นั่ง 80", () => {
      expect(calculateAvailableSeats(100, 20)).toBe(80);
    });

    test("7. ถ้าคนสมัครเกินจำนวนรับ ต้องคืนค่าที่นั่งเหลือเป็น 0 (ไม่ติดลบ)", () => {
      expect(calculateAvailableSeats(50, 60)).toBe(0);
    });

    test("8. ถ้าไม่มีคนสมัครเลย (enrolled = 0) ต้องเหลือที่นั่งเต็ม", () => {
      expect(calculateAvailableSeats(30, 0)).toBe(30);
    });

    test("9. ถ้าใส่ค่าติดลบเข้าไป ต้องคืนค่าเป็น 0 ทันที", () => {
      expect(calculateAvailableSeats(-10, 5)).toBe(0);
    });
  });

  // ==========================================
  // ชุดที่ 3: เทสสถานะเต็ม/ไม่เต็ม (isWorkshopFull)
  // ==========================================
  describe("isWorkshopFull()", () => {
    test("10. คนสมัครเท่ากับจำนวนรับพอดี ต้องถือว่าเต็ม (true)", () => {
      expect(isWorkshopFull(50, 50)).toBe(true);
    });

    test("11. คนสมัครน้อยกว่าจำนวนรับ ต้องถือว่ายังไม่เต็ม (false)", () => {
      expect(isWorkshopFull(50, 49)).toBe(false);
    });
  });
});
