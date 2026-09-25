import React, { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../lib/config";

const AuthContext = createContext(null);
const VALID_ROLES = ["candidate", "student", "recruiter"];

function normalizeRole(role) {
  const value = String(role || "").trim().toLowerCase();
  if (value === "jobseeker") return "candidate";
  return VALID_ROLES.includes(value) ? value : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem("careerEngineToken");
      const storedUser = localStorage.getItem("careerEngineUser");
      if (token && storedUser) setUser(JSON.parse(storedUser));
    } catch (error) {
      console.error("Invalid stored user:", error);
      localStorage.removeItem("careerEngineToken");
      localStorage.removeItem("careerEngineUser");
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSession = (data) => {
    localStorage.setItem("careerEngineToken", data.token);
    localStorage.setItem("careerEngineUser", JSON.stringify(data.user));
    localStorage.removeItem("careerEngineLoggedIn");
    localStorage.removeItem("careerEngineEmail");
    setUser(data.user);
  };

  const login = async ({ email, password, role }) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role: normalizeRole(role) }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.success) {
      throw new Error(data.message || `Login failed (${response.status}).`);
    }

    saveSession(data);
    return data;
  };

  const register = async ({ name, email, password, role }) => {
    const normalizedRole = normalizeRole(role);
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role: normalizedRole }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.success) {
      throw new Error(data.message || `Registration failed (${response.status}).`);
    }
    return data;
  };

  const setRole = (role) => {
    const normalizedRole = normalizeRole(role);
    if (!normalizedRole) return;
    localStorage.setItem("careerEngineSelectedRole", normalizedRole);
    setUser((current) => {
      if (!current) return current;
      const updated = { ...current, role: normalizedRole };
      localStorage.setItem("careerEngineUser", JSON.stringify(updated));
      return updated;
    });
  };

  const completeOnboarding = () => {
    setUser((current) => {
      if (!current) return current;
      const updated = { ...current, onboardingComplete: true };
      localStorage.setItem("careerEngineUser", JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    localStorage.removeItem("careerEngineToken");
    localStorage.removeItem("careerEngineUser");
    localStorage.removeItem("careerEngineLoggedIn");
    localStorage.removeItem("careerEngineEmail");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        setRole,
        completeOnboarding,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

export default AuthContext;
