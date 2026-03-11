// frontend/src/pages/CreateWorkshopPage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function CreateWorkshopPage() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    speaker: "",
    seats: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 1. ถ้าไม่ได้ Login เตะไปหน้า Login
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนครับ");
      navigate("/login");
      return;
    }

    try {
      // 2. ถอดรหัส Token สดๆ หน้าบ้าน
      const payload = JSON.parse(atob(token.split(".")[1]));

      // 3. เช็คยศ ถ้าไม่ใช่ admin และ organizer เตะกลับหน้าแรก
      if (payload.role !== "admin" && payload.role !== "organizer") {
        alert(
          "⛔ เฉพาะผู้จัดอบรมหรือแอดมินเท่านั้น ที่สามารถสร้าง Workshop ได้ครับ",
        );
        navigate("/");
      }
    } catch (error) {
      console.error("Token error:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        speaker: formData.speaker,
        seats: formData.seats,
        description: formData.description,
      };

      await axios.post("http://localhost:3000/api/workshops", payload);

      alert("🎉 สร้าง Workshop ใหม่สำเร็จเรียบร้อยครับ!");
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
            ➕ Create New Workshop
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
                    Location *
                  </span>
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="เช่น ห้อง IF-404"
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

            {/* 👇 แถว 5: รายละเอียด (ปรับเป็น textarea 5 บรรทัด) 👇 */}
            <div className="form-control w-full">
              <label className="label p-1">
                <span className="label-text font-semibold text-sky-800">
                  Description
                </span>
              </label>
              <textarea
                name="description"
                rows="5"
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
