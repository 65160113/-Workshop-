// frontend/src/pages/LoginPage.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; 

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        username,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      alert("🎉 เข้าสู่ระบบสำเร็จ!");
      navigate("/");
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้",
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* 2. เสียบ Navbar แทนที่ <header> ยาวๆ อันเก่าเลยครับ! */}
      <Navbar />

      {/* Main Content (Centered Login Card) */}
      <main className="grow flex items-center justify-center p-4">
        <div className="card w-96 bg-sky-100 shadow-2xl border border-sky-200 p-8 rounded-2xl">
          <h1 className="text-center text-3xl font-bold text-sky-900 mb-8">
            Login
          </h1>

          {errorMsg && (
            <div className="alert alert-error text-sm p-3 rounded-lg mb-4">
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
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

      <footer className="h-16 bg-sky-200 mt-auto"></footer>
    </div>
  );
}
