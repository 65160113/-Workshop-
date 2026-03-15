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
        const res = await axios.get(
          "https://workshop-api-5bm0.onrender.com/api/workshops",
        );
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
            workshops.map((ws) => {
              // 🌟 คำนวณที่นั่งคงเหลือ
              const enrolledCount = ws.enrolled_count || 0;
              const remainingSeats = ws.seats - enrolledCount;
              const isFull = remainingSeats <= 0;

              return (
                <div
                  key={ws.id}
                  // 🌟 เพิ่ม relative เพื่อให้ Badge เกาะติดมุมการ์ด
                  className="card bg-sky-100 shadow-xl border border-sky-200 p-8 rounded-2xl flex flex-col relative"
                >
                  {/* 👇 ป้าย Badge แปะมุมขวาบน 👇 */}
                  <div className="absolute top-6 right-6">
                    {isFull ? (
                      <span className="badge bg-red-500 text-white py-3 px-4 shadow-sm font-bold border-none">
                        เต็มแล้ว
                      </span>
                    ) : (
                      <span className="badge bg-cyan-500 text-white py-3 px-4 shadow-sm font-bold border-none">
                        ว่าง {remainingSeats} ที่
                      </span>
                    )}
                  </div>

                  {/* เพิ่ม pr-24 (padding-right) เพื่อไม่ให้ชื่อยาวๆ ไปทับ Badge */}
                  <h2 className="text-2xl font-bold text-sky-900 mb-6 pr-24">
                    {ws.name}
                  </h2>

                  <div className="text-sky-800 text-lg mb-8 space-y-2">
                    <p className="flex">
                      <span className="w-24 font-semibold">Location</span> :{" "}
                      {ws.location}
                    </p>
                    <p className="flex">
                      <span className="w-24 font-semibold">Date</span> :{" "}
                      {ws.date}
                    </p>
                    <p className="flex items-center">
                      <span className="w-24 font-semibold">Seats</span> :{" "}
                      {ws.seats}
                      <span className="text-sm text-sky-600 ml-2">
                        (มีคนจองแล้ว {enrolledCount} คน)
                      </span>
                    </p>
                  </div>

                  <div className="w-full sm:w-48 mt-auto">
                    <Link
                      to={`/workshop/${ws.id}`}
                      className={`btn w-full rounded-full text-lg border-none shadow-md ${
                        isFull
                          ? "bg-gray-400 text-white hover:bg-gray-500" // ถ้าเต็มเปลี่ยนปุ่มเป็นสีเทา (แต่ยังกดเข้าไปดูรายละเอียดได้)
                          : "bg-sky-600 text-white hover:bg-sky-700"
                      }`}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      <footer className="h-16 bg-sky-200 mt-auto"></footer>
    </div>
  );
}
