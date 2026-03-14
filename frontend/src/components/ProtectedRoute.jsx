// frontend/src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

// รับ component หน้าเว็บที่ต้องการปกป้อง (children) และตำแหน่งที่อนุญาตให้เข้าได้ (allowedRoles)
export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // กฎข้อ 1: ไม่มี Token (ยังไม่ล็อคอิน) เตะไปหน้า Login
  if (!token) {
    alert("กรุณาเข้าสู่ระบบก่อนครับ!");
    return <Navigate to="/login" replace />;
  }

  // กฎข้อ 2: มี Token แต่ตำแหน่งไม่ตรงกับที่อนุญาต เตะไปหน้า Home
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้ครับ! 🛑");
    return <Navigate to="/" replace />;
  }

  // ถ้าผ่านทั้ง 2 กฎ ก็เชิญเข้าป้ายได้เลย!
  return children;
}
