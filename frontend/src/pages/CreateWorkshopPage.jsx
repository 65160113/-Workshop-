// frontend/src/pages/CreateWorkshopPage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import PropTypes from "prop-types";

const API_URL = import.meta.env.VITE_API_URL;

export default function CreateWorkshopPage() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categories, setCategories] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    platformId: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    speaker: "",
    seats: "",
    description: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนครับ");
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role !== "admin" && payload.role !== "organizer") {
        alert(
          "เฉพาะผู้จัดอบรมหรือแอดมินเท่านั้น ที่สามารถสร้าง Workshop ได้ครับ",
        );
        navigate("/");
        return;
      }
    } catch (error) {
      console.error("Token error:", error);
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    const fetchMasterData = async () => {
      try {
        const [catRes, platRes] = await Promise.all([
          axios.get(`${API_URL}/api/categories`),
          axios.get(`${API_URL}/api/platforms`),
        ]);
        setCategories(catRes.data);
        setPlatforms(platRes.data);
      } catch (error) {
        console.error("โหลดข้อมูล Master Data ไม่สำเร็จ:", error);
      }
    };

    fetchMasterData();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("กรุณาเข้าสู่ระบบก่อนครับ");
        navigate("/login");
        return;
      }

      const payload = {
        name: formData.name,
        categoryId: formData.categoryId,
        platformId: formData.platformId,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime, 
        location: formData.location,
        speaker: formData.speaker,
        seats: formData.seats,
        description: formData.description,
      };

      await axios.post(`${API_URL}/api/workshops`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("🎉 สร้าง Workshop ใหม่สำเร็จเรียบร้อยครับ!");
      navigate("/my-workshops");
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการสร้าง Workshop",
      );
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

  // คลาสรวมสำหรับ Input เพื่อให้แก้ที่เดียวเปลี่ยนทั้งหมด 
  const inputStyle =
    "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-700 font-medium";

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans">
      <Navbar />

      <main className="grow w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
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
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-sky-400"></div>

          <div className="mb-10 border-b border-slate-100 pb-6 mt-2">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Create New Workshop
            </h1>
            <p className="text-slate-500 mt-2">
              กรอกข้อมูลรายละเอียดเพื่อเปิดรับลงทะเบียนเวิร์กชอปของคุณ
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
                  placeholder="เช่น สร้างเว็บแอปด้วย React 101"
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
                        {cat.name}
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
                        {plat.name}
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
                  placeholder="เช่น ลิงก์ Google Meet หรือ ห้อง IF-404"
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
                  placeholder="จำนวนผู้เข้าร่วม"
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
                placeholder="ชื่อวิทยากร (ปล่อยว่างได้ ถ้ายืนยันแล้วค่อยมาแก้)"
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
                placeholder="อธิบายสิ่งที่จะได้เรียนรู้ หรือกำหนดการคร่าวๆ..."
                className={`${inputStyle} resize-none`}
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* ปุ่มกดสร้าง */}
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
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>{" "}
                    กำลังบันทึก...
                  </>
                ) : (
                  "Create Workshop"
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