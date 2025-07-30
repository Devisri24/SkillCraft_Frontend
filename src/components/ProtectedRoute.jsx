import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const storedUser = JSON.parse(localStorage.getItem("skillcraft_user"));
  const token = storedUser?.token;

  if (!token || storedUser?.role !== "user") {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute; // ✅ This line is REQUIRED
