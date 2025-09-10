import React, { useState } from "react";
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-green-100 via-white to-green-50 px-4">
      <form
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
        onSubmit={handleSubmit}
      >
        <h2 className="mb-6 text-center text-3xl font-extrabold text-green-700">
          Create Account
        </h2>

        {error && (
          <p className="mb-4 rounded-md bg-red-100 p-2 text-center text-sm text-red-600">
            {error}
          </p>
        )}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="mb-6 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-green-600 py-2.5 font-semibold text-white shadow-md transition hover:bg-green-700 hover:shadow-lg"
        >
          Register
        </button>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="cursor-pointer font-medium text-green-600 hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
