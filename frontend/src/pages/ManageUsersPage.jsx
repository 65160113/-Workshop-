// frontend/src/pages/ManageUsersPage.jsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_URL}/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("อัปเดตสิทธิ์เรียบร้อย!");
      fetchUsers(); // โหลดข้อมูลใหม่
    } catch (error) {
      alert(error.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  if (loading) return <div className="p-10 text-center">กำลังโหลด...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />
      <main className="grow p-4 py-12 flex flex-col items-center">
        <div className="w-full max-w-5xl">
          <button
            onClick={() => navigate("/admin")}
            className="btn btn-ghost mb-4"
          >
            ⬅️ กลับหน้า Dashboard
          </button>

          <h1 className="text-3xl font-bold text-sky-900 mb-8">
            จัดการผู้ใช้งาน
          </h1>

          <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-sky-100">
            <table className="table w-full">
              <thead className="bg-sky-800 text-white">
                <tr>
                  <th>ชื่อ-นามสกุล</th>
                  <th>อีเมล</th>
                  <th>วันที่เข้าร่วม</th>
                  <th>สิทธิ์ปัจจุบัน</th>
                  <th className="text-center">เปลี่ยนสิทธิ์</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-sky-50">
                    <td className="font-bold">
                      {u.first_name} {u.last_name}
                    </td>
                    <td>{u.email}</td>
                    <td>{u.joined_date}</td>
                    <td>
                      <span
                        className={`badge font-bold text-white shadow-sm border-none ${
                          u.role === "admin"
                            ? "bg-rose-500"
                            : u.role === "approver"
                              ? "bg-sky-500" 
                              : u.role === "organizer"
                                ? "bg-amber-500"
                                : "bg-slate-400"
                        }`}
                      >
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-center">
                      <select
                        className="select select-bordered select-sm w-full max-w-xs"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      >
                        <option value="user">STUDENT</option>
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
      </main>
    </div>
  );
}
