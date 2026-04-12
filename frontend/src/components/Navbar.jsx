import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const from = location.state?.from || "/";

  // State สำหรับเก็บยศ และ State สำหรับเปิด/ปิดเมนูมือถือ
  const [userRole, setUserRole] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserRole(payload.role);
      } catch (error) {
        console.error("Token decoding error:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setUserRole(null);
    setIsMobileMenuOpen(false); // ปิดเมนูมือถือตอนล็อกเอาท์ด้วย
    alert("ออกจากระบบเรียบร้อยแล้วครับ");
    navigate("/");
  };

  // ฟังก์ชันปิดเมนูมือถือเมื่อกดเลือกลิงก์
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="px-4 md:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent tracking-tighter hover:opacity-80 transition-opacity"
          >
            WORKSHOP<span className="text-slate-800">.REG</span>
          </Link>
        </div>

        {/* Desktop Menu (แสดงเฉพาะจอใหญ่ md ขึ้นไป) */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {(userRole === "admin" || userRole === "approver") && (
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-xl text-amber-600 font-bold hover:bg-amber-50 transition-colors flex items-center gap-2"
                >
                  Dashboard
                </Link>
              )}

              {(userRole === "organizer" || userRole === "admin") && (
                <Link
                  to="/my-workshops"
                  className="px-4 py-2 rounded-xl text-indigo-600 font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2"
                >
                  My Workshops
                </Link>
              )}

              <Link
                to="/my-account"
                className="px-4 py-2 rounded-xl text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                My Account
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl text-rose-600 font-bold hover:bg-rose-50 hover:text-rose-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {location.pathname === "/login" ? (
                <Link
                  to="/register"
                  state={{ from: from }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-md hover:-translate-y-0.5 transition-all"
                >
                  Sign Up
                </Link>
              ) : location.pathname === "/register" ? (
                <Link
                  to="/login"
                  state={{ from: from }}
                  className="px-5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:border-indigo-600 hover:text-indigo-600 transition-colors"
                >
                  Log In
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    state={{ from: from }}
                    className="px-5 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    state={{ from: from }}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button (แสดงเฉพาะจอมือถือ) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          >
            {/* สลับ Icon ระหว่าง แฮมเบอร์เกอร์ กับ กากบาท */}
            {isMobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown (เลื่อนลงมาเมื่อกดปุ่ม Hamburger) */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-xl flex flex-col px-4 py-6 gap-3 z-50 animate-fade-in-down">
          {isLoggedIn ? (
            <>
              <div className="px-4 pb-4 mb-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Logged in as
                </p>
                <p className="text-sm font-bold text-indigo-600 uppercase">
                  {userRole}
                </p>
              </div>

              {(userRole === "admin" || userRole === "approver") && (
                <Link
                  to="/admin"
                  onClick={closeMobileMenu}
                  className="px-4 py-3 rounded-xl text-amber-600 font-bold hover:bg-amber-50 active:bg-amber-100 transition-colors"
                >
                  Dashboard
                </Link>
              )}

              {(userRole === "organizer" || userRole === "admin") && (
                <Link
                  to="/my-workshops"
                  onClick={closeMobileMenu}
                  className="px-4 py-3 rounded-xl text-indigo-600 font-bold hover:bg-indigo-50 active:bg-indigo-100 transition-colors"
                >
                  My Workshops
                </Link>
              )}

              <Link
                to="/my-account"
                onClick={closeMobileMenu}
                className="px-4 py-3 rounded-xl text-slate-700 font-bold hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                My Account
              </Link>

              <button
                onClick={handleLogout}
                className="text-left px-4 py-3 rounded-xl text-rose-600 font-bold hover:bg-rose-50 active:bg-rose-100 transition-colors mt-2"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="px-4 py-3.5 rounded-xl text-center text-indigo-600 font-bold bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="px-4 py-3.5 rounded-xl text-center bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-md transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
