import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function RequireRole() {
  const { user } = useAuth();
  if (!user?.role) return <Navigate to="/role-selection" replace />;
  return <Outlet />;
}

export function RequireOnboarding() {
  const { user } = useAuth();
  if (!user?.onboardingComplete) return <Navigate to="/onboarding" replace />;
  return <Outlet />;
}
