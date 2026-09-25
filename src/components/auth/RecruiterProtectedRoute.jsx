import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RecruiterProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("careerEngineToken");
  const rawUser = localStorage.getItem("careerEngineUser");

  if (!token || !rawUser) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  try {
    const user = JSON.parse(rawUser);
    if (user?.role !== "recruiter") {
      if (user?.role === "student") return <Navigate to="/student/dashboard" replace />;
      return <Navigate to="/dashboard" replace />;
    }
  } catch {
    localStorage.removeItem("careerEngineToken");
    localStorage.removeItem("careerEngineUser");
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return children;
}
