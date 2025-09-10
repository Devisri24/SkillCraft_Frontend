import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("skillcraft_user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== "admin") {
          setUserData(parsedUser);
        }
      }
    };

    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("skillcraft_user");
    if (window.botpressWebChat) {
      window.botpressWebChat.sendEvent({ type: "hide" });
      window.botpressWebChat.close();
      const botRoot = document.getElementById("bp-web-widget-container");
      if (botRoot) botRoot.remove();
    }
    window.location.href = "/";
  };

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
  };

  if (!userData) return null;

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-[#0a1128] text-white shadow-md sticky top-0 z-50">
      {/* Brand Title */}
      <h2 className="text-2xl font-bold tracking-wide text-gray-100">
        SkillCraft
      </h2>

      {/* Actions */}
      <div className="flex items-center gap-4 relative">
        {/* Profile */}
        <div className="relative">
          <button
            className="bg-[#1c2541] hover:bg-[#3a506b] text-white px-4 py-2 rounded-md text-sm transition"
            onClick={toggleProfile}
          >
            👤 Profile
          </button>
          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-lg border border-gray-200 p-4 z-50">
              <p className="text-sm mb-1">
                <span className="font-semibold">Name:</span> {userData.name}
              </p>
              <p className="text-sm mb-1">
                <span className="font-semibold">Email:</span> {userData.email}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Role:</span> User
              </p>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm text-white transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
