import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

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
    window.botpressWebChat.sendEvent({ type: "hide" }); // Hide widget
    window.botpressWebChat.close(); // Close chat if open
    const botRoot = document.getElementById("bp-web-widget-container");
    if (botRoot) botRoot.remove(); // Remove DOM container
  }

  // Redirect to home
  window.location.href = "/";
};


  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
  };

  if (!userData) return null;

  return (
    <div className="navbar">
      <h2 className="nav-title">SkillCraft</h2>
      <div className="nav-actions">
        <div className="profile-container">
          <button className="nav-btn" onClick={toggleProfile}>
            👤 Profile
          </button>
          {showProfile && (
            <div className="profile-box">
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Role:</strong> User</p>
            </div>
          )}
        </div>
        <button className="nav-btn logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
