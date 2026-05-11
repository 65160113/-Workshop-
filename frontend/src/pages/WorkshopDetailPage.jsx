// frontend/src/pages/WorkshopDetailPage.jsx
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

export default function WorkshopDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const getCoverImage = (categoryId) => {
    const images = {
      1: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80",
      2: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80",
      3: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
      default:
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80",
    };
    return images[categoryId] || images.default;
  };

  const fetchDetail = useCallback(async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/workshops/${id}`,
      );
      setWorkshop(res.data);
    } catch (error) {
      console.error("Error fetching detail:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

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
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserRole(payload.role);
        setCurrentUserId(payload.id);
      } catch (error) {
        console.error("Token decoding error:", error);
      }
    }
    fetchDetail();
    fetchEnrollmentStatus();
  }, [id, fetchDetail, fetchEnrollmentStatus]);

  const handleRegisterClick = async () => {
    const token = localStorage.getItem("token");
    if (!token)
      return navigate("/login", { state: { from: location.pathname } });
    try {
      await axios.post(
        `${API_URL}/api/enrollments`,
        { workshopId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      alert(`ลงทะเบียนสำเร็จ!`);
      setIsEnrolled(true);
      fetchDetail();
    } catch (error) {
      alert(error.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  const handleCancelEnrollment = async (workshopId) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ที่จะยกเลิกการเข้าร่วม?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_URL}/api/workshops/${workshopId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      alert("ยกเลิกการลงทะเบียนเรียบร้อย");
      setIsEnrolled(false);
      fetchDetail();
    } catch (err) {
      console.error("Cancel error:", err);
      alert(err.response?.data?.message || "ไม่สามารถยกเลิกได้");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <span className="loading loading-spinner loading-lg text-indigo-600"></span>
      </div>
    );

  if (!workshop)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-800">
          ไม่พบข้อมูลเวิร์กชอป
        </h2>
        <Link to="/" className="btn btn-ghost mt-4">
          กลับหน้าหลัก
        </Link>
      </div>
    );

  const remainingSeats = workshop.seats - (workshop.enrolled_count || 0);
  const isFull = remainingSeats <= 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="grow w-full max-w-7xl mx-auto py-8 px-4 md:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition-colors group"
        >
          <span className="mr-2 group-hover:-translate-x-1 transition-transform">
            ←
          </span>{" "}
          กลับ
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 flex flex-col gap-6">
            {/* Cover Image Card */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
              <div className="h-64 md:h-96 w-full relative">
                <img
                  src={getCoverImage(workshop.category_id)}
                  alt={workshop.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 left-6 flex gap-2">
                  <span className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-indigo-700 font-bold text-sm shadow-sm">
                    {workshop.category_name}
                  </span>
                  <span className="bg-indigo-600/90 backdrop-blur px-4 py-1.5 rounded-full text-white font-bold text-sm shadow-sm">
                    {workshop.platform_name}
                  </span>
                </div>
              </div>

              <div className="p-8 md:p-10">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">
                  {workshop.name}
                </h1>

                <div className="prose max-w-none text-slate-600 leading-relaxed">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">
                    รายละเอียดกิจกรรม
                  </h3>
                  <p className="whitespace-pre-wrap">
                    {workshop.description || "ไม่มีรายละเอียดเพิ่มเติม"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3 flex flex-col gap-6">
            {/* Registration Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 sticky top-24">
              <div className="mb-8 pb-6 border-b border-slate-100">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-slate-500 font-medium">
                    สถานะที่นั่ง
                  </span>
                  {isFull ? (
                    <span className="text-rose-600 font-bold">เต็มแล้ว</span>
                  ) : (
                    <span className="text-emerald-600 font-bold">
                      เปิดรับสมัคร
                    </span>
                  )}
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${isFull ? "bg-rose-500" : "bg-indigo-600"}`}
                    style={{
                      width: `${(workshop.enrolled_count / workshop.seats) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="mt-3 text-sm text-slate-400 text-center">
                  ลงทะเบียนแล้ว {workshop.enrolled_count} จาก {workshop.seats}{" "}
                  ที่นั่ง
                </p>
              </div>

              {/* Info List */}
              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl">
                    🗓️
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      วันที่จัดงาน
                    </p>
                    <p className="text-slate-700 font-bold">{workshop.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-2xl">
                    ⏰
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      เวลา
                    </p>
                    <p className="text-slate-700 font-bold">
                      {workshop.time} น.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-2xl">
                    📍
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      สถานที่ / ลิงก์
                    </p>
                    <p className="text-slate-700 font-bold">
                      {workshop.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl">
                    👤
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      วิทยากร
                    </p>
                    <p className="text-slate-700 font-bold">
                      {workshop.speaker || "ยังไม่ระบุ"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex flex-col gap-3">
                {currentUserRole === "admin" ||
                currentUserRole === "approver" ? (
                  <div className="bg-slate-50 p-4 rounded-2xl text-center text-slate-500 text-sm font-medium border border-dashed border-slate-200">
                    โหมดผู้ดูแลระบบ ไม่สามารถลงทะเบียนได้
                  </div>
                ) : currentUserRole === "organizer" &&
                  currentUserId === workshop.organizer_id ? (
                  <div className="bg-amber-50 p-4 rounded-2xl text-center text-amber-700 text-sm font-medium border border-dashed border-amber-200">
                    คุณเป็นเจ้าของกิจกรรมนี้
                  </div>
                ) : isEnrolled ? (
                  <button
                    onClick={() => handleCancelEnrollment(workshop.id)}
                    className="w-full py-4 rounded-2xl bg-rose-50 text-rose-600 font-black hover:bg-rose-100 transition-all border-2 border-rose-100"
                  >
                    ยกเลิกการเข้าร่วม
                  </button>
                ) : (
                  <button
                    disabled={isFull}
                    onClick={handleRegisterClick}
                    className={`w-full py-4 rounded-2xl font-black text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 ${
                      isFull
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none hover:translate-y-0"
                        : "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white"
                    }`}
                  >
                    {isFull ? "ที่นั่งเต็มแล้ว" : "ลงทะเบียนเลย"}
                  </button>
                )}
                <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest mt-2">
                  Secure registration powered by Workshop.Reg
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
