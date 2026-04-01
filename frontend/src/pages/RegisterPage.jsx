// frontend/src/pages/RegisterPage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "", 
    email: "",
    firstName: "",
    lastName: "",
    facultyId: "",
  });

  const [faculties, setFaculties] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/faculties`,
        );
        setFaculties(res.data);
      } catch (error) {
        console.error("โหลดข้อมูลคณะไม่สำเร็จ:", error);
      }
    };
    fetchFaculties();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    // ด่านตรวจเช็ค: รหัสผ่านตรงกันไหม?
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg(
        "รหัสผ่าน และ ยืนยันรหัสผ่าน ไม่ตรงกันครับ กรุณาตรวจสอบอีกครั้ง",
      );
      setIsSubmitting(false); // ปลดล็อคปุ่ม
      return; // สั่งเบรก! ไม่ต้องยิง API ไปหลังบ้าน
    }

    try {
      await axios.post(
        `${API_URL}/api/auth/register`,
        {
          username: formData.username,
          password: formData.password, 
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          facultyId: formData.facultyId,
          role: "student",
        },
      );

      alert("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบครับ");
      navigate("/login", { state: { from: from } });
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />

      <main className="grow flex items-center justify-center p-4 py-12">
        <div className="card w-full max-w-lg bg-sky-100 shadow-2xl border border-sky-200 p-8 rounded-2xl">
          <h1 className="text-center text-3xl font-bold text-sky-900 mb-8">
            Register
          </h1>

          {errorMsg && (
            <div className="alert alert-error text-sm p-3 rounded-lg mb-4">
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* แถวที่ 1: ชื่อ - นามสกุล */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="form-control w-full sm:w-1/2">
                <label className="label p-1">
                  <span className="label-text font-semibold text-sky-800">
                    ชื่อ *
                  </span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  className="input input-bordered w-full bg-white border-sky-300 focus:border-sky-500"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-control w-full sm:w-1/2">
                <label className="label p-1">
                  <span className="label-text font-semibold text-sky-800">
                    นามสกุล *
                  </span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  className="input input-bordered w-full bg-white border-sky-300 focus:border-sky-500"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* แถวที่ 2: คณะที่ศึกษา */}
            <div className="form-control w-full">
              <label className="label p-1">
                <span className="label-text font-semibold text-sky-800">
                  คณะที่ศึกษา *
                </span>
              </label>
              <select
                name="facultyId"
                className="select select-bordered w-full bg-white border-sky-300 focus:border-sky-500 text-base"
                value={formData.facultyId}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  -- โปรดเลือกคณะ --
                </option>
                {faculties.map((fac) => (
                  <option key={fac.faculty_id} value={fac.faculty_id}>
                    {fac.name}
                  </option>
                ))}
              </select>
            </div>

            {/* แถวที่ 3: Email และ Username */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="form-control w-full sm:w-1/2">
                <label className="label p-1">
                  <span className="label-text font-semibold text-sky-800">
                    Email *
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@email.com"
                  className="input input-bordered w-full bg-white border-sky-300 focus:border-sky-500"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-control w-full sm:w-1/2">
                <label className="label p-1">
                  <span className="label-text font-semibold text-sky-800">
                    Username *
                  </span>
                </label>
                <input
                  type="text"
                  name="username"
                  className="input input-bordered w-full bg-white border-sky-300 focus:border-sky-500"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* แถวที่ 4: Password และ Confirm Password คู่กันเลย */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="form-control w-full sm:w-1/2">
                <label className="label p-1">
                  <span className="label-text font-semibold text-sky-800">
                    Password *
                  </span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="ตั้งรหัสผ่าน"
                  className="input input-bordered w-full bg-white border-sky-300 focus:border-sky-500"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-control w-full sm:w-1/2">
                <label className="label p-1">
                  <span className="label-text font-semibold text-sky-800">
                    Confirm Password *
                  </span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                  className="input input-bordered w-full bg-white border-sky-300 focus:border-sky-500"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* ปุ่มกดสมัคร */}
            <div className="form-control mt-8">
              <button
                type="submit"
                className={`btn bg-sky-600 text-white hover:bg-sky-700 w-full rounded-full text-lg shadow-md border-none ${isSubmitting ? "loading" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "กำลังสมัคร..." : "สมัครสมาชิก"}
              </button>
            </div>

            <div className="text-center mt-4 text-sm text-sky-800">
              มีบัญชีอยู่แล้วใช่ไหม?{" "}
              <Link
                to="/login"
                state={{ from: from }}
                className="text-sky-600 font-bold hover:text-sky-800 transition underline"
              >
                เข้าสู่ระบบเลย
              </Link>
            </div>
          </form>
        </div>
      </main>

      <footer className="h-16 bg-sky-200 mt-auto"></footer>
    </div>
  );
}
