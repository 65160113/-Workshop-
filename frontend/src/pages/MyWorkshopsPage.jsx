// frontend/src/pages/MyWorkshopsPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

export default function MyWorkshopsPage() {
  const [myWorkshops, setMyWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyWorkshops();
  }, []);

  const fetchMyWorkshops = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/workshops/my-workshops`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyWorkshops(res.data);
    } catch (err) {
      console.error("Error fetching my workshops:", err);
      setError("ไม่สามารถโหลดข้อมูลงานของคุณได้");
    } finally {
      setLoading(false);
    }
  };

  const formatThaiDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const baseStyle =
      "px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm inline-block text-center min-w-[70px] sm:min-w-[80px]";

    switch (status) {
      case "approved":
        return (
          <span
            className={`${baseStyle} bg-emerald-100 text-emerald-700 border border-emerald-200`}
          >
            อนุมัติแล้ว
          </span>
        );
      case "pending":
        return (
          <span
            className={`${baseStyle} bg-amber-100 text-amber-700 border border-amber-200`}
          >
            รอตรวจสอบ
          </span>
        );
      case "rejected":
        return (
          <span
            className={`${baseStyle} bg-rose-100 text-rose-700 border border-rose-200`}
          >
            ไม่อนุมัติ
          </span>
        );
      default:
        return (
          <span
            className={`${baseStyle} bg-slate-100 text-slate-600 border border-slate-200`}
          >
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      {/* ปรับ Padding สำหรับมือถือ (py-6) และจอใหญ่ (md:py-12) */}
      <main className="grow w-full max-w-6xl mx-auto px-4 py-6 md:py-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Workshops
            </h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">
              จัดการและติดตามสถานะเวิร์กชอปที่คุณเป็นผู้จัด
            </p>
          </div>
          <Link
            to="/create-workshop"
            className="w-full sm:w-auto px-6 py-3.5 sm:py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <span className="text-xl leading-none mb-1">+</span> สร้างงานใหม่
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40 md:h-64">
            <span className="loading loading-spinner loading-lg text-indigo-600"></span>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl flex items-center gap-3 font-medium">
            {error}
          </div>
        ) : myWorkshops.length === 0 ? (
          <div className="text-center py-16 md:py-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center px-4">
            <span className="text-5xl md:text-6xl mb-4 md:mb-6">📝</span>
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
              คุณยังไม่เคยสร้างเวิร์กชอปเลย
            </h3>
            <p className="text-slate-500 mb-6 text-sm md:text-base">
              มาร่วมแบ่งปันความรู้และประสบการณ์ให้เพื่อนๆ กันเถอะ!
            </p>
            <Link
              to="/create-workshop"
              className="text-indigo-600 hover:text-indigo-800 font-bold underline underline-offset-4"
            >
              เริ่มสร้างเวิร์กชอปแรกของคุณคลิกที่นี่
            </Link>
          </div>
        ) : (
          <div className="w-full">
            {/* MOBILE VIEW */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {myWorkshops.map((ws) => (
                <div
                  key={ws.id}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 relative overflow-hidden"
                >
                  <div
                    className={`absolute top-0 left-0 w-1.5 h-full ${ws.status === "approved" ? "bg-emerald-400" : ws.status === "pending" ? "bg-amber-400" : "bg-rose-400"}`}
                  ></div>

                  <div className="flex justify-between items-start gap-3 pl-2">
                    <Link
                      to={`/workshop/${ws.id}`}
                      className="font-bold text-slate-800 hover:text-indigo-600 transition-colors line-clamp-2 text-lg leading-snug"
                    >
                      {ws.name}
                    </Link>
                    <div className="shrink-0 mt-0.5">
                      {getStatusBadge(ws.status)}
                    </div>
                  </div>

                  <div className="text-sm text-slate-500 space-y-2 mt-1 pl-2">
                    <div className="flex items-center gap-2.5">
                      <span>🗓️</span> <span>{formatThaiDate(ws.date)}</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5">📍</span>{" "}
                      <span className="line-clamp-1">{ws.location}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-3 pt-4 border-t border-slate-50 pl-2">
                    <Link
                      to={`/workshop/${ws.id}/attendees`}
                      className="flex-1 py-2.5 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 font-bold text-sm text-center transition-colors"
                    >
                      รายชื่อผู้สมัคร
                    </Link>
                    <Link
                      to={`/edit-workshop/${ws.id}`}
                      className="flex-1 py-2.5 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 font-bold text-sm text-center transition-colors"
                    >
                      แก้ไขข้อมูล
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/*DESKTOP VIEW (โชว์เฉพาะจอคอม แท็บเล็ต) */}
            <div className="hidden md:block bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-slate-500 text-sm tracking-wider">
                      <th className="font-bold py-4 pl-6 w-[35%]">
                        ชื่องานเวิร์กชอป
                      </th>
                      <th className="font-bold py-4 w-[15%]">วันที่จัดงาน</th>
                      <th className="font-bold py-4 w-[17%]">สถานที่</th>
                      <th className="font-bold py-4 text-center w-[15%]">
                        สถานะ
                      </th>
                      <th className="font-bold py-4 text-center w-[18%]">
                        จัดการ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    {myWorkshops.map((ws) => (
                      <tr
                        key={ws.id}
                        className="hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-none"
                      >
                        <td className="pl-6 py-4">
                          <Link
                            to={`/workshop/${ws.id}`}
                            className="font-bold text-slate-800 hover:text-indigo-600 transition-colors line-clamp-2"
                            title={`ดูรายละเอียด: ${ws.name}`}
                          >
                            {ws.name}
                          </Link>
                        </td>
                        <td className="py-4 whitespace-nowrap text-sm font-medium">
                          {formatThaiDate(ws.date)}
                        </td>
                        <td className="py-4">
                          <p
                            className="truncate text-sm text-slate-500"
                            title={ws.location}
                          >
                            {ws.location}
                          </p>
                        </td>
                        <td className="py-4 text-center">
                          {getStatusBadge(ws.status)}
                        </td>
                        <td className="py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <Link
                              to={`/workshop/${ws.id}/attendees`}
                              className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 font-bold text-xs transition-colors"
                              title="ดูรายชื่อผู้สมัคร"
                            >
                              รายชื่อ
                            </Link>
                            <Link
                              to={`/edit-workshop/${ws.id}`}
                              className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 font-bold text-xs transition-colors"
                              title="แก้ไขข้อมูล"
                            >
                              แก้ไข
                            </Link>
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
      </main>
      <footer className="h-16 bg-slate-100 mt-auto border-t border-slate-200"></footer>
    </div>
  );
}
