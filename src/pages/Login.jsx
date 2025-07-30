import React, { useState } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../api"; // ✅

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ✅ for page navigation

  const handleLogin = async (e) => {
  e.preventDefault();

  try {

      const response = await API.post("/auth/login", {
        email,
        password,
      });


    const { token, role, name, email: userEmail } = response.data;

    localStorage.setItem(
      "skillcraft_user",
      JSON.stringify({ token, role, name, email: userEmail })
    );

    if (role === "admin") {
      navigate("/admin/manager");
    } else {
      navigate("/dashboard");
    }
  } catch (error) {
    console.error("Login failed:", error);
    alert("Login failed: " + error.message);
  }
};


  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="login-title">Login</h2>
        <input
          className="login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="login-button" type="submit">Login</button>

        {/* ✅ Link to Signup */}
        <p className="login-toggle">
          Don't have an account?{" "}
          <span
            className="signup-link"
            onClick={() => navigate("/signup")}
            style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
