import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

export default function HomePage() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]); // เก็บรายชื่อหมวดหมู่ทำ Dropdown

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const [wsRes, catRes] = await Promise.all([
          axios.get(`${API_URL}/api/workshops`),
          axios.get(`${API_URL}/api/categories`),
        ]);
        setWorkshops(wsRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, []);

  // ลอจิกการกรองข้อมูล (Filter)
  const filteredWorkshops = workshops.filter((ws) => {
    // กรองชื่อ (พิมพ์ตัวเล็กตัวใหญ่ก็เจอ เพราะจับแปลงเป็น toLowerCase หมด)
    const matchSearch = ws.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // กรองหมวดหมู่ (ถ้าไม่ได้เลือกหมวดหมู่ ก็ให้ผ่านหมด)
    const matchCategory =
      selectedCategory === "" ||
      ws.category_id?.toString() === selectedCategory;

    return matchSearch && matchCategory;
  });

  console.log("แอบดูข้อมูล Workshop ตัวแรก:", workshops[0]);

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />

      <main className="grow flex flex-col items-center py-12 px-4">
        <h1 className="text-3xl font-bold text-sky-900 mb-10 text-center">
          Workshop Online Registration
        </h1>

        {/* โซนค้นหาและกรองข้อมูล (Search & Filter Bar) */}
        <div className="w-full max-w-4xl bg-white p-6 rounded-2xl shadow-md border border-sky-100 mb-10 flex flex-col md:flex-row gap-4">
          <div className="flex-1 form-control">
            <input
              type="text"
              placeholder="ค้นหาชื่อ Workshop..."
              className="input input-bordered w-full bg-sky-50 border-sky-200 focus:border-sky-500 text-sky-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="md:w-1/3 form-control">
            <select
              className="select select-bordered w-full bg-sky-50 border-sky-200 focus:border-sky-500 text-sky-900 font-medium"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">ทุกหมวดหมู่</option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full max-w-4xl flex flex-col gap-8">
          {loading ? (
            <div className="text-center text-sky-700 text-xl">
              กำลังโหลดข้อมูล... 
            </div>
          ) : filteredWorkshops.length === 0 ? (
            <div className="text-center text-sky-700 text-xl">
              ยังไม่มี Workshop ในระบบตอนนี้ครับ 
            </div>
          ) : (
            filteredWorkshops.map((ws) => {
              // คำนวณที่นั่งคงเหลือ
              const enrolledCount = ws.enrolled_count || 0;
              const remainingSeats = ws.seats - enrolledCount;
              const isFull = remainingSeats <= 0;

              return (
                <div
                  key={ws.id}
                  // เพิ่ม relative เพื่อให้ Badge เกาะติดมุมการ์ด
                  className="card bg-sky-100 shadow-xl border border-sky-200 p-8 rounded-2xl flex flex-col relative"
                >
                  {/* ป้าย Badge แปะมุมขวาบน */}
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
