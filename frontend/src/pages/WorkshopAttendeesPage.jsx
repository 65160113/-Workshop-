import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

export default function WorkshopAttendeesPage() {
  const { id } = useParams();
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_URL}/api/workshops/${id}/attendees`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setAttendees(res.data);
      } catch (err) {
        console.error("Error fetching attendees:", err);
        alert("ไม่สามารถโหลดรายชื่อได้");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAttendees();
  }, [id]);

  // แปลงข้อมูลตารางเป็นไฟล์ CSV และโหลดลงเครื่อง (รองรับภาษาไทย)
  const handleExportCSV = () => {
    // 1. สร้างหัวตาราง
    const headers = ["ลำดับ,ชื่อ-นามสกุล,อีเมล,วันที่สมัคร"];

    // 2. แมพข้อมูลใส่แต่ละแถว
    const rows = attendees.map((user, index) => {
      const fullName = `${user.first_name} ${user.last_name}`;
      const date = new Date(user.registered_at).toLocaleDateString("th-TH");
      return `${index + 1},${fullName},${user.email},${date}`;
    });

    // 3. รวมหัวตารางและข้อมูลเข้าด้วยกัน (ใส่ \uFEFF ด้านหน้าเพื่อกันภาษาไทยเพี้ยนใน Excel)
    const csvContent = "\uFEFF" + headers.concat(rows).join("\n");

    // 4. สร้าง Blob และบังคับดาวน์โหลด
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `รายชื่อผู้สมัคร_workshop_${id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />
      <main className="grow container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-sky-900">
              รายชื่อผู้สมัคร
            </h1>
            <p className="text-gray-500 mt-2">
              จำนวนทั้งหมด: {attendees.length} คน
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/my-workshops" className="btn btn-outline">
              กลับ
            </Link>
            <button
              onClick={handleExportCSV}
              disabled={attendees.length === 0}
              className="btn bg-green-600 hover:bg-green-700 text-white border-none"
            >
              Export CSV
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <span className="loading loading-spinner loading-lg text-sky-600"></span>
          </div>
        ) : attendees.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border">
            <p className="text-gray-500">ยังไม่มีผู้สมัครในเวิร์กชอปนี้</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-sky-100">
            <table className="table w-full">
              <thead className="bg-sky-200 text-sky-900 text-base">
                <tr>
                  <th className="w-[10%]">ลำดับ</th>
                  <th className="w-[40%]">ชื่อ-นามสกุล</th>
                  <th className="w-[30%]">อีเมล</th>
                  <th className="w-[20%]">วันที่สมัคร</th>
                </tr>
              </thead>
              <tbody>
                {attendees.map((user, index) => (
                  <tr key={index} className="hover:bg-sky-50 transition-colors">
                    <td className="font-bold text-center">{index + 1}</td>
                    <td>
                      {user.first_name} {user.last_name}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      {new Date(user.registered_at).toLocaleDateString("th-TH")}
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
