import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css";
import API from "../api"; // ✅

const AdminLogin = () => {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

const handleAdminLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await API.post("/auth/login", {
      email: adminEmail,
      password: adminPassword,
    });

    const data = response.data;

    if (data.role === "admin") {
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/admin/manager");
    } else {
      setMessage("❌ Unauthorized or not an admin");
    }
  } catch (error) {
    console.error("Admin login error:", error);
    setMessage("❌ Server error or invalid credentials");
  }
};


  return (
    <div className="admin-login-container">
      <form className="admin-login-form" onSubmit={handleAdminLogin}>
        <h2>Admin Login</h2>
        {message && <p className="admin-error-msg">{message}</p>}
        <input
          type="email"
          placeholder="Admin Email"
          required
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        <p className="admin-login-footer">Only authorized admin can login.</p>
      </form>
    </div>
  );
};

export default AdminLogin;
