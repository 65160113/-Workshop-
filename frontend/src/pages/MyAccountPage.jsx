// frontend/src/pages/MyAccountPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

export default function MyAccountPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [myWorkshops, setMyWorkshops] = useState([]);
  const [profile, setProfile] = useState(null);
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("กรุณาเข้าสู่ระบบก่อนครับ");
        navigate("/login");
        return;
      }
      setIsLoggedIn(true);

      try {
        try {
          const profileRes = await axios.get(`${API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProfile(profileRes.data);
        } catch (err) {
          console.log("Profile API status:", err.message);
        }

        if (userRole !== "admin" && userRole !== "approver") {
          const res = await axios.get(
            `${API_URL}/api/enrollments/my-workshops`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          const formattedData = res.data.map((ws) => ({
            ...ws,
            status: ws.status === "active" ? "Registered" : "Cancelled",
          }));
          setMyWorkshops(formattedData);
        }
      } catch (error) {
        console.error("Error:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchData();
  }, [navigate, userRole]);

  if (!isLoggedIn) return null;

  const getStatusBadge = (status) => {
    if (status === "Registered") {
      return (
        <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-200 shadow-sm inline-block text-center min-w-[90px]">
          Registered
        </span>
      );
    }
    return (
      <span className="px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider border border-rose-200 shadow-sm inline-block text-center min-w-[90px]">
        Cancelled
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="grow w-full max-w-5xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
        {/* Profile Card */}
        <div className="w-full bg-white shadow-sm hover:shadow-md transition-shadow rounded-3xl border border-slate-100 p-8 md:p-12 mb-12 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 relative overflow-hidden text-center sm:text-left">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-indigo-500 to-sky-400 flex items-center justify-center text-4xl sm:text-5xl font-black text-white shadow-lg border-4 border-white z-10 shrink-0">
            {profile?.first_name ? profile.first_name[0].toUpperCase() : "U"}
          </div>

          <div className="z-10 flex-1">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-2 leading-tight">
              {profile
                ? `${profile.first_name} ${profile.last_name}`
                : "Loading..."}
            </h2>
            {profile?.email && (
              <p className="text-slate-500 font-medium mb-4 flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base">
                <span className="text-lg">✉️</span> {profile.email}
              </p>
            )}
            <span className="px-4 py-1.5 bg-slate-800 text-white rounded-full text-sm font-bold tracking-wider uppercase shadow-sm inline-block">
              Role: {userRole}
            </span>
          </div>
        </div>

        <div className="w-full">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 px-2 text-center sm:text-left">
            My Registered Workshops
          </h3>

          {userRole === "admin" || userRole === "approver" ? (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-10 md:p-16 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-amber-800 mb-2">
                โหมดผู้ดูแลระบบ
              </h2>
              <p className="text-amber-600 font-medium text-sm sm:text-base">
                บัญชีของคุณไม่มีประวัติการลงทะเบียนเวิร์กชอปครับ
              </p>
            </div>
          ) : (
            <div className="w-full">
              {/* Empty State (ใช้ได้ทั้งมือถือและคอม) */}
              {myWorkshops.length === 0 ? (
                <div className="py-16 px-4 bg-white border border-slate-100 rounded-3xl text-center shadow-sm flex flex-col items-center">
                  <span className="text-5xl block mb-4 text-slate-300">📭</span>
                  <p className="text-lg md:text-xl font-bold text-slate-700 mb-2">
                    คุณยังไม่ได้ลงทะเบียน Workshop ใดๆ
                  </p>
                  <Link
                    to="/"
                    className="text-indigo-600 hover:text-indigo-800 font-bold underline underline-offset-4 mt-2"
                  >
                    ไปหาเวิร์กชอปที่น่าสนใจกันเถอะ!
                  </Link>
                </div>
              ) : (
                <>
                  {/* MOBILE VIEW (แสดงผลแบบการ์ด) */}
                  <div className="grid grid-cols-1 gap-4 md:hidden">
                    {myWorkshops.map((ws) => (
                      <div
                        key={ws.id}
                        className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 relative overflow-hidden"
                      >
                        <div
                          className={`absolute top-0 left-0 w-1.5 h-full ${ws.status === "Registered" ? "bg-emerald-400" : "bg-rose-400"}`}
                        ></div>

                        <div className="flex flex-col gap-2 pl-2">
                          <Link
                            to={`/workshop/${ws.id}`}
                            className="font-bold text-slate-800 hover:text-indigo-600 text-lg leading-snug transition-colors line-clamp-2"
                          >
                            {ws.name}
                          </Link>

                          <div className="flex justify-between items-center mt-2 border-t border-slate-50 pt-3">
                            <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                              <span>🗓️</span> {ws.date}
                            </span>
                            {getStatusBadge(ws.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* DESKTOP VIEW (แสดงผลแบบตาราง) */}
                  <div className="hidden md:block bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="table w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr className="text-slate-500 text-sm tracking-wider text-left">
                            <th className="font-bold py-4 pl-8 w-1/2">
                              Workshop Name
                            </th>
                            <th className="font-bold py-4 w-1/4">Date</th>
                            <th className="font-bold py-4 text-center w-1/4">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-slate-700">
                          {myWorkshops.map((ws) => (
                            <tr
                              key={ws.id}
                              className="hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-none"
                            >
                              <td className="pl-8 py-5">
                                <Link
                                  to={`/workshop/${ws.id}`}
                                  className="font-bold text-slate-800 hover:text-indigo-600 transition-colors line-clamp-1"
                                  title={`ดูรายละเอียด: ${ws.name}`}
                                >
                                  {ws.name}
                                </Link>
                              </td>
                              <td className="py-5 whitespace-nowrap text-sm font-medium text-slate-600">
                                {ws.date}
                              </td>
                              <td className="py-5 text-center">
                                {getStatusBadge(ws.status)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="h-16 bg-slate-100 mt-auto border-t border-slate-200"></footer>
    </div>
  );
}
