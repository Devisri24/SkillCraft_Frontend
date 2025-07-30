import React, { useState } from "react";
import "../styles/Signup.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // default
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setError("❌ Please enter a valid email address");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Signup failed");
      }

      const data = await response.json();
      console.log("Signup successful:", data);
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Signup failed:", err);
      setError(err.message || "Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {error && <p className="error">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Signup;
