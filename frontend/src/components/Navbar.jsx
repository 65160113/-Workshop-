// frontend/src/components/Navbar.jsx
import { useState, useEffect } from "react";
// 1. นำเข้า useLocation เพิ่มเข้ามา
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // 2. เรียกใช้ useLocation เพื่อดูว่าตอนนี้อยู่หน้า path ไหน
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    alert("👋 ออกจากระบบเรียบร้อยแล้วครับ");
    navigate("/");
  };

  return (
    <header className="navbar bg-sky-200 shadow-sm px-6 h-16 shrink-0">
      <div className="flex-1">
        <Link to="/" className="text-xl font-bold text-sky-900">
          WORKSHOP REG.
        </Link>
      </div>
      <div className="text-sky-900 text-lg font-semibold">
        {isLoggedIn ? (
          <>
            <Link
              to="/my-account"
              className="hover:text-sky-700 transition-colors mr-4"
            >
              My account
            </Link>
            <button
              onClick={handleLogout}
              className="hover:text-red-600 transition-colors font-semibold"
            >
              Logout
            </button>
          </>
        ) : (
          /* 3. เช็คเงื่อนไขตาม URL ปัจจุบัน (location.pathname) */
          <>
            {location.pathname === "/login" ? (
              /* ถ้าอยู่หน้า Login ให้โชว์แค่ปุ่ม Register */
              <Link
                to="/register"
                className="hover:text-sky-700 transition-colors"
              >
                Register
              </Link>
            ) : location.pathname === "/register" ? (
              /* ถ้าอยู่หน้า Register ให้โชว์แค่ปุ่ม Login */
              <Link
                to="/login"
                className="hover:text-sky-700 transition-colors"
              >
                Login
              </Link>
            ) : (
              /* ถ้าอยู่หน้าอื่นๆ (เช่น หน้า Home) ให้โชว์ทั้งคู่ */
              <>
                <Link
                  to="/login"
                  className="hover:text-sky-700 transition-colors"
                >
                  Login
                </Link>
                <span className="mx-2 text-sky-600">|</span>
                <Link
                  to="/register"
                  className="hover:text-sky-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
}
