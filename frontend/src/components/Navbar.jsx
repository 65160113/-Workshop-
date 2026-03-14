// frontend/src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const from = location.state?.from || "/";

  // 🌟 1. สร้างกล่องเก็บยศ (Role) ของคนที่ล็อคอิน
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);

      // 🌟 2. แอบแกะ Token เพื่อดูว่าคนนี้ยศอะไร
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserRole(payload.role); // เก็บยศใส่กล่องไว้
      } catch (error) {
        console.error("Token decoding error:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setUserRole(null); // 🌟 เคลียร์ยศทิ้งตอนล็อคเอาท์ด้วย
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
      <div className="text-sky-900 text-lg font-semibold flex items-center">
        {isLoggedIn ? (
          <>
            {/* 🌟 ปุ่ม: โชว์ปุ่ม Admin Dashboard เฉพาะ admin หรือ approver */}
            {(userRole === "admin" || userRole === "approver") && (
              <Link
                to="/admin"
                className="mr-6 text-amber-600 hover:text-amber-800 transition-colors font-bold flex items-center gap-1"
              >
                👑 Admin Dashboard
              </Link>
            )}

            {/* 🌟 ปุ่ม: โชว์เฉพาะ Admin หรือ Organizer เท่านั้น */}
            {(userRole === "admin" || userRole === "organizer") && (
              <Link
                to="/create-workshop"
                className="mr-6 text-sky-700 hover:text-sky-900 transition-colors font-bold"
              >
                ➕ Create Workshop
              </Link>
            )}

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
          /* ส่วนของการเช็ค URL หน้า Login / Register ของเดิม (ไม่แตะต้อง) */
          <>
            {location.pathname === "/login" ? (
              <Link
                to="/register"
                state={{ from: from }}
                className="hover:text-sky-700 transition-colors"
              >
                Register
              </Link>
            ) : location.pathname === "/register" ? (
              <Link
                to="/login"
                state={{ from: from }}
                className="hover:text-sky-700 transition-colors"
              >
                Login
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  state={{ from: from }}
                  className="hover:text-sky-700 transition-colors"
                >
                  Login
                </Link>
                <span className="mx-2 text-sky-600">|</span>
                <Link
                  to="/register"
                  state={{ from: from }}
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
