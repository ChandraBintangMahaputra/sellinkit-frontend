import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaLink, FaSignOutAlt } from "react-icons/fa";
import { MdAnalytics, MdPeople } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import { BsCollectionFill } from "react-icons/bs";
import "react-toastify/dist/ReactToastify.css";
import { scale } from "../../assets";

const Sidebar: React.FC = () => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setShowLogoutConfirm(false);
    toast.success("Logout successful!");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 right-0 bg-white text-black shadow md:top-0 md:left-0 md:h-screen md:w-64 z-10">
      <div className="hidden md:flex items-center justify-center h-16 shadow">
        <img src={scale} alt="TPL Logo" className="h-30" />
      </div>
      <ToastContainer autoClose={3000} position="top-right" closeOnClick />

      <nav className="flex md:flex-col md:p-4 md:flex-1 justify-center md:justify-start">
        <ul className="flex md:block w-full justify-center">
          {[
            { to: "/beranda", icon: <FaLink />, label: "Hyperlink" },
            { to: "/catalog", icon: <BsCollectionFill />, label: "Catalog" },
            { to: "/statistic", icon: <MdAnalytics />, label: "Statistic" },
            { to: "/profile", icon: <MdPeople />, label: "Profile" },
          ].map((menu) => (
            <li key={menu.to} className="md:mb-2 md:mr-5 md:ml-5">
              <Link
                to={menu.to}
                className={`block px-4 py-2 rounded flex items-center justify-center md:justify-start ${
                  location.pathname === menu.to
                    ? "bg-green-700 text-white"
                    : "hover:bg-green-700 hover:text-white"
                }`}
              >
                {menu.icon}
                <span className={`ml-2 ${isMobile ? "inline text-xs" : "hidden md:inline"}`}>
                  {menu.label}
                </span>
              </Link>
            </li>
          ))}
          <li className="hidden md:block">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="block px-9 py-2 rounded hover:bg-green-700 w-full text-left flex items-center justify-center md:justify-start hover:text-white"
            >
              <FaSignOutAlt className="mr-2" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Logout confirmation popup */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-green-900 bg-opacity-50"
          style={{ zIndex: 9999 }}
        >
          <div className="bg-white text-black p-6 rounded shadow-lg" style={{ zIndex: 10000 }}>
            <h2 className="text-lg font-bold mb-4">Confirm Logout</h2>
            <p className="mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-end">
              <button
                onClick={handleLogout}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="bg-green-300 text-black px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
