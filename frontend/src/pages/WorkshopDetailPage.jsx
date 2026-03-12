// frontend/src/pages/WorkshopDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; 
import axios from "axios";
import Navbar from "../components/Navbar"; 

export default function WorkshopDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // 👇 1. เพิ่มยามดักหน้าประตูก่อนเลย! 👇
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: location.pathname } });
      return; // สั่งเบรกหัวทิ่ม! ไม่ต้องไปดึงข้อมูลจากหลังบ้านต่อ
    }

    // 2. ถ้ามี Token ค่อยวิ่งไปดึงข้อมูลตามปกติ
    const fetchDetail = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/workshops/${id}`,
        );
        setWorkshop(res.data);
      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate, location.pathname]);

  const handleRegisterClick = async () => {
    // 👇 เช็ค Token สดๆ ตอนกดปุ่มเลยครับ ไม่ต้องพึ่ง State แล้ว
    const token = localStorage.getItem("token");
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนลงทะเบียน Workshop ครับ");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/api/enrollments",
        { workshopId: id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert(`🎉 ยืนยันการลงทะเบียน: ${workshop.name} สำเร็จ!`);
      navigate("/my-account");
    } catch (error) {
      alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการลงทะเบียน");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100 text-sky-700 text-xl font-bold">
        กำลังโหลดข้อมูล... ⏳
      </div>
    );
  if (!workshop)
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100 text-red-500 text-xl font-bold">
        ไม่พบข้อมูล Workshop นี้ครับ 😅
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* 👇 2. เรียกใช้งาน Navbar แทน <header> ยาวๆ ของเดิม 👇 */}
      <Navbar />

      {/* 2. Main Content */}
      <main className="grow flex flex-col items-center py-12 px-4">
        {/* การ์ดสีฟ้าขอบโค้ง ธีมเดียวกับโปรเจกต์ */}
        <div className="w-full max-w-4xl card bg-sky-100 shadow-2xl border border-sky-200 p-8 md:p-12 rounded-2xl">
          <h1 className="text-3xl font-bold text-sky-900 mb-8 border-b-2 border-sky-200 pb-4">
            Workshop : {workshop.name}
          </h1>

          <div className="bg-white rounded-xl p-8 shadow-sm mb-8 text-sky-900 border border-sky-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 text-lg mb-8">
              <p>
                <span className="font-bold w-24 inline-block">Date</span> :{" "}
                {workshop.date}
              </p>
              <p>
                <span className="font-bold w-24 inline-block">Time</span> :{" "}
                {workshop.time}
              </p>
              <p>
                <span className="font-bold w-24 inline-block">Location</span> :{" "}
                {workshop.location}
              </p>
              <p>
                <span className="font-bold w-24 inline-block">Speaker</span> :{" "}
                {workshop.speaker || "รอประกาศ"}
              </p>

              {/* 👇 1. อัปเกรดการแสดงผลที่นั่งตรงนี้ครับ 👇 */}
              <p>
                <span className="font-bold w-24 inline-block">Seats</span> :{" "}
                {/* คำนวณที่นั่งคงเหลือ: จำนวนสูงสุด ลบด้วย คนที่ลงไปแล้ว */}
                <span className="text-sky-700 font-semibold">
                  เหลือ {workshop.seats - (workshop.enrolled_count || 0)} ที่
                </span>
                <span className="text-gray-400 text-sm ml-2">
                  (จากทั้งหมด {workshop.seats} ที่นั่ง)
                </span>
              </p>
            </div>

            <div className="border-t-2 border-sky-50 pt-6">
              <span className="font-bold text-xl block mb-4 text-sky-900">
                Description :
              </span>
              <p className="text-sky-800 leading-relaxed whitespace-pre-wrap">
                {workshop.description || "ไม่มีรายละเอียดเพิ่มเติม"}
              </p>
            </div>
          </div>

          {/* 👇 2. อัปเกรดปุ่ม Register (ล็อคปุ่มถ้าที่นั่งเต็ม!) 👇 */}
          <div className="flex justify-center mt-4">
            {workshop.seats - (workshop.enrolled_count || 0) > 0 ? (
              // 🟢 ถ้าที่นั่งว่าง > 0 ให้โชว์ปุ่มลงทะเบียนสีฟ้าปกติ
              <button
                onClick={handleRegisterClick}
                className="btn bg-sky-600 text-white hover:bg-sky-700 w-full sm:w-64 rounded-full text-xl shadow-md border-none h-14"
              >
                Register
              </button>
            ) : (
              // 🔴 ถ้าที่นั่งว่าง <= 0 ให้โชว์ปุ่มสีเทา กดไม่ได้
              <button
                disabled
                className="btn bg-gray-300 text-gray-500 w-full sm:w-64 rounded-full text-xl border-none h-14 cursor-not-allowed"
              >
                ที่นั่งเต็มแล้ว 😭
              </button>
            )}
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="h-16 bg-sky-200 mt-auto"></footer>
    </div>
  );
}
