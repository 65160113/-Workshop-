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
      // เรียก API หลังบ้านเพื่อดึงเฉพาะงานของ "ฉัน"
      const res = await axios.get(
        `${API_URL}/api/workshops/my-workshops`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMyWorkshops(res.data);
    } catch (err) {
      console.error("Error fetching my workshops:", err);
      setError("ไม่สามารถโหลดข้อมูลงานของคุณได้");
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันตัวช่วยสำหรับแสดงป้ายสีสถานะ
  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="badge badge-success text-white gap-1">
            🟢 อนุมัติแล้ว
          </span>
        );
      case "pending":
        return (
          <span className="badge badge-warning text-white gap-1">
            🟡 รอตรวจสอบ
          </span>
        );
      case "rejected":
        return (
          <span className="badge badge-error text-white gap-1">
            🔴 ไม่อนุมัติ
          </span>
        );
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />

      <main className="grow container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-sky-900">
            งานเวิร์กชอปของฉัน
          </h1>
          <Link
            to="/create-workshop"
            className="btn bg-sky-600 hover:bg-sky-700 text-white border-none shadow-md"
          >
            สร้างงานใหม่
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg text-sky-600"></span>
          </div>
        ) : error ? (
          <div className="alert alert-error shadow-lg">
            <span>{error}</span>
          </div>
        ) : myWorkshops.length === 0 ? (
          <div className="text-center py-16 bg-sky-50 rounded-2xl border border-sky-100">
            <p className="text-xl text-sky-800 mb-4">
              คุณยังไม่เคยสร้างเวิร์กชอปเลยครับ
            </p>
            <Link
              to="/create-workshop"
              className="text-sky-600 underline hover:text-sky-800 font-semibold"
            >
              เริ่มสร้างเวิร์กชอปแรกของคุณคลิกที่นี่เลย!
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-sky-100">
            <table className="table w-full">
              <thead className="bg-sky-200 text-sky-900 text-base">
                <tr>
                  <th>ชื่องาน</th>
                  <th>วันที่จัดงาน</th>
                  <th>สถานที่</th>
                  <th>สถานะ</th>
                  <th className="text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {myWorkshops.map((ws) => (
                  <tr key={ws.id} className="hover:bg-sky-50 transition-colors">
                    <td className="font-bold text-sky-900">{ws.name}</td>
                    <td>{ws.date}</td>
                    <td>{ws.location}</td>
                    <td>{getStatusBadge(ws.status)}</td>
                    <td className="text-center">
                      <Link
                        to={`/workshop/${ws.id}`}
                        className="btn btn-sm btn-outline btn-info"
                      >
                        ดูรายละเอียด
                      </Link>
                      <Link
                        to={`/edit-workshop/${ws.id}`}
                        className="btn btn-sm btn-outline btn-warning"
                      >
                        แก้ไข
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
