import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: adminEmail, password: adminPassword }),
        }
      );

      const data = await res.json();

      if (res.ok && data.role === "admin") {
        localStorage.setItem("skillcraft_user", JSON.stringify(data));
        navigate("/admin/manager");
      } else {
        setMessage("❌ Unauthorized or not an admin");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("❌ Network or server error");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-orange-100 via-white to-orange-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="text-3xl font-bold text-center text-orange-700 mb-6">
          Admin Login
        </h2>

        {message && (
          <p className="mb-4 text-center text-red-600 font-medium">{message}</p>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-5">
          <div>
            <label className="block text-left text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              required
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-left text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-orange-600 py-2.5 font-semibold text-white shadow-md transition hover:bg-orange-700 hover:shadow-lg"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 text-sm font-medium">
          🔒 Only authorized admin can login.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
