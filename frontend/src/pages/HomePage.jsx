// frontend/src/pages/HomePage.jsx
import { Link } from "react-router-dom";

export default function HomePage() {
  const workshops = [
    {
      id: 1,
      name: "Workshop 1",
      location: "Online (Zoom)",
      date: "10 May 2026",
      seats: 30,
    },
    {
      id: 2,
      name: "Workshop 2",
      location: "Burapha University",
      date: "15 May 2026",
      seats: 25,
    },
  ];

  return (
    // พื้นหลังสีเดียวกับหน้า Login
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* 1. Header (ดึงสไตล์มาจาก Login เป๊ะๆ) */}
      <header className="navbar bg-sky-200 shadow-sm px-6">
        <div className="flex-1">
          <a className="text-xl font-bold text-sky-900">WORKSHOP REG.</a>
        </div>
        <div className="text-sky-900 text-lg font-semibold">
          <Link to="/login" className="hover:text-sky-700 transition-colors">
            Login
          </Link>
          <span className="mx-2 text-sky-600">|</span>
          <Link to="/register" className="hover:text-sky-700 transition-colors">
            Register
          </Link>
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="flex-grow flex flex-col items-center py-12 px-4">
        {/* หัวข้อ ปรับฟอนต์และสีให้เข้าธีม */}
        <h1 className="text-3xl font-bold text-sky-900 mb-10 text-center">
          Workshop Online Registration
        </h1>

        <div className="w-full max-w-4xl flex flex-col gap-8">
          {workshops.map((ws) => (
            // Card (ใช้ bg-sky-100, ขอบโค้ง 2xl, และเงาเหมือนหน้า Login)
            <div
              key={ws.id}
              className="card bg-sky-100 shadow-xl border border-sky-200 p-8 rounded-2xl flex flex-col"
            >
              <h2 className="text-2xl font-bold text-sky-900 mb-6">
                {ws.name}
              </h2>

              <div className="text-sky-800 text-lg mb-8 space-y-2">
                <p className="flex">
                  <span className="w-24 font-semibold">Location</span> :{" "}
                  {ws.location}
                </p>
                <p className="flex">
                  <span className="w-24 font-semibold">Date</span> : {ws.date}
                </p>
                <p className="flex">
                  <span className="w-24 font-semibold">Seats</span> : {ws.seats}
                </p>
              </div>

              {/* ปุ่ม Register (ใช้ bg-sky-600 และขอบโค้งมน rounded-full เหมือนหน้า Login) */}
              <div className="w-full sm:w-48 mt-auto">
                <button className="btn bg-sky-600 text-white hover:bg-sky-700 w-full rounded-full text-lg border-none shadow-md">
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 3. Footer (ใช้ความสูงและสีแบบเดียวกับ Login) */}
      <footer className="h-16 bg-sky-200 mt-auto"></footer>
    </div>
  );
}
