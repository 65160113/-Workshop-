// frontend/src/pages/ManageUsersPage.jsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  //State สำหรับ Search และ Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole, userName) => {
    const isConfirm = window.confirm(
      `คุณแน่ใจหรือไม่ที่จะเปลี่ยนสิทธิ์ของ "${userName}" เป็น [ ${newRole.toUpperCase()} ] ?`,
    );
    if (!isConfirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_URL}/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert(`อัปเดตสิทธิ์ของ ${userName} เรียบร้อยแล้ว!`);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  const getRoleBadge = (role) => {
    const baseStyle =
      "px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm inline-block text-center min-w-[90px]";
    switch (role) {
      case "admin":
        return (
          <span
            className={`${baseStyle} bg-rose-100 text-rose-700 border border-rose-200`}
          >
            Admin
          </span>
        );
      case "approver":
        return (
          <span
            className={`${baseStyle} bg-emerald-100 text-emerald-700 border border-emerald-200`}
          >
            Approver
          </span>
        );
      case "organizer":
        return (
          <span
            className={`${baseStyle} bg-amber-100 text-amber-700 border border-amber-200`}
          >
            Organizer
          </span>
        );
      case "student":
        return (
          <span
            className={`${baseStyle} bg-slate-100 text-slate-600 border border-slate-200`}
          >
            Student
          </span>
        );
      default:
        return (
          <span
            className={`${baseStyle} bg-slate-100 text-slate-600 border border-slate-200`}
          >
            {role}
          </span>
        );
    }
  };

  // ฟังก์ชันตัวกรองข้อมูล (Real-time Filter)
  const filteredUsers = users.filter((u) => {
    const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
    const emailMatch = u.email.toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    // เช็คว่าคำค้นหาตรงกับชื่อ หรือ อีเมล ไหม
    const matchSearch =
      fullName.includes(searchLower) || emailMatch.includes(searchLower);

    // เช็คว่า Role ตรงกับที่ Filter ไว้ไหม (ถ้าไม่เลือกอะไรเลย ถือว่าผ่าน)
    const matchRole = selectedRole === "" || u.role === selectedRole;

    return matchSearch && matchRole;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <span className="loading loading-spinner loading-lg text-indigo-600"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />
      <main className="grow w-full max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition-colors group font-semibold text-sm"
          >
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">
              ←
            </span>{" "}
            กลับไปหน้า Dashboard
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                จัดการผู้ใช้งาน
              </h1>
              <p className="text-slate-500 mt-2 text-sm md:text-base font-medium">
                กำหนดและปรับเปลี่ยนสิทธิ์การเข้าถึงระบบของสมาชิกทั้งหมด
              </p>
            </div>
            <div className="bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm text-sm font-bold text-slate-600 shrink-0">
              พบ{" "}
              <span className="text-indigo-600 text-lg">
                {filteredUsers.length}
              </span>{" "}
              บัญชี
            </div>
          </div>
        </div>

        {/* Search & Filter Tools */}
        <div className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-col sm:flex-row gap-3 md:gap-4 z-10 relative">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="ค้นหาชื่อ, นามสกุล หรืออีเมล..."
              className="w-full pl-3 pr-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-700 font-medium rounded-xl transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-56 shrink-0 relative">
            <select
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-700 font-bold rounded-xl transition-all appearance-none cursor-pointer"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">ทุกสิทธิ์ (All Roles)</option>
              <option value="admin">Admin</option>
              <option value="approver">Approver</option>
              <option value="organizer">Organizer</option>
              <option value="student">Student</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
              ▼
            </div>
          </div>
        </div>

        <div className="w-full">
          {/* ถ้าค้นหาไม่เจอใครเลยให้โชว์ตรงนี้ */}
          {filteredUsers.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center px-4">
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
                ไม่พบผู้ใช้งาน
              </h3>
              <p className="text-slate-500 text-sm md:text-base">
                ลองเปลี่ยนคำค้นหา หรือล้างตัวกรองสิทธิ์ดูอีกครั้งนะครับ
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedRole("");
                }}
                className="mt-6 px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-colors"
              >
                ล้างการค้นหา
              </button>
            </div>
          ) : (
            <>
              {/* MOBILE VIEW (การ์ดรายบุคคล) */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 relative overflow-hidden"
                  >
                    <div
                      className={`absolute top-0 left-0 w-1.5 h-full ${
                        u.role === "admin"
                          ? "bg-rose-400"
                          : u.role === "approver"
                            ? "bg-emerald-400"
                            : u.role === "organizer"
                              ? "bg-amber-400"
                              : "bg-slate-300"
                      }`}
                    ></div>

                    <div className="flex justify-between items-start pl-2">
                      <div className="pr-2">
                        <p className="font-bold text-slate-800 text-lg leading-tight">
                          {u.first_name} {u.last_name}
                        </p>
                        <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1.5 truncate">
                          {u.email}
                        </p>
                      </div>
                      <div className="shrink-0">{getRoleBadge(u.role)}</div>
                    </div>

                    <div className="text-xs font-bold text-slate-400 mt-2 pl-2">
                      เข้าร่วมเมื่อ: {u.joined_date}
                    </div>

                    <div className="mt-3 pt-4 border-t border-slate-50 pl-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        เปลี่ยนสิทธิ์ผู้ใช้
                      </label>
                      <select
                        className="select select-bordered w-full bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-slate-700 font-bold"
                        value={u.role}
                        onChange={(e) =>
                          handleRoleChange(u.id, e.target.value, u.first_name)
                        }
                      >
                        <option value="student">STUDENT</option>
                        <option value="organizer">ORGANIZER</option>
                        <option value="approver">APPROVER</option>
                        <option value="admin">ADMIN</option>
                      </select>
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
                        <th className="font-bold py-4 pl-6 w-[25%]">
                          ชื่อ-นามสกุล
                        </th>
                        <th className="font-bold py-4 w-[25%]">อีเมล</th>
                        <th className="font-bold py-4 w-[15%] text-center">
                          วันที่เข้าร่วม
                        </th>
                        <th className="font-bold py-4 w-[15%] text-center">
                          สิทธิ์ปัจจุบัน
                        </th>
                        <th className="font-bold py-4 w-[20%] text-center">
                          จัดการเปลี่ยนสิทธิ์
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      {filteredUsers.map((u) => (
                        <tr
                          key={u.id}
                          className="hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-none"
                        >
                          <td className="pl-6 py-4 font-bold text-slate-800">
                            {u.first_name} {u.last_name}
                          </td>
                          <td className="py-4 text-slate-500">{u.email}</td>
                          <td className="py-4 text-center font-medium text-sm text-slate-400">
                            {u.joined_date}
                          </td>
                          <td className="py-4 text-center">
                            {getRoleBadge(u.role)}
                          </td>
                          <td className="py-4 flex justify-center">
                            <select
                              className="select select-sm select-bordered w-full max-w-[140px] bg-slate-50 hover:bg-white focus:bg-white focus:border-indigo-500 text-slate-700 font-bold transition-colors cursor-pointer"
                              value={u.role}
                              onChange={(e) =>
                                handleRoleChange(
                                  u.id,
                                  e.target.value,
                                  u.first_name,
                                )
                              }
                            >
                              <option value="student">STUDENT</option>
                              <option value="organizer">ORGANIZER</option>
                              <option value="approver">APPROVER</option>
                              <option value="admin">ADMIN</option>
                            </select>
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
      </main>

      <footer className="h-16 bg-slate-100 mt-auto border-t border-slate-200"></footer>
    </div>
  );
}