// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    // BrowserRouter คือตัวครอบระบบ Routing ทั้งหมด
    <BrowserRouter>
      <Routes>
        {/* ถ้าเข้าเว็บมาตรงๆ (ไม่มี path ต่อท้าย) ให้โชว์หน้า HomePage */}
        <Route path="/" element={<HomePage />} />

        {/* ถ้าเข้า /login ให้โชว์หน้า LoginPage */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
