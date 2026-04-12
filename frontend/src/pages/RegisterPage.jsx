// frontend/src/pages/RegisterPage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import PropTypes from "prop-types";

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
        const res = await axios.get(`${API_URL}/api/faculties`);
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

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg(
        "รหัสผ่าน และ ยืนยันรหัสผ่าน ไม่ตรงกันครับ กรุณาตรวจสอบอีกครั้ง",
      );
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        facultyId: formData.facultyId,
        role: "student",
      });

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

  const FormLabel = ({ text, required }) => (
    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 pl-1">
      {text} {required && <span className="text-rose-500">*</span>}
    </label>
  );

  FormLabel.propTypes = {
    text: PropTypes.string.isRequired,
    required: PropTypes.bool,
  };

  const inputStyle =
    "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-700 font-medium";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center z-0">
        <div className="absolute w-[600px] h-[600px] bg-sky-200/40 rounded-full blur-3xl -top-40 -left-40"></div>
        <div className="absolute w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-3xl bottom-0 -right-20"></div>
      </div>

      <div className="z-10 w-full">
        <Navbar />
      </div>

      <main className="grow flex items-center justify-center p-4 py-12 z-10">
        <div className="w-full max-w-xl bg-white shadow-2xl shadow-indigo-100/50 border border-slate-100 p-8 md:p-12 rounded-3xl relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-sky-400"></div>

          <div className="text-center mb-8 mt-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Create an Account
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              สมัครสมาชิกเพื่อเริ่มต้นลงทะเบียนเวิร์กชอป
            </p>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-4 rounded-2xl flex items-center gap-3 mb-8 font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ข้อมูลส่วนตัว */}
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="w-full sm:w-1/2">
                <FormLabel text="First Name" required />
                <input
                  type="text"
                  name="firstName"
                  placeholder="ชื่อจริง"
                  className={inputStyle}
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="w-full sm:w-1/2">
                <FormLabel text="Last Name" required />
                <input
                  type="text"
                  name="lastName"
                  placeholder="นามสกุล"
                  className={inputStyle}
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="w-full">
              <FormLabel text="Faculty" required />
              <select
                name="facultyId"
                className={inputStyle}
                value={formData.facultyId}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  -- โปรดเลือกคณะที่กำลังศึกษา --
                </option>
                {faculties.map((fac) => (
                  <option key={fac.faculty_id} value={fac.faculty_id}>
                    {fac.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="divider my-6 text-slate-300 text-sm font-semibold uppercase tracking-widest">
              Account Details
            </div>

            {/* ข้อมูลเข้าสู่ระบบ */}
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="w-full sm:w-1/2">
                <FormLabel text="Email" required />
                <input
                  type="email"
                  name="email"
                  placeholder="example@buu.ac.th"
                  className={inputStyle}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="w-full sm:w-1/2">
                <FormLabel text="Username" required />
                <input
                  type="text"
                  name="username"
                  placeholder="ตั้งชื่อผู้ใช้งาน"
                  className={inputStyle}
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <div className="w-full sm:w-1/2">
                <FormLabel text="Password" required />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  minLength="6"
                  required
                  className={inputStyle}
                />
              </div>
              <div className="w-full sm:w-1/2">
                <FormLabel text="Confirm Password" required />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                  className={inputStyle}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* ปุ่มกดสมัคร */}
            <div className="pt-6">
              <button
                type="submit"
                className={`w-full py-4 rounded-xl font-black text-white text-lg transition-all shadow-md flex justify-center items-center gap-2 ${
                  isSubmitting
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>{" "}
                    กำลังสร้างบัญชี...
                  </>
                ) : (
                  "สมัครสมาชิก"
                )}
              </button>
            </div>

            <div className="text-center mt-6 text-sm text-slate-500">
              มีบัญชีอยู่แล้วใช่ไหม?{" "}
              <Link
                to="/login"
                state={{ from: from }}
                className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors underline underline-offset-4"
              >
                เข้าสู่ระบบเลย
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
