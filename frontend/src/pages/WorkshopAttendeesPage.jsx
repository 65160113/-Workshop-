// frontend/src/pages/WorkshopAttendeesPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

export default function WorkshopAttendeesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workshopName, setWorkshopName] = useState("");

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // ดึงทั้งรายชื่อและข้อมูล Workshop เพื่อเอาชื่อมาโชว์ที่หัวเว็บ
        const [attendeesRes, workshopRes] = await Promise.all([
          axios.get(`${API_URL}/api/workshops/${id}/attendees`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/workshops/${id}`),
        ]);

        setAttendees(attendeesRes.data);
        setWorkshopName(workshopRes.data.name);
      } catch (err) {
        console.error("Error fetching attendees:", err);
        alert("ไม่สามารถโหลดรายชื่อผู้เข้าร่วมได้ หรือคุณไม่มีสิทธิ์เข้าถึง");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendees();
  }, [id, navigate]);

  // ฟังก์ชัน Export CSV 
  const handleExportCSV = () => {
    if (attendees.length === 0) return;

    // 1. สร้างหัวตาราง
    const headers = ["ลำดับ,ชื่อ-นามสกุล,อีเมล,วันที่สมัคร"];

    // 2. แมพข้อมูลใส่แต่ละแถว
    const rows = attendees.map((user, index) => {
      const fullName = `${user.first_name} ${user.last_name}`;
      const date = new Date(user.registered_at).toLocaleDateString("th-TH");
      return `${index + 1},${fullName},${user.email},${date}`;
    });

    // 3. รวมข้อมูล และใส่ \uFEFF กันภาษาไทยเพี้ยนใน Excel
    const csvContent = "\uFEFF" + [headers, ...rows].join("\n");

    // 4. สร้างไฟล์แล้วบังคับดาวน์โหลด
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `รายชื่อผู้สมัคร_${workshopName || id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="grow w-full max-w-5xl mx-auto px-4 py-6 md:py-12">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div className="w-full md:w-2/3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-slate-500 hover:text-indigo-600 mb-4 transition-colors group font-semibold text-sm"
            >
              <span className="mr-2 group-hover:-translate-x-1 transition-transform">
                ←
              </span>{" "}
              กลับไปหน้าจัดการ
            </button>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug line-clamp-2">
              <span className="text-indigo-600">รายชื่อผู้สมัคร:</span>{" "}
              {workshopName || "กำลังโหลด..."}
            </h1>
            <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
              ยอดรวมทั้งหมด:{" "}
              <strong className="text-slate-800">{attendees.length}</strong> คน
            </p>
          </div>

          <div className="w-full md:w-auto mt-4 md:mt-0">
            <button
              onClick={handleExportCSV}
              disabled={attendees.length === 0 || loading}
              className={`w-full md:w-auto px-6 py-3.5 md:py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                attendees.length === 0
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5"
              }`}
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-3xl shadow-sm border border-slate-100">
            <span className="loading loading-spinner loading-lg text-indigo-600"></span>
          </div>
        ) : attendees.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
              ยังไม่มีผู้สมัคร
            </h3>
            <p className="text-slate-500 text-sm md:text-base">
              ลองโปรโมทเวิร์กชอปของคุณเพิ่มเติมดูสิครับ!
            </p>
          </div>
        ) : (
          <div className="w-full">
            {/* MOBILE VIEW (การ์ด) */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {attendees.map((user, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4"
                >
                  {/* กล่องเลขลำดับ */}
                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center shrink-0 mt-1 border border-indigo-100">
                    {index + 1}
                  </div>

                  <div className="flex flex-col overflow-hidden">
                    <p className="font-bold text-slate-800 text-lg line-clamp-1">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-sm text-slate-500 truncate flex items-center gap-1.5 mt-1">
                      <span>✉️</span> {user.email}
                    </p>
                    <p className="text-xs font-bold text-slate-400 mt-3 bg-slate-50 self-start px-2.5 py-1 rounded-md border border-slate-100">
                      สมัครเมื่อ:{" "}
                      {new Date(user.registered_at).toLocaleDateString("th-TH")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP VIEW (ตาราง) */}
            <div className="hidden md:block bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-slate-500 text-sm tracking-wider">
                      <th className="font-bold py-4 text-center w-[10%]">
                        ลำดับ
                      </th>
                      <th className="font-bold py-4 pl-4 w-[35%]">
                        ชื่อ-นามสกุล
                      </th>
                      <th className="font-bold py-4 w-[35%]">อีเมล</th>
                      <th className="font-bold py-4 text-center w-[20%]">
                        วันที่สมัคร
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    {attendees.map((user, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-none"
                      >
                        <td className="font-bold text-center text-slate-400 py-4">
                          {index + 1}
                        </td>
                        <td className="font-bold text-slate-800 pl-4 py-4">
                          {user.first_name} {user.last_name}
                        </td>
                        <td className="text-slate-500 py-4">{user.email}</td>
                        <td className="text-center text-sm font-medium py-4">
                          {new Date(user.registered_at).toLocaleDateString(
                            "th-TH",
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="h-16 bg-slate-100 mt-auto border-t border-slate-200"></footer>
    </div>
  );
}
