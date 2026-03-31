// frontend/src/pages/AdminDashboardPage.jsx
import { useState, useEffect, useCallback} from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboardPage() {
  const [workshops, setWorkshops] = useState([]);
  const [stats, setStats] = useState(null); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(""); 

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));

      // อัปเดตให้เช็คว่า ถ้า "ไม่ใช่ทั้ง admin และไม่ใช่ทั้ง approver" ค่อยเตะออก
      if (payload.role !== "admin" && payload.role !== "approver") {
        alert("พื้นที่หวงห้าม! เฉพาะผู้ดูแลระบบและผู้อนุมัติเท่านั้นครับ 🛑");
        navigate("/");
        return;
      }

      setUserRole(payload.role); // ตำแหน่งไว้เอาไปซ่อนปุ่ม

      const [pendingRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/api/workshops/pending`, {
          headers: { Authorization: `Bearer ${token}` }, 
        }),
        axios.get(`${API_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setWorkshops(pendingRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("ดึงข้อมูลไม่สำเร็จ:", error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ฟังก์ชันจัดการปุ่ม Approve / Reject
  const handleUpdateStatus = async (id, statusName) => {
    const isConfirm = window.confirm(
      `คุณแน่ใจหรือไม่ที่จะ ${statusName} งานนี้?`,
    );
    if (!isConfirm) return;

    try {
      await axios.patch(`${API_URL}/api/workshops/${id}/status`, {
        status: statusName,
      });
      alert(`อัปเดตสถานะเป็น ${statusName} เรียบร้อยแล้ว! 🎉`);

      // อัปเดตเสร็จปุ๊บ สั่งให้โหลดข้อมูลใหม่ (ตารางจะได้หายไป และตัวเลขสถิติจะได้อัปเดตทันที!)
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />

      <main className="grow p-4 py-12 flex flex-col items-center">
        <div className="w-full max-w-6xl">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-sky-900 flex items-center gap-3 mb-0">
              👑 Admin Dashboard
            </h1>
            {userRole === "admin" && (
              <Link
                to="/admin/manage-users"
                className="btn bg-indigo-600 text-white hover:bg-indigo-700 border-none rounded-full shadow-md px-6 text-base"
              >
                👥 จัดการผู้ใช้งาน
              </Link>
            )}
          </div>

          {loading ? (
            <div className="text-center text-sky-700 text-xl mt-10">
              กำลังโหลดข้อมูล... ⏳
            </div>
          ) : (
            <>
              {/* กล่องตัวเลขสถิติ (Stats) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="stat bg-white rounded-2xl shadow-sm border border-sky-100">
                  <div className="stat-title text-sky-700 font-semibold">
                    Workshop ทั้งหมด
                  </div>
                  <div className="stat-value text-sky-900">
                    {stats?.totalWorkshops || 0}
                  </div>
                  <div className="stat-desc">จำนวนงานในระบบ</div>
                </div>

                <div className="stat bg-orange-50 rounded-2xl shadow-sm border border-orange-200">
                  <div className="stat-title text-orange-800 font-semibold">
                    รอการอนุมัติ
                  </div>
                  <div className="stat-value text-orange-600">
                    {stats?.pendingWorkshops || 0}
                  </div>
                  <div className="stat-desc text-orange-700 font-medium">
                    ต้องตรวจสอบด่วน!
                  </div>
                </div>

                <div className="stat bg-white rounded-2xl shadow-sm border border-indigo-100">
                  <div className="stat-title text-indigo-700 font-semibold">
                    ผู้ใช้งานในระบบ
                  </div>
                  <div className="stat-value text-indigo-900">
                    {stats?.totalUsers || 0}
                  </div>
                  <div className="stat-desc">สมาชิกลงทะเบียน</div>
                </div>

                <div className="stat bg-white rounded-2xl shadow-sm border border-emerald-100">
                  <div className="stat-title text-emerald-700 font-semibold">
                    ยอดการจองที่นั่ง
                  </div>
                  <div className="stat-value text-emerald-600">
                    {stats?.totalEnrollments || 0}
                  </div>
                  <div className="stat-desc">ตั๋วที่ถูกจองแล้วทั้งหมด</div>
                </div>
              </div>

              {/* ตารางจัดการงานที่รออนุมัติ (Table) */}
              <h2 className="text-2xl font-bold text-sky-800 mb-6 flex items-center gap-3">
                📝 รายการ Workshop รออนุมัติ
                <span className="text-base font-normal bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                  มี {workshops.length} งาน
                </span>
              </h2>

              {workshops.length === 0 ? (
                <div className="bg-sky-50 border border-sky-200 rounded-2xl p-10 text-center text-sky-700 text-xl font-semibold shadow-sm">
                  🎉 เย้! ไม่มี Workshop ค้างรออนุมัติแล้วครับ
                </div>
              ) : (
                <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-sky-100">
                  <table className="table w-full text-base">
                    <thead className="bg-sky-800 text-white text-lg">
                      <tr>
                        <th>วันที่จัดงาน</th>
                        <th>ชื่องาน (Workshop)</th>
                        <th>วิทยากร</th>
                        <th>ผู้จัด (Organizer)</th>
                        <th className="text-center">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workshops.map((ws) => (
                        <tr key={ws.id} className="hover:bg-sky-50 transition">
                          <td className="font-semibold text-sky-700">
                            {ws.date}
                          </td>
                          <td className="font-bold text-gray-800">
                            <Link
                              to={`/workshop/${ws.id}`}
                              target="_blank"
                              className="text-sky-700 hover:text-sky-500 underline transition-colors"
                            >
                              {ws.name}
                            </Link>
                          </td>
                          <td>{ws.speaker || "-"}</td>
                          <td className="text-gray-500">{ws.organizer_name}</td>
                          <td className="flex justify-center gap-2">
                            <button
                              onClick={() =>
                                handleUpdateStatus(ws.id, "approved")
                              }
                              className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(ws.id, "rejected")
                              }
                              className="btn btn-sm bg-rose-500 hover:bg-rose-600 text-white border-none shadow-sm"
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="h-16 bg-sky-200 mt-auto"></footer>
    </div>
  );
}
