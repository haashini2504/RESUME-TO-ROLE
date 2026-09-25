import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

export default function CandidateSidebar() {
  const navigate = useNavigate();

  const links = [
    {
      label: "Overview",
      icon: "⊞",
      to: "/dashboard",
    },
    {
      label: "My Profile",
      icon: "♙",
      to: "/profile",
    },
    {
      label: "Resume",
      icon: "▤",
      to: "/resume",
    },
    {
      label: "Role Matches",
      icon: "♧",
      to: "/role-matches",
    },
    {
      label: "Skill Lab",
      icon: "♢",
      to: "/skill-lab",
    },
    {
      label: "Applications",
      icon: "▣",
      to: "/applications",
    },
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[250px] border-r border-white/10 bg-[#111111] lg:flex lg:flex-col">

      {/* BRAND */}

      <Link
        to="/dashboard"
        className="border-b border-white/10 px-6 py-6"
      >
        <div className="text-xl font-semibold text-white">
          Career Engine
        </div>

        <div className="mt-1 text-xs text-[#8f9394]">
          AI-Powered Insights
        </div>
      </Link>


      {/* NAVIGATION */}

      <nav className="flex-1 px-4 py-6">

        <div className="space-y-2">

          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                  isActive
                    ? "bg-[#292929] text-white"
                    : "text-[#9b9e9f] hover:bg-[#1c1c1c] hover:text-white"
                }`
              }
            >
              <span className="w-5 text-center">
                {link.icon}
              </span>

              {link.label}
            </NavLink>
          ))}

        </div>

      </nav>


      {/* BOTTOM */}

      <div className="border-t border-white/10 p-4">

        <NavLink
          to="/resume-analysis"
          className="mb-3 flex items-center justify-center rounded-lg bg-[#d4e4fa] px-4 py-3 text-sm font-semibold text-[#171717] transition hover:bg-white"
        >
          Analyze Resume
        </NavLink>


        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#9b9e9f] transition hover:bg-[#1c1c1c] hover:text-white"
        >
          <span>?</span>
          Help Center
        </button>


        <button
          type="button"
          onClick={handleLogout}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-[#9b9e9f] transition hover:bg-[#1c1c1c] hover:text-white"
        >
          <span>↪</span>
          Logout
        </button>

      </div>

    </aside>
  );
}