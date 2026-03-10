// frontend/src/pages/MyAccountPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import Navbar from "../components/Navbar"; 

export default function MyAccountPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [myWorkshops, setMyWorkshops] = useState([]);

  useEffect(() => {
    const fetchMyWorkshops = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("กรุณาเข้าสู่ระบบก่อนครับ");
        navigate("/login");
        return;
      }
      setIsLoggedIn(true);

      try {
        const res = await axios.get(
          "http://localhost:3000/api/enrollments/my-workshops",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const formattedData = res.data.map((ws) => ({
          ...ws,
          status: ws.status === "active" ? "Registered" : "Cancelled",
        }));

        setMyWorkshops(formattedData);
      } catch (error) {
        console.error("Error:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchMyWorkshops();
  }, [navigate]);


  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Navbar />

      {/* Main Content */}
      <main className="grow flex flex-col items-center py-12 px-4">
        <h1 className="text-2xl font-bold text-sky-900 mb-8">
          My Registered Workshops
        </h1>

        {/* ตารางข้อมูล */}
        <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl overflow-hidden border border-sky-200">
          <div className="overflow-x-auto">
            <table className="table w-full text-center text-lg">
              <thead className="bg-sky-300 text-sky-900 text-lg">
                <tr>
                  <th className="py-4 font-bold border-r border-sky-200">
                    Workshop name
                  </th>
                  <th className="py-4 font-bold border-r border-sky-200">
                    Date
                  </th>
                  <th className="py-4 font-bold">Status</th>
                </tr>
              </thead>

              <tbody className="text-sky-800">
                {myWorkshops.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-gray-500">
                      คุณยังไม่ได้ลงทะเบียน Workshop ใดๆ ครับ
                    </td>
                  </tr>
                ) : (
                  myWorkshops.map((ws, index) => (
                    <tr
                      key={ws.id}
                      className={index % 2 === 0 ? "bg-sky-50/50" : "bg-white"}
                    >
                      <td className="py-4 border-r border-sky-100">
                        {ws.name}
                      </td>
                      <td className="py-4 border-r border-sky-100">
                        {ws.date}
                      </td>
                      <td className="py-4 text-green-600 font-semibold">
                        {ws.status}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-16 bg-sky-200 mt-auto"></footer>
    </div>
  );
}
