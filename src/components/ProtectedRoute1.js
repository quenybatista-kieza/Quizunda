// src/components/ProtectedRoute_1.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminAuthContext } from "../context/AuthContext1";

export default function ProtectedRoute1({ children, allowedUsers }) {
  const { admin } = useContext(AdminAuthContext);

  // 🔹 Se não houver admin logado, bloqueia
  if (!admin) {
    return <Navigate to="/AdminLogin" replace />;
  }

  // 🔹 Se houver restrição de usuários, valida username
  if (allowedUsers && !allowedUsers.includes(admin.username)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 🔹 Se passou nas verificações, renderiza a página
  return children;
}
