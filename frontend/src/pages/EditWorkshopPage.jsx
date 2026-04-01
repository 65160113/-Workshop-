// frontend/src/pages/EditWorkshopPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

export default function EditWorkshopPage() {
  const { id } = useParams(); // รับ ID จาก URL
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

  // ดึงข้อมูลเดิมมาใส่ฟอร์ม ตอนเปิดหน้าเว็บ
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // ยิง API 3 เส้นพร้อมกัน (เวิร์กชอป, หมวดหมู่, แพลตฟอร์ม)
        const [wsRes, catRes, platRes] = await Promise.all([
          axios.get(`${API_URL}/api/workshops/${id}`),
          axios.get(`${API_URL}/api/categories`),
          axios.get(`${API_URL}/api/platforms`),
        ]);

        const ws = wsRes.data;
        setCategories(catRes.data);
        setPlatforms(platRes.data);

        // เอาข้อมูลดิบ (raw) ที่อัปเดตจากหลังบ้านมาเซ็ตใส่ฟอร์ม
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

      // ยิง PUT ไปหา API แก้ไขที่เราทำไว้
      await axios.put(`${API_URL}/api/workshops/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("อัปเดตข้อมูล Workshop สำเร็จ!");
      navigate("/my-workshops"); // กลับไปหน้างานของฉัน
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "เกิดข้อผิดพลาดในการอัปเดต");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-sky-600"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />

      <main className="grow flex items-center justify-center p-4 py-12">
        <div className="card w-full max-w-2xl bg-sky-100 shadow-2xl border border-sky-200 p-8 rounded-2xl">
          <h1 className="text-center text-3xl font-bold text-sky-900 mb-8">
            แก้ไขข้อมูล Workshop
          </h1>

          {errorMsg && (
            <div className="alert alert-error text-sm p-3 rounded-lg mb-6">
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* แถวที่ 1: ชื่อ และ วันที่ */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="form-control w-full sm:w-2/3">
                <label className="label p-1">
                  <span className="label-text font-semibold text-sky-800">
                    ชื่อ Workshop *
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
              <div className="form-control w-full sm:w-1/3">
                <label className="label p-1">
                  <span className="label-text font-semibold text-sky-800">
                    วันที่จัดงาน *
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
            </div>

            {/* แถวที่ 2: เวลาเริ่ม และ เวลาจบ */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="form-control w-full sm:w-1/2">
                <label className="label p-1">
                  <span className="label-text font-semibold text-sky-800">
                    เวลาเริ่ม *
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
              <div className="form-control w-full sm:w-1/2">
                <label className="label p-1">
                  <span className="label-text font-semibold text-sky-800">
                    เวลาสิ้นสุด
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

            {/* แถวที่ 3: หมวดหมู่ และ แพลตฟอร์ม */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="form-control w-full sm:w-1/2">
                <label className="label p-1">
                  <span className="label-text font-semibold text-sky-800">
                    หมวดหมู่ *
                  </span>
                </label>
                <select
                  name="categoryId"
                  className="select select-bordered w-full bg-white border-sky-300 focus:border-sky-500"
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
              <div className="form-control w-full sm:w-1/2">
                <label className="label p-1">
                  <span className="label-text font-semibold text-sky-800">
                    รูปแบบ (Platform) *
                  </span>
                </label>
                <select
                  name="platformId"
                  className="select select-bordered w-full bg-white border-sky-300 focus:border-sky-500"
                  value={formData.platformId}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    -- เลือกรูปแบบ --
                  </option>
                  {platforms.map((plat) => (
                    <option key={plat.platform_id} value={plat.platform_id}>
                      {plat.platform_name || plat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* แถวที่ 4: สถานที่ และ วิทยากร */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="form-control w-full sm:w-1/2">
                <label className="label p-1">
                  <span className="label-text font-semibold text-sky-800">
                    สถานที่ / ลิงก์ *
                  </span>
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="เช่น ห้อง 301 หรือลิงก์ Zoom"
                  className="input input-bordered w-full bg-white border-sky-300 focus:border-sky-500"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-control w-full sm:w-1/2">
                <label className="label p-1">
                  <span className="label-text font-semibold text-sky-800">
                    วิทยากร (Speaker)
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
            </div>

            {/* แถวที่ 5: จำนวนที่นั่ง */}
            <div className="form-control w-full">
              <label className="label p-1">
                <span className="label-text font-semibold text-sky-800">
                  จำนวนที่นั่งสูงสุด *
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

            {/* แถวที่ 6: รายละเอียด */}
            <div className="form-control w-full">
              <label className="label p-1">
                <span className="label-text font-semibold text-sky-800">
                  รายละเอียดงาน
                </span>
              </label>
              <textarea
                name="description"
                className="textarea textarea-bordered w-full bg-white border-sky-300 focus:border-sky-500 h-24 text-base"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* ปุ่มบันทึก */}
            <div className="form-control mt-8">
              <button
                type="submit"
                className={`btn bg-sky-600 text-white hover:bg-sky-700 w-full rounded-full text-lg shadow-md border-none ${isSubmitting ? "loading" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="h-16 bg-sky-200 mt-auto"></footer>
    </div>
  );
}