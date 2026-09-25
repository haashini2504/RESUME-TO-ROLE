import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo from "../ui/Logo";

export default function RecruiterLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("careerEngineToken");
    localStorage.removeItem("careerEngineUser");
    localStorage.removeItem("careerEngineLoggedIn");
    localStorage.removeItem("careerEngineEmail");
    navigate("/auth", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `text-xs font-semibold transition ${isActive ? "text-white" : "text-[#9b9e9f] hover:text-white"}`;

  return (
    <div className="min-h-screen bg-[#141313] text-white">
      <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-white/[0.08] bg-[rgba(20,19,19,0.95)] backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-6">
          <Link to="/recruiter/dashboard" className="shrink-0">
            <Logo size="text-[22px]" />
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <NavLink to="/recruiter/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/recruiter/jobs" className={linkClass}>Jobs</NavLink>
            <NavLink to="/recruiter/jobs/new" className={linkClass}>Post Job</NavLink>
          </nav>
          <button type="button" onClick={logout} className="text-xs font-semibold text-[#c4c7c8] hover:text-white">Logout</button>
        </div>
      </header>
      <main className="min-h-screen pt-16">
        <Outlet />
      </main>
    </div>
  );
}
