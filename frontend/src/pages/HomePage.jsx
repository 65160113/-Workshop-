// frontend/src/pages/HomePage.jsx
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
  const [categories, setCategories] = useState([]);

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

  const filteredWorkshops = workshops.filter((ws) => {
    const matchSearch = ws.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategory === "" ||
      ws.category_id?.toString() === selectedCategory;
    return matchSearch && matchCategory;
  });

  const getCoverImage = (categoryId) => {
    const images = {
      1: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80",
      2: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
      3: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
      default:
        "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80",
    };
    return images[categoryId] || images.default;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      {/* Hero Section: ปรับ Padding มือถือไม่ให้กว้างไป */}
      <div className="bg-gradient-to-r from-sky-800 to-indigo-900 pt-12 pb-20 md:pt-16 md:pb-28 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 md:mb-4 tracking-tight leading-tight">
          Discover Your Next Skill
        </h1>
        <p className="text-sky-200 text-base md:text-lg max-w-3xl mx-auto px-2">
          ระบบลงทะเบียนเข้าร่วมเวิร์กชอปออนไลน์ ค้นหาและอัปสกิลใหม่ๆ
          เพื่อเตรียมพร้อมสำหรับอนาคต
        </p>
      </div>

      <main className="grow flex flex-col items-center px-4 md:px-8 w-full">
        {/* Floating Search & Filter */}
        <div className="w-full max-w-5xl bg-white p-4 md:p-5 rounded-2xl shadow-lg border border-slate-100 -mt-8 md:-mt-14 mb-8 md:mb-12 flex flex-col sm:flex-row gap-3 md:gap-4 z-10 relative">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="ค้นหาชื่อ Workshop ที่สนใจ..."
              className="input w-full bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-800 px-4 py-3 rounded-xl h-auto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-48 lg:w-56 form-control shrink-0">
            <select
              className="select w-full bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-700 rounded-xl font-medium h-auto py-3"
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

        {/* Content Area */}
        <div className="w-full max-w-7xl mb-12 md:mb-16">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <span className="loading loading-spinner loading-lg text-indigo-600"></span>
            </div>
          ) : filteredWorkshops.length === 0 ? (
            <div className="text-center bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 mx-2 md:mx-0">
              <span className="text-4xl block mb-4">📭</span>
              <h3 className="text-lg md:text-xl font-bold text-slate-700">
                ไม่พบ Workshop ที่ค้นหา
              </h3>
              <p className="text-slate-500 mt-2 text-sm md:text-base">
                ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่ใหม่ดูนะครับ
              </p>
            </div>
          ) : (
            /* Card Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredWorkshops.map((ws) => {
                const enrolledCount = ws.enrolled_count || 0;
                const remainingSeats = ws.seats - enrolledCount;
                const isFull = remainingSeats <= 0;

                return (
                  <div
                    key={ws.id}
                    className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group overflow-hidden"
                  >
                    <div className="h-40 md:h-48 relative overflow-hidden bg-slate-200 shrink-0">
                      <img
                        src={getCoverImage(ws.category_id)}
                        alt={ws.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 md:top-4 md:right-4">
                        {isFull ? (
                          <span className="px-3 py-1 bg-rose-500 text-white rounded-full text-[10px] md:text-xs font-bold uppercase shadow-md border border-rose-600">
                            Sold Out
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-[10px] md:text-xs font-bold uppercase shadow-md border border-emerald-600">
                            {remainingSeats} Seats Left
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5 md:p-6 grow flex flex-col">
                      <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-4 line-clamp-2 min-h-[3.5rem] group-hover:text-indigo-600 transition-colors leading-snug">
                        {ws.name}
                      </h2>

                      <div className="text-slate-500 text-sm space-y-2.5 mb-6 md:mb-8">
                        <div className="flex items-start gap-2.5">
                          <span className="text-base md:text-lg leading-none mt-0.5">
                            📍
                          </span>
                          <span className="leading-tight">{ws.location}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-base md:text-lg leading-none">
                            🗓️
                          </span>
                          <span>{ws.date}</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="text-base md:text-lg leading-none mt-0.5">
                            👥
                          </span>
                          <span className="leading-tight">
                            จำกัด {ws.seats} ที่นั่ง{" "}
                            <br className="sm:hidden" />
                            <span className="text-slate-400 text-xs sm:ml-1 inline-block mt-1 sm:mt-0">
                              (จองแล้ว {enrolledCount})
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <Link
                          to={`/workshop/${ws.id}`}
                          className={`flex justify-center items-center w-full py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${
                            isFull
                              ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                          }`}
                        >
                          {isFull ? "ดูรายละเอียด" : "สมัครเข้าร่วมเลย"}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <footer className="h-16 bg-slate-100 mt-auto border-t border-slate-200"></footer>
    </div>
  );
}
