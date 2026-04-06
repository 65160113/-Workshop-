// frontend/src/pages/CreateWorkshopPage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

export default function CreateWorkshopPage() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // สร้าง State มารับข้อมูล Dropdown จากหลังบ้าน
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

    // ฟังก์ชันวิ่งไปดูดข้อมูล Category กับ Platform มาทำ Dropdown
    const fetchMasterData = async () => {
      try {
        // ยิง API ไปหลังบ้านพร้อมกัน 2 เส้นเพื่อความไว!
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
      // หยิบ Token ออกมาก่อน
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

      // แนบ Token ไปกับ Headers ตอนยิง API ด้วย!
      await axios.post(
        `${API_URL}/api/workshops`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, // โชว์บัตร!
          },
        },
      );

      alert("สร้าง Workshop ใหม่สำเร็จเรียบร้อยครับ!");
      navigate("/");
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการสร้าง Workshop",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />

      <main className="grow flex items-center justify-center p-4 py-12">
        <div className="card w-full max-w-2xl bg-sky-100 shadow-2xl border border-sky-200 p-8 md:p-10 rounded-2xl">
          <h1 className="text-center text-3xl font-bold text-sky-900 mb-8 border-b-2 border-sky-200 pb-4">
            Create New Workshop
          </h1>

          {errorMsg && (
            <div className="alert alert-error text-sm p-3 rounded-lg mb-6">
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* แถว 1: ชื่อ Workshop */}
            <div className="form-control w-full">
              <label className="label p-1">
                <span className="label-text font-semibold text-sky-800">
                  Workshop Name *
                </span>
              </label>
              <input
                type="text"
                name="name"
                className="input input-bordered w-full bg-white border-sky-300 focus:border-sky-500"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* แถว 1.5: หมวดหมู่ (Category) และ แพลตฟอร์ม (Platform) */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="form-control w-full sm:w-1/2">
                <label className="label p-1">
                  <span className="label-text font-semibold text-sky-800">
                    Category *
                  </span>
                </label>
                <select
                  name="categoryId"
                  className="select select-bordered w-full bg-white border-sky-300 focus:border-sky-500 text-base"
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
              <div className="form-control w-full sm:w-1/2">
                <label className="label p-1">
                  <span className="label-text font-semibold text-sky-800">
                    Platform *
                  </span>
                </label>
                <select
                  name="platformId"
                  className="select select-bordered w-full bg-white border-sky-300 focus:border-sky-500 text-base"
                  value={formData.platformId}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    -- เลือกช่องทางจัดอบรม --
                  </option>
                  {platforms.map((plat) => (
                    <option key={plat.platform_id} value={plat.platform_id}>
                      {plat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* แถว 2: วันที่ และ เวลาเริ่ม-จบ */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="form-control w-full sm:w-1/3">
                <label className="label p-1">
                  <span className="label-text font-semibold text-sky-800">
                    Date *
                  </span>
                </label>
                <input
                  type="date"
                  name="date"
                  className="input input-bordered w-full bg-white border-sky-300 focus:border-sky-500"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-control w-full sm:w-1/3">
                <label className="label p-1">
                  <span className="label-text font-semibold text-sky-800">
                    Start Time *
                  </span>
                </label>
                <input
                  type="time"
                  name="startTime"
                  className="input input-bordered w-full bg-white border-sky-300 focus:border-sky-500"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-control w-full sm:w-1/3">
                <label className="label p-1">
                  <span className="label-text font-semibold text-sky-800">
                    End Time
                  </span>
                </label>
                <input
                  type="time"
                  name="endTime"
                  className="input input-bordered w-full bg-white border-sky-300 focus:border-sky-500"
                  value={formData.endTime}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* แถว 3: สถานที่ และ จำนวนที่นั่ง */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="form-control w-full sm:w-2/3">
                <label className="label p-1">
                  <span className="label-text font-semibold text-sky-800">
                    Location (Link / Room) *
                  </span>
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="เช่น ลิงก์ Google Meet หรือ ห้อง IF-404"
                  className="input input-bordered w-full bg-white border-sky-300 focus:border-sky-500"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-control w-full sm:w-1/3">
                <label className="label p-1">
                  <span className="label-text font-semibold text-sky-800">
                    Seats *
                  </span>
                </label>
                <input
                  type="number"
                  name="seats"
                  min="1"
                  className="input input-bordered w-full bg-white border-sky-300 focus:border-sky-500"
                  value={formData.seats}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* แถว 4: วิทยากร */}
            <div className="form-control w-full">
              <label className="label p-1">
                <span className="label-text font-semibold text-sky-800">
                  Speaker Name
                </span>
              </label>
              <input
                type="text"
                name="speaker"
                className="input input-bordered w-full bg-white border-sky-300 focus:border-sky-500"
                value={formData.speaker}
                onChange={handleChange}
              />
            </div>

            {/* แถว 5: รายละเอียด */}
            <div className="form-control w-full">
              <label className="label p-1">
                <span className="label-text font-semibold text-sky-800">
                  Description
                </span>
              </label>
              <textarea
                name="description"
                rows="4"
                className="textarea textarea-bordered w-full bg-white border-sky-300 focus:border-sky-500 text-base leading-relaxed"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* ปุ่มกดสร้าง */}
            <div className="form-control mt-8">
              <button
                type="submit"
                className={`btn bg-sky-600 text-white hover:bg-sky-700 w-full rounded-full text-lg shadow-md border-none ${isSubmitting ? "loading" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Workshop"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="h-16 bg-sky-200 mt-auto"></footer>
    </div>
  );
}
