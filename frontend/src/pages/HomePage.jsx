import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function HomePage() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/workshops");
        setWorkshops(res.data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />

      {/* Main Content (ส่วนแสดง Workshop เหมือนเดิมเป๊ะ) */}
      <main className="grow flex flex-col items-center py-12 px-4">
        <h1 className="text-3xl font-bold text-sky-900 mb-10 text-center">
          Workshop Online Registration
        </h1>

        <div className="w-full max-w-4xl flex flex-col gap-8">
          {loading ? (
            <div className="text-center text-sky-700 text-xl">
              กำลังโหลดข้อมูล... ⏳
            </div>
          ) : workshops.length === 0 ? (
            <div className="text-center text-sky-700 text-xl">
              ยังไม่มี Workshop ในระบบตอนนี้ครับ 😅
            </div>
          ) : (
            workshops.map((ws) => (
              <div
                key={ws.id}
                className="card bg-sky-100 shadow-xl border border-sky-200 p-8 rounded-2xl flex flex-col"
              >
                <h2 className="text-2xl font-bold text-sky-900 mb-6">
                  {ws.name}
                </h2>
                <div className="text-sky-800 text-lg mb-8 space-y-2">
                  <p className="flex">
                    <span className="w-24 font-semibold">Location</span> :{" "}
                    {ws.location}
                  </p>
                  <p className="flex">
                    <span className="w-24 font-semibold">Date</span> : {ws.date}
                  </p>
                  <p className="flex">
                    <span className="w-24 font-semibold">Seats</span> :{" "}
                    {ws.seats}
                  </p>
                </div>
                <div className="w-full sm:w-48 mt-auto">
                  {/* เปลี่ยนจาก button ธรรมดา เป็น Link ไปหน้า detail */}
                  <Link
                    to={`/workshop/${ws.id}`}
                    className="btn bg-sky-600 text-white hover:bg-sky-700 w-full rounded-full text-lg border-none shadow-md"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <footer className="h-16 bg-sky-200 mt-auto"></footer>
    </div>
  );
}
