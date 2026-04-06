// frontend/src/pages/WorkshopDetailPage.jsx
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

export default function WorkshopDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false); // State เช็คการสมัคร

  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  // ฟังก์ชันดึงรายละเอียดงาน (แยกออกมาเพื่อให้เรียกใช้ซ้ำตอนกดปุ่มได้)
  const fetchDetail = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/workshops/${id}`);
      setWorkshop(res.data);
    } catch (error) {
      console.error("Error fetching detail:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // ฟังก์ชันเช็คว่าเคยสมัครงานนี้หรือยัง
  const fetchEnrollmentStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        `${API_URL}/api/workshops/${id}/check-enrollment`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setIsEnrolled(res.data.isEnrolled);
    } catch (err) {
      console.error("Error checking status:", err);
    }
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentUserRole(payload.role);
      setCurrentUserId(payload.id);
    } catch (error) {
      console.error("Token decoding error:", error);
    }

    fetchDetail();
    fetchEnrollmentStatus();

  }, [navigate, location.pathname, fetchDetail, fetchEnrollmentStatus]);

  // ฟังก์ชันกดสมัครเข้าร่วม
  const handleRegisterClick = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${API_URL}/api/enrollments`,
        { workshopId: id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert(`ยืนยันการลงทะเบียน: ${workshop.name} สำเร็จ!`);
      setIsEnrolled(true); // เปลี่ยนปุ่มเป็นยกเลิกทันที
      fetchDetail(); // โหลดข้อมูลใหม่เพื่ออัปเดตยอดที่นั่ง

    } catch (error) {
      alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการลงทะเบียน");
    }
  };

  // ฟังก์ชันกดยกเลิกการสมัคร 
  const handleCancelEnrollment = async (workshopId) => {
    const isConfirm = window.confirm(
      "คุณแน่ใจหรือไม่ที่จะยกเลิกการเข้าร่วมเวิร์กชอปนี้?",
    );
    if (!isConfirm) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${API_URL}/api/workshops/${workshopId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("✅ " + res.data.message);
      setIsEnrolled(false); // เปลี่ยนปุ่มกลับเป็นสีฟ้าให้สมัครใหม่ได้
      fetchDetail(); // โหลดข้อมูลใหม่เพื่อคืนที่นั่ง
    } catch (err) {
      console.error("Error canceling enrollment:", err);
      alert(err.response?.data?.message || "เกิดข้อผิดพลาด ไม่สามารถยกเลิกได้");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100 text-sky-700 text-xl font-bold">
        กำลังโหลดข้อมูล...
      </div>
    );
  if (!workshop)
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100 text-red-500 text-xl font-bold">
        ไม่พบข้อมูล Workshop นี้ครับ
      </div>
    );

  // ลอจิกปุ่มกด (ประกอบร่างสมบูรณ์)
  const renderActionButton = () => {
    // 1. Admin/Approver ลงทะเบียนไม่ได้
    if (currentUserRole === "admin" || currentUserRole === "approver") {
      return (
        <div className="text-center text-sky-800 font-semibold bg-sky-50 p-4 rounded-xl border border-sky-200">
          คุณอยู่ในโหมดผู้ดูแลระบบ (Admin)
          <br />
          ไม่สามารถลงทะเบียนได้
        </div>
      );
    }

    // 2. Organizer สร้างเอง ลงเอง (ไม่ได้!)
    if (
      currentUserRole === "organizer" &&
      currentUserId === workshop.organizer_id
    ) {
      return (
        <div className="text-center text-amber-600 font-semibold bg-amber-50 p-4 rounded-xl border border-amber-200">
          คุณคือผู้จัดงาน (Organizer) ของ Workshop นี้
          <br />
          (ระบบสงวนสิทธิ์ไม่ให้ผู้จัดงานลงทะเบียนซ้ำครับ)
        </div>
      );
    }

    // 3. ถ้าเคยสมัครไปแล้ว -> โชว์ปุ่มยกเลิกสีแดง
    if (isEnrolled) {
      return (
        <button
          onClick={() => handleCancelEnrollment(workshop.id)}
          className="btn bg-red-500 text-white hover:bg-red-600 w-full sm:w-64 rounded-full text-xl shadow-md border-none h-14"
        >
          ยกเลิกการสมัคร
        </button>
      );
    }

    // 4. ถ้าย้อนกลับมาถึงตรงนี้แปลว่ายังไม่สมัคร -> เช็คที่นั่งว่าง
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
      // 5. ที่นั่งเต็ม
      return (
        <button
          disabled
          className="btn bg-gray-300 text-gray-500 w-full sm:w-64 rounded-full text-xl border-none h-14 cursor-not-allowed"
        >
          ที่นั่งเต็มแล้ว
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
                <span className="font-bold w-24 inline-block">Category</span> :{" "}
                <span className="badge badge-outline text-sky-700 font-semibold">
                  {workshop.category_name || "-"}
                </span>
              </p>
              <p>
                <span className="font-bold w-24 inline-block">Platform</span> :{" "}
                <span className="badge badge-outline text-indigo-600 font-semibold">
                  {workshop.platform_name || "-"}
                </span>
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

          <div className="flex justify-center mt-4">{renderActionButton()}</div>
        </div>
      </main>

      <footer className="h-16 bg-sky-200 mt-auto"></footer>
    </div>
  );
}
