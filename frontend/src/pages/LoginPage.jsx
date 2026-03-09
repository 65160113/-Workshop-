// frontend/src/pages/LoginPage.jsx
import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      // ยิง API ไปที่ Backend ที่เราทำสำเร็จแล้ว
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        username, // ปรับให้ส่ง username ตามแบบ backend
        password,
      });

      // ถ้าสำเร็จ เก็บ Token
      const token = res.data.token;
      localStorage.setItem("token", token);

      alert("🎉 เข้าสู่ระบบสำเร็จ!");
    } catch (err) {
      // แสดง Error จาก Backend หรือข้อความเริ่มต้น
      setErrorMsg(
        err.response?.data?.message || "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้",
      );
    }
  };

  return (
    // จัด Layout เต็มหน้าจอ (Flex direction: Column)
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* 1. Header (LOGO แถบฟ้าอ่อนตามแบบเพื่อน) */}
      <header className="navbar bg-sky-200 shadow-sm px-6">
        <div className="flex-1">
          {/* ปรับ LOGO เป็นชื่อระบบให้ดูจริงจังขึ้น */}
          <a className="text-xl font-bold text-sky-900">WORKSHOP REG.</a>
        </div>
      </header>

      {/* 2. Main Content (Centered Login Card) */}
      <main className="flex-grow flex items-center justify-center p-4">
        {/* Login Card (ปรับสีฟ้าอ่อนตามแบบและเพิ่มเงา) */}
        <div className="card w-96 bg-sky-100 shadow-2xl border border-sky-200 p-8 rounded-2xl">
          <h1 className="text-center text-3xl font-bold text-sky-900 mb-8">
            Login
          </h1>

          {/* แสดง Error Alert ถ้ามี (นำ logic เดิมมาใช้) */}
          {errorMsg && (
            <div className="alert alert-error text-sm p-3 rounded-lg mb-4">
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Field (เปลี่ยนจาก Email ตามแบบเพื่อน เพื่อให้ API ยิงติด) */}
            <div className="form-control w-full">
              <label className="label p-1">
                <span className="label-text font-semibold text-sky-800">
                  Username
                </span>
              </label>
              <input
                type="text"
                placeholder="กรอก username ของคุณ"
                className="input input-bordered w-full bg-white border-sky-300 focus:border-sky-500 focus:ring-sky-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-control w-full">
              <label className="label p-1">
                <span className="label-text font-semibold text-sky-800">
                  Password
                </span>
              </label>
              <input
                type="password"
                placeholder="กรอกรหัสผ่าน"
                className="input input-bordered w-full bg-white border-sky-300 focus:border-sky-500 focus:ring-sky-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Action Button (ปรับเป็นสีเข้มเพื่อให้ Contrast ชัดขึ้น มองง่าย) */}
            <div className="form-control mt-8">
              <button
                type="submit"
                className="btn bg-sky-600 text-white hover:bg-sky-700 w-full rounded-full text-lg"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* 3. Footer (แถบฟ้าตามแบบเพื่อน) */}
      <footer className="h-15 bg-sky-200 mt-auto">
      </footer>
    </div>
  );
}
