// frontend/src/pages/LoginPage.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        username,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("role", res.data.user.role);

      navigate(from);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้",
      );
    }
  };

  const inputStyle =
    "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-slate-700 font-medium";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center z-0">
        <div className="absolute w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-3xl -top-32 -left-32"></div>
        <div className="absolute w-[400px] h-[400px] bg-sky-200/40 rounded-full blur-3xl bottom-10 -right-20"></div>
      </div>

      <div className="z-10 w-full">
        <Navbar />
      </div>

      {/* Main Content */}
      <main className="grow flex items-center justify-center p-4 z-10">
        {/* Login Card */}
        <div className="w-full max-w-md bg-white shadow-2xl shadow-indigo-100/50 border border-slate-100 p-8 md:p-10 rounded-3xl relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-sky-400"></div>

          <div className="text-center mb-8 mt-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              เข้าสู่ระบบเพื่อดำเนินการต่อ
            </p>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-4 rounded-2xl flex items-center gap-3 mb-6 font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 pl-1">
                Username
              </label>
              <input
                type="text"
                placeholder="กรอก username ของคุณ"
                className={inputStyle}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 pl-1">
                Password
              </label>
              <input
                type="password"
                placeholder="กรอกรหัสผ่าน"
                className={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-black text-white text-lg transition-all shadow-md bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 flex justify-center items-center gap-2"
              >
                Sign In <span>→</span>
              </button>
            </div>

            <div className="text-center mt-6 text-sm text-slate-500">
              ยังไม่มีบัญชีใช่ไหม?{" "}
              <Link
                to="/register"
                state={{ from: from }}
                className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors underline underline-offset-4"
              >
                สมัครสมาชิกเลย
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}