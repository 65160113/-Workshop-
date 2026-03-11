// frontend/src/pages/RegisterPage.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import Navbar from "../components/Navbar"; 

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกันครับ");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/auth/register", {
        username: username,
        password: password,
        email: email,
        firstName: firstName,
        lastName: lastName,
      });

      alert("🎉 สมัครสมาชิกสำเร็จ! ระบบจะพากลับไปหน้าเข้าสู่ระบบ");
      navigate("/login");
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้",
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* 👇 2. เรียกใช้งาน Navbar แทน <header> ของเดิม 👇 */}
      <Navbar />

      <main className="grow flex items-center justify-center p-4 py-12">
        <div className="card w-full max-w-md bg-sky-100 shadow-2xl border border-sky-200 p-8 rounded-2xl">
          <h1 className="text-center text-3xl font-bold text-sky-900 mb-6">
            Register
          </h1>

          {errorMsg && (
            <div className="alert alert-error text-sm p-3 rounded-lg mb-4">
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* ช่อง Username */}
            <div className="form-control w-full">
              <label className="label p-1">
                <span className="label-text font-semibold text-sky-800">
                  Username
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full bg-white border-sky-300 focus:border-sky-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* ช่อง First Name และ Last Name */}
            <div className="flex gap-4">
              <div className="form-control w-1/2">
                <label className="label p-1">
                  <span className="label-text font-semibold text-sky-800">
                    First Name
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full bg-white border-sky-300 focus:border-sky-500"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="form-control w-1/2">
                <label className="label p-1">
                  <span className="label-text font-semibold text-sky-800">
                    Last Name
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full bg-white border-sky-300 focus:border-sky-500"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* ช่อง Email */}
            <div className="form-control w-full">
              <label className="label p-1">
                <span className="label-text font-semibold text-sky-800">
                  Email
                </span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full bg-white border-sky-300 focus:border-sky-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* ช่อง Password */}
            <div className="form-control w-full">
              <label className="label p-1">
                <span className="label-text font-semibold text-sky-800">
                  Password
                </span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full bg-white border-sky-300 focus:border-sky-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* ช่อง Confirm Password */}
            <div className="form-control w-full">
              <label className="label p-1">
                <span className="label-text font-semibold text-sky-800">
                  Confirm Password
                </span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full bg-white border-sky-300 focus:border-sky-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn bg-sky-600 text-white hover:bg-sky-700 w-full rounded-full text-lg shadow-md border-none"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="h-16 bg-sky-200 mt-auto"></footer>
    </div>
  );
}
