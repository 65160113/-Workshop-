// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import WorkshopDetailPage from "./pages/WorkshopDetailPage";
import MyAccountPage from "./pages/MyAccountPage";
import CreateWorkshopPage from "./pages/CreateWorkshopPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function App() {
  return (
    // BrowserRouter คือตัวครอบระบบ Routing ทั้งหมด
    <BrowserRouter>
      <Routes>
        {/* ถ้าเข้าเว็บมาตรงๆ (ไม่มี path ต่อท้าย) ให้โชว์หน้า HomePage */}
        <Route path="/" element={<HomePage />} />

        {/* ถ้าเข้า /login ให้โชว์หน้า LoginPage */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/workshop/:id" element={<WorkshopDetailPage />} />
        <Route path="/my-account" element={<MyAccountPage />} />
        <Route path="/create-workshop" element={<CreateWorkshopPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
