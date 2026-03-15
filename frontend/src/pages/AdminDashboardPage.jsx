// frontend/src/pages/AdminDashboardPage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboardPage() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🌟 ฟังก์ชันดึงข้อมูลงานที่รออนุมัติ
  const fetchPendingWorkshops = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/workshops/pending`);
      setWorkshops(res.data);
    } catch (error) {
      console.error("ดึงข้อมูลไม่สำเร็จ:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingWorkshops();
  }, []);

  // 🌟 ฟังก์ชันจัดการปุ่ม Approve / Reject
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

      // อัปเดตเสร็จปุ๊บ สั่งให้โหลดข้อมูลตารางใหม่ทันที (งานที่กดไปแล้วจะได้หายไป)
      fetchPendingWorkshops();
    } catch (error) {
      alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />

      <main className="grow p-4 py-12 flex flex-col items-center">
        <div className="w-full max-w-5xl">
          <h1 className="text-3xl font-bold text-sky-900 mb-8 flex items-center gap-3">
            👑 Admin Dashboard{" "}
            <span className="text-lg font-normal bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
              รออนุมัติ {workshops.length} งาน
            </span>
          </h1>

          {loading ? (
            <div className="text-center text-sky-700 text-xl mt-10">
              กำลังโหลดข้อมูล... ⏳
            </div>
          ) : workshops.length === 0 ? (
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-10 text-center text-sky-700 text-xl font-semibold shadow-sm">
              🎉 เย้! ไม่มี Workshop ค้างรออนุมัติแล้วครับ
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-sky-100">
              <table className="table w-full text-base">
                {/* หัวตาราง */}
                <thead className="bg-sky-800 text-white text-lg">
                  <tr>
                    <th>วันที่จัดงาน</th>
                    <th>ชื่องาน (Workshop)</th>
                    <th>วิทยากร</th>
                    <th>ผู้จัด (Organizer)</th>
                    <th className="text-center">จัดการ</th>
                  </tr>
                </thead>
                {/* ข้อมูลตาราง */}
                <tbody>
                  {workshops.map((ws) => (
                    <tr key={ws.id} className="hover:bg-sky-50 transition">
                      <td className="font-semibold text-sky-700">{ws.date}</td>
                      <td className="font-bold text-gray-800">
                        <Link
                          to={`/workshop/${ws.id}`}
                          target="_blank" // 🌟 ทริค UX: เปิดแท็บใหม่ แอดมินจะได้ไม่หลุดจากหน้า Dashboard
                          className="text-sky-700 hover:text-sky-500 underline transition-colors"
                        >
                          {ws.name}
                        </Link>
                      </td>
                      <td>{ws.speaker || "-"}</td>
                      <td className="text-gray-500">{ws.organizer_name}</td>
                      <td className="flex justify-center gap-2">
                        {/* ปุ่มสีเขียว Approve */}
                        <button
                          onClick={() => handleUpdateStatus(ws.id, "approved")}
                          className="btn btn-sm bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-sm"
                        >
                          Approve
                        </button>
                        {/* ปุ่มสีแดง Reject */}
                        <button
                          onClick={() => handleUpdateStatus(ws.id, "rejected")}
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
        </div>
      </main>

      <footer className="h-16 bg-sky-200 mt-auto"></footer>
    </div>
  );
}
