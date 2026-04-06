// frontend/src/pages/MyAccountPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

export default function MyAccountPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [myWorkshops, setMyWorkshops] = useState([]);

  // เพิ่ม State สำหรับ Profile
  const [profile, setProfile] = useState(null);

  // ดึง Role จากกระเป๋า
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
          const profileRes = await axios.get(
            `${API_URL}/api/auth/me`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          setProfile(profileRes.data);
        } catch (err) {
          console.log("Profile API status:", err.message);
        }

        // ดึงข้อมูลตั๋ว (ดึงเฉพาะคนที่ "ไม่ใช่" แอดมิน)
        if (userRole !== "admin" && userRole !== "approver") {
          const res = await axios.get(
            `${API_URL}/api/enrollments/my-workshops`, 
            { headers: { Authorization: `Bearer ${token}` } },
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

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />

      <main className="grow flex flex-col items-center py-12 px-4">
        {/* โซนที่ 1: Profile Card */}
        <div className="w-full max-w-4xl bg-white shadow-md rounded-2xl border border-sky-100 p-8 mb-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="avatar placeholder">
            <div className="bg-sky-200 text-sky-800 rounded-full w-24 h-24 flex items-center justify-center text-4xl font-bold border-4 border-white shadow-sm">
              {profile?.first_name ? profile.first_name[0].toUpperCase() : "U"}
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold text-sky-900 mb-2">
              {profile
                ? `${profile.first_name} ${profile.last_name}`
                : "My Profile"}
            </h2>
            {profile?.email && (
              <p className="text-gray-600 font-medium mb-3">
                ✉️ {profile.email}
              </p>
            )}
            <span className="badge badge-info text-white font-semibold px-4 py-3 uppercase text-sm shadow-sm">
              Role: {userRole}
            </span>
          </div>
        </div>

        {/* โซนที่ 2: ตั๋วและตาราง */}
        <div className="w-full max-w-4xl flex justify-start mb-6">
          <h1 className="text-2xl font-bold text-sky-900">
            My Registered Workshops
          </h1>
        </div>

        {userRole === "admin" || userRole === "approver" ? (
          // ถ้าเป็น Admin ให้โชว์กล่องข้อความนี้แทนตาราง
          <div className="w-full max-w-4xl text-center py-12 bg-sky-50 rounded-2xl border border-sky-100">
            <h2 className="text-2xl font-bold text-amber-600 mb-2">
              โหมดผู้ดูแลระบบ
            </h2>
            <p className="text-sky-700 text-lg font-medium">
              บัญชีของคุณไม่มีประวัติการลงทะเบียนเวิร์กชอปครับ
            </p>
          </div>
        ) : (
          // ถ้าไม่ใช่ Admin ให้โชว์ตารางเดิม!
          <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl overflow-hidden border border-sky-200">
            <div className="overflow-x-auto">
              <table className="table w-full text-center text-lg">
                <thead className="bg-sky-300 text-sky-900 text-lg">
                  <tr>
                    <th className="py-4 font-bold border-r border-sky-200">
                      Workshop name
                    </th>
                    <th className="py-4 font-bold border-r border-sky-200">
                      Date
                    </th>
                    <th className="py-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sky-800">
                  {myWorkshops.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="py-12 text-center text-gray-500 bg-sky-50/30"
                      >
                        คุณยังไม่ได้ลงทะเบียน Workshop ใดๆ ครับ
                      </td>
                    </tr>
                  ) : (
                    myWorkshops.map((ws, index) => (
                      <tr
                        key={ws.id}
                        onClick={() => navigate(`/workshop/${ws.id}`)}
                        className={`cursor-pointer transition-colors ${
                          index % 2 === 0
                            ? "bg-sky-50/60 hover:bg-sky-200" // เข้มขึ้นนิดนึงตอน Hover ให้รู้ว่ากดได้
                            : "bg-white hover:bg-sky-100"
                        }`}
                      >
                        <td className="py-4 border-r border-sky-100 font-medium text-sky-700 underline-offset-4 hover:underline">
                          {ws.name}
                        </td>
                        <td className="py-4 border-r border-sky-100">
                          {ws.date}
                        </td>
                        <td
                          className={`py-4 font-bold ${ws.status === "Registered" ? "text-green-600" : "text-red-500"}`}
                        >
                          {ws.status}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <footer className="h-16 bg-sky-200 mt-auto"></footer>
    </div>
  );
}
