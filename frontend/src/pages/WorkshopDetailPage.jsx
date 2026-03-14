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

  // 🌟 เพิ่ม State ไว้เก็บข้อมูลของคนที่ล็อคอิน
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    // 🌟 แอบแกะ Token เพื่อดู Role และ ID ของคนที่ล็อคอินอยู่
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentUserRole(payload.role);
      setCurrentUserId(payload.id); // สมมติว่าใน Token มี id แนบมาด้วย (ถ้าไม่มีเดี๋ยวเราค่อยไปแก้ฝั่ง backend login)
    } catch (error) {
      console.error("Token decoding error:", error);
    }

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

  // 🌟 ลอจิกสำหรับตัดสินใจว่าจะโชว์ปุ่มอะไร?
  const renderActionButton = () => {
    // 1. ถ้าเป็น Admin หรือ Approver -> โชว์ข้อความเฉยๆ ไม่ให้กด
    if (currentUserRole === "admin" || currentUserRole === "approver") {
      return (
        <div className="text-center text-sky-800 font-semibold bg-sky-50 p-4 rounded-xl border border-sky-200">
          👑 คุณอยู่ในโหมดผู้ดูแลระบบ (Admin)
          <br />
          ไม่สามารถลงทะเบียนได้
        </div>
      );
    }

    // 2. ถ้าเป็น Organizer และเป็นคนสร้างงานนี้เอง! -> โชว์ข้อความว่าเป็นผู้จัด
    // (ตอนแก้ Backend เราเพิ่ม w.organizer_id ส่งมาด้วยแล้ว)
    if (
      currentUserRole === "organizer" &&
      currentUserId === workshop.organizer_id
    ) {
      return (
        <div className="text-center text-amber-600 font-semibold bg-amber-50 p-4 rounded-xl border border-amber-200">
          🛠️ คุณคือผู้จัดงาน (Organizer) ของ Workshop นี้
          <br />
          (ระบบสงวนสิทธิ์ไม่ให้ผู้จัดงานลงทะเบียนซ้ำครับ)
        </div>
      );
    }

    // 3. ถ้าไม่ใช่ Admin และ ไม่ใช่ Organizer ของงานตัวเอง (นักศึกษา หรือ ออแกไนซ์คนอื่น)
    // ถึงจะเข้าสู่การเช็คที่นั่งว่างตามปกติ
    if (workshop.seats - (workshop.enrolled_count || 0) > 0) {
      return (
        <button
          onClick={handleRegisterClick}
          className="btn bg-sky-600 text-white hover:bg-sky-700 w-full sm:w-64 rounded-full text-xl shadow-md border-none h-14"
        >
          Register
        </button>
      );
    } else {
      return (
        <button
          disabled
          className="btn bg-gray-300 text-gray-500 w-full sm:w-64 rounded-full text-xl border-none h-14 cursor-not-allowed"
        >
          ที่นั่งเต็มแล้ว 😭
        </button>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />

      <main className="grow flex flex-col items-center py-12 px-4">
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

              <p>
                <span className="font-bold w-24 inline-block">Seats</span> :{" "}
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

          {/* 👇 3. เอาฟังก์ชันที่ตัดสินใจแล้วมาวางโชว์ตรงนี้ 👇 */}
          <div className="flex justify-center mt-4">{renderActionButton()}</div>
        </div>
      </main>

      <footer className="h-16 bg-sky-200 mt-auto"></footer>
    </div>
  );
}
