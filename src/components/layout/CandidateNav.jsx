import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import Logo from "../ui/Logo";

const links = [
  {
    label: "Dashboard",
    to: "/dashboard",
    end: true,
  },
  {
    label: "Resume",
    to: "/resume",
  },
  {
    label: "Resume Analysis",
    to: "/resume-analysis",
  },
  {
    label: "Role Matches",
    to: "/role-matches",
  },
  {
    label: "Skill Lab",
    to: "/skill-lab",
  },
  {
    label: "Applications",
    to: "/applications",
  },
  {
    label: "Profile",
    to: "/profile",
  },
];

export default function CandidateNav() {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    // Remove REAL authentication data
    localStorage.removeItem("careerEngineToken");
    localStorage.removeItem("careerEngineUser");

    // Remove any old demo authentication data
    localStorage.removeItem("careerEngineLoggedIn");
    localStorage.removeItem("careerEngineEmail");

    setMobileOpen(false);

    navigate("/login", {
      replace: true,
    });
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-white/[0.08] bg-[rgba(20,19,19,0.95)] backdrop-blur-md">

        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-6">

          {/* LOGO */}

          <Link
            to="/dashboard"
            onClick={closeMobileMenu}
            className="shrink-0"
          >
            <Logo size="text-[22px]" />
          </Link>


          {/* DESKTOP NAVIGATION */}

          <nav className="hidden items-center gap-5 lg:flex">

            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `font-ui text-xs font-medium tracking-[0.5px] transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-[#9b9e9f] hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

          </nav>


          {/* RIGHT SIDE */}

          <div className="flex items-center gap-4">

            {/* MATCH ENGINE */}

            <Link
              to="/candidate/match-engine"
              className="hidden rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold text-[#c4c7c8] transition-colors hover:border-white/20 hover:text-white md:block"
            >
              Match Engine
            </Link>


            {/* REAL LOGOUT */}

            <button
              type="button"
              onClick={handleLogout}
              className="hidden text-xs font-semibold tracking-[0.5px] text-[#c4c7c8] transition-colors hover:text-white md:block"
            >
              Logout
            </button>


            {/* MOBILE MENU */}

            <button
              type="button"
              onClick={() =>
                setMobileOpen((current) => !current)
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#c4c7c8] transition hover:border-white/20 hover:text-white lg:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? "×" : "☰"}
            </button>

          </div>

        </div>


        {/* MOBILE NAVIGATION */}

        {mobileOpen && (
          <div className="border-b border-white/[0.08] bg-[#141313] lg:hidden">

            <nav className="mx-auto max-w-[1280px] px-6 py-4">

              <div className="flex flex-col gap-1">

                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-[#292929] text-white"
                          : "text-[#9b9e9f] hover:bg-[#202020] hover:text-white"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}


                {/* MOBILE MATCH ENGINE */}

                <Link
                  to="/candidate/match-engine"
                  onClick={closeMobileMenu}
                  className="mt-2 rounded-lg border border-white/10 px-4 py-3 text-sm font-semibold text-[#c4c7c8] transition hover:border-white/20 hover:text-white"
                >
                  Match Engine
                </Link>


                {/* MOBILE REAL LOGOUT */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 rounded-lg px-4 py-3 text-left text-sm font-semibold text-[#c4c7c8] transition hover:bg-[#202020] hover:text-white"
                >
                  Logout
                </button>

              </div>

            </nav>

          </div>
        )}

      </header>
    </>
  );
}