// frontend/src/pages/EditWorkshopPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import PropTypes from "prop-types";

const API_URL = import.meta.env.VITE_API_URL;

export default function EditWorkshopPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    speaker: "",
    seats: "",
    description: "",
    categoryId: "",
    platformId: "",
  });

  const [categories, setCategories] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const [wsRes, catRes, platRes] = await Promise.all([
          axios.get(`${API_URL}/api/workshops/${id}`),
          axios.get(`${API_URL}/api/categories`),
          axios.get(`${API_URL}/api/platforms`),
        ]);

        const ws = wsRes.data;
        setCategories(catRes.data);
        setPlatforms(platRes.data);

        setFormData({
          name: ws.name || "",
          date: ws.raw_date || "",
          startTime: ws.raw_start_time || "",
          endTime: ws.raw_end_time || "",
          location: ws.location || "",
          speaker: ws.speaker || "",
          seats: ws.seats || "",
          description: ws.description || "",
          categoryId: ws.category_id || "",
          platformId: ws.platform_id || "",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMsg("ดึงข้อมูลไม่สำเร็จ หรือคุณไม่มีสิทธิ์เข้าถึง");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const token = localStorage.getItem("token");

      await axios.put(`${API_URL}/api/workshops/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("🎉 อัปเดตข้อมูล Workshop สำเร็จ!");
      navigate("/my-workshops");
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "เกิดข้อผิดพลาดในการอัปเดต");
    } finally {
      setIsSubmitting(false);
    }
  };

  const FormLabel = ({ text, required }) => (
    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 pl-1">
      {text} {required && <span className="text-rose-500">*</span>}
    </label>
  );

  FormLabel.propTypes = {
    text: PropTypes.string.isRequired, 
    required: PropTypes.bool, 
  };

  // คลาสรวมสำหรับ Input 
  const inputStyle =
    "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-700 font-medium";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <span className="loading loading-spinner loading-lg text-indigo-600"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      <Navbar />

      <main className="grow w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* ปุ่มย้อนกลับ */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition-colors group w-fit font-semibold"
        >
          <span className="mr-2 group-hover:-translate-x-1 transition-transform">
            ←
          </span>{" "}
          กลับ
        </button>

        {/* ตัวการ์ดหลัก */}
        <div className="bg-white shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-200 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 to-orange-400"></div>

          <div className="mb-10 border-b border-slate-100 pb-6 mt-2">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Edit Workshop
            </h1>
            <p className="text-slate-500 mt-2">
              แก้ไขข้อมูลรายละเอียดเวิร์กชอปของคุณ
            </p>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl flex items-center gap-3 mb-8 font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ข้อมูลพื้นฐาน */}
            <div className="space-y-5 bg-indigo-50/40 p-6 rounded-2xl border border-indigo-100/50">
              <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                ข้อมูลทั่วไป
              </h3>

              <div className="w-full">
                <FormLabel text="Workshop Name" required />
                <input
                  type="text"
                  name="name"
                  className={inputStyle}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <FormLabel text="Category" required />
                  <select
                    name="categoryId"
                    className={inputStyle}
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      -- เลือกหมวดหมู่ --
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.category_name || cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <FormLabel text="Platform" required />
                  <select
                    name="platformId"
                    className={inputStyle}
                    value={formData.platformId}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      -- เลือกช่องทาง --
                    </option>
                    {platforms.map((plat) => (
                      <option key={plat.platform_id} value={plat.platform_id}>
                        {plat.platform_name || plat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* วันและเวลา */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <FormLabel text="Date" required />
                <input
                  type="date"
                  name="date"
                  className={inputStyle}
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <FormLabel text="Start Time" required />
                <input
                  type="time"
                  name="startTime"
                  className={inputStyle}
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <FormLabel text="End Time" required />
                <input
                  type="time"
                  name="endTime"
                  className={inputStyle}
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* สถานที่และผู้บรรยาย */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-8">
                <FormLabel text="Location (Link / Room)" required />
                <input
                  type="text"
                  name="location"
                  placeholder="เช่น ห้อง 301 หรือลิงก์ Zoom"
                  className={inputStyle}
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="md:col-span-4">
                <FormLabel text="Total Seats" required />
                <input
                  type="number"
                  name="seats"
                  min="1"
                  className={inputStyle}
                  value={formData.seats}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <FormLabel text="Speaker Name" />
              <input
                type="text"
                name="speaker"
                className={inputStyle}
                value={formData.speaker}
                onChange={handleChange}
              />
            </div>

            {/* รายละเอียด */}
            <div>
              <FormLabel text="Description" />
              <textarea
                name="description"
                rows="4"
                className={`${inputStyle} resize-none`}
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* ปุ่มกดบันทึกการแก้ไข */}
            <div className="pt-8 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-4">
              <Link
                to="/my-workshops"
                className="px-6 py-3.5 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors text-center flex items-center justify-center"
              >
                ยกเลิก
              </Link>
              <button
                type="submit"
                className={`px-8 py-3.5 rounded-xl font-black text-white text-lg transition-all shadow-md sm:w-auto w-full flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? "bg-amber-400 cursor-not-allowed"
                    : "bg-amber-500 hover:bg-amber-600 hover:shadow-lg hover:-translate-y-0.5"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>{" "}
                    กำลังบันทึก...
                  </>
                ) : (
                  "บันทึกการแก้ไข"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="h-16 bg-slate-200 mt-auto border-t border-slate-300/50"></footer>
    </div>
  );
}