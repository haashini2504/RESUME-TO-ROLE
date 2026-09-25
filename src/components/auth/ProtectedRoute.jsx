import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const token = localStorage.getItem("careerEngineToken");
  const rawUser = localStorage.getItem("careerEngineUser");

  if (!token || !rawUser) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  let user;
  try {
    user = JSON.parse(rawUser);
  } catch {
    localStorage.removeItem("careerEngineToken");
    localStorage.removeItem("careerEngineUser");
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    if (user?.role === "recruiter") return <Navigate to="/recruiter/dashboard" replace />;
    if (user?.role === "student") return <Navigate to="/student/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
