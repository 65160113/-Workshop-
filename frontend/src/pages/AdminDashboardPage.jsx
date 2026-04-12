// frontend/src/pages/AdminDashboardPage.jsx
import { useState, useEffect, useCallback } from "react";
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

      if (payload.role !== "admin" && payload.role !== "approver") {
        alert("พื้นที่หวงห้าม! เฉพาะผู้ดูแลระบบและผู้อนุมัติเท่านั้นครับ");
        navigate("/");
        return;
      }

      setUserRole(payload.role);

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

  const handleUpdateStatus = async (id, statusName) => {
    const isConfirm = window.confirm(
      `คุณแน่ใจหรือไม่ที่จะ ${statusName} งานนี้?`,
    );
    if (!isConfirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_URL}/api/workshops/${id}/status`,
        { status: statusName },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert(`อัปเดตสถานะเป็น ${statusName} เรียบร้อยแล้ว!`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="grow p-4 py-8 md:py-12 flex flex-col items-center">
        <div className="w-full max-w-6xl">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                Admin Dashboard
              </h1>
              <p className="text-slate-500 mt-1 text-sm sm:text-base">
                ภาพรวมระบบและจัดการข้อมูลเวิร์กชอปที่รอการอนุมัติ
              </p>
            </div>
            {userRole === "admin" && (
              <Link
                to="/admin/manage-users"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-900 shadow-md hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-2"
              >
                จัดการผู้ใช้งาน
              </Link>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <span className="loading loading-spinner loading-lg text-indigo-600"></span>
            </div>
          ) : (
            <>
              {/* Stats Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group">
                  <p className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-2">
                    Workshop ทั้งหมด
                  </p>
                  <h3 className="text-4xl font-black text-slate-800 mb-1">
                    {stats?.totalWorkshops || 0}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    จำนวนงานในระบบ
                  </p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-3xl shadow-sm border border-amber-200 flex flex-col relative overflow-hidden group">
                  <p className="text-amber-700 font-bold uppercase tracking-wider text-xs mb-2">
                    รอการอนุมัติ
                  </p>
                  <h3 className="text-4xl font-black text-amber-600 mb-1">
                    {stats?.pendingWorkshops || 0}
                  </h3>
                  <p className="text-xs text-amber-600/80 font-medium">
                    ต้องตรวจสอบด่วน!
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group">
                  <p className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-2">
                    ผู้ใช้งานในระบบ
                  </p>
                  <h3 className="text-4xl font-black text-sky-600 mb-1">
                    {stats?.totalUsers || 0}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    สมาชิกลงทะเบียน
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group">
                  <p className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-2">
                    ยอดการจองที่นั่ง
                  </p>
                  <h3 className="text-4xl font-black text-emerald-600 mb-1">
                    {stats?.totalEnrollments || 0}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    ตั๋วที่ถูกจองแล้วทั้งหมด
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  รายการรออนุมัติ
                </h2>
                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {workshops.length} Tasks
                </span>
              </div>

              {workshops.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    ยอดเยี่ยมมาก!
                  </h3>
                  <p className="text-slate-500">
                    ไม่มี Workshop ค้างรออนุมัติแล้วครับ ไปพักผ่อนได้เลย
                  </p>
                </div>
              ) : (
                <div className="w-full">
                  {/* MOBILE VIEW (การ์ด) */}
                  <div className="grid grid-cols-1 gap-4 lg:hidden">
                    {workshops.map((ws) => (
                      <div
                        key={ws.id}
                        className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4"
                      >
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {ws.date}
                          </span>
                          <Link
                            to={`/workshop/${ws.id}`}
                            target="_blank"
                            className="font-bold text-slate-800 hover:text-indigo-600 text-lg leading-snug line-clamp-2 transition-colors"
                          >
                            {ws.name}
                          </Link>
                        </div>

                        <div className="text-sm text-slate-500 flex flex-col gap-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <p>
                            <span className="font-semibold text-slate-700">
                              วิทยากร:
                            </span>{" "}
                            {ws.speaker || "-"}
                          </p>
                          <p>
                            <span className="font-semibold text-slate-700">
                              ผู้จัด:
                            </span>{" "}
                            {ws.organizer_name}
                          </p>
                        </div>

                        <div className="flex gap-3 mt-1">
                          <button
                            onClick={() =>
                              handleUpdateStatus(ws.id, "approved")
                            }
                            className="flex-1 py-3 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white font-bold text-sm transition-all text-center border border-emerald-100 hover:border-emerald-500"
                          >
                            approved
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(ws.id, "rejected")
                            }
                            className="flex-1 py-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white font-bold text-sm transition-all text-center border border-rose-100 hover:border-rose-500"
                          >
                            rejected
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* DESKTOP VIEW (ตาราง) */}
                  <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="table w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr className="text-slate-500 text-sm tracking-wider">
                            <th className="font-bold py-4 pl-6 w-[15%]">
                              วันที่จัดงาน
                            </th>
                            <th className="font-bold py-4 w-[35%]">
                              ชื่องาน (Workshop)
                            </th>
                            <th className="font-bold py-4 w-[15%]">วิทยากร</th>
                            <th className="font-bold py-4 w-[15%]">
                              ผู้จัด (Organizer)
                            </th>
                            <th className="font-bold py-4 text-center w-[20%]">
                              จัดการ
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-slate-700">
                          {workshops.map((ws) => (
                            <tr
                              key={ws.id}
                              className="hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-none"
                            >
                              <td className="pl-6 py-5 font-semibold text-slate-500 whitespace-nowrap">
                                {ws.date}
                              </td>
                              <td className="py-5">
                                <Link
                                  to={`/workshop/${ws.id}`}
                                  target="_blank"
                                  className="font-bold text-slate-800 hover:text-indigo-600 transition-colors line-clamp-2"
                                  title="กดเพื่อดูรายละเอียด"
                                >
                                  {ws.name}
                                </Link>
                              </td>
                              <td className="py-5 text-sm">
                                {ws.speaker || "-"}
                              </td>
                              <td className="py-5 text-sm text-slate-500">
                                {ws.organizer_name}
                              </td>
                              <td className="py-5">
                                <div className="flex justify-center gap-2">
                                  <button
                                    onClick={() =>
                                      handleUpdateStatus(ws.id, "approved")
                                    }
                                    className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white font-bold text-xs transition-all border border-emerald-100 hover:border-emerald-500 shadow-sm"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleUpdateStatus(ws.id, "rejected")
                                    }
                                    className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-500 hover:text-white font-bold text-xs transition-all border border-rose-100 hover:border-rose-500 shadow-sm"
                                  >
                                    Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="h-16 bg-slate-100 mt-auto border-t border-slate-200"></footer>
    </div>
  );
}