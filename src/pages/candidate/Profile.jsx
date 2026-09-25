import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Profile() {
  const [name, setName] = useState("Career Engine User");
  const [email, setEmail] = useState(
    localStorage.getItem("careerEngineUser") ||
      "user@careerengine.com"
  );
  const [role, setRole] = useState("Frontend Developer");
  const [location, setLocation] = useState("Bengaluru, India");
  const [bio, setBio] = useState(
    "Frontend developer focused on building modern, scalable web applications."
  );
  const [saved, setSaved] = useState(false);

  const handleSave = (event) => {
    event.preventDefault();

    localStorage.setItem("careerEngineProfileName", name);
    localStorage.setItem("careerEngineProfileEmail", email);
    localStorage.setItem("careerEngineProfileRole", role);
    localStorage.setItem("careerEngineProfileLocation", location);
    localStorage.setItem("careerEngineProfileBio", bio);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#141313] px-6 py-8 text-white md:px-10">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>
            <p className="text-xs font-semibold tracking-[0.12em] text-[#a7b6cc]">
              PROFILE
            </p>

            <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
              Your career profile
            </h1>

            <p className="mt-3 max-w-2xl text-[#c4c7c8]">
              Manage your personal information and career preferences.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="rounded-lg border border-white/10 px-5 py-3 text-center text-sm font-semibold transition hover:bg-white/5"
          >
            ← Dashboard
          </Link>

        </div>


        {/* PROFILE OVERVIEW */}

        <section className="mt-10 rounded-3xl border border-white/10 bg-[#111111] p-8">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-[#292929] text-2xl font-bold text-[#d4e4fa]">
              {name.charAt(0).toUpperCase()}
            </div>

            <div>

              <p className="text-xs font-semibold tracking-[0.12em] text-[#a7b6cc]">
                CANDIDATE
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                {name}
              </h2>

              <p className="mt-1 text-[#c4c7c8]">
                {role}
              </p>

              <p className="mt-2 text-sm text-[#8f9394]">
                {location}
              </p>

            </div>

          </div>

        </section>


        {/* MAIN GRID */}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">

          {/* EDIT PROFILE */}

          <section className="rounded-3xl border border-white/10 bg-[#111111] p-8">

            <div className="mb-8">

              <p className="text-xs font-semibold tracking-[0.12em] text-[#a7b6cc]">
                PERSONAL INFORMATION
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                Edit profile
              </h2>

            </div>

            <form
              onSubmit={handleSave}
              className="space-y-6"
            >

              {/* NAME */}

              <div>

                <label
                  htmlFor="profile-name"
                  className="mb-2 block text-xs font-semibold tracking-wide text-[#8f9394]"
                >
                  FULL NAME
                </label>

                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#202020] px-4 py-3 text-white outline-none transition placeholder:text-[#666] focus:border-[#a7b6cc]"
                />

              </div>


              {/* EMAIL */}

              <div>

                <label
                  htmlFor="profile-email"
                  className="mb-2 block text-xs font-semibold tracking-wide text-[#8f9394]"
                >
                  EMAIL
                </label>

                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#202020] px-4 py-3 text-white outline-none transition focus:border-[#a7b6cc]"
                />

              </div>


              {/* ROLE */}

              <div>

                <label
                  htmlFor="profile-role"
                  className="mb-2 block text-xs font-semibold tracking-wide text-[#8f9394]"
                >
                  TARGET ROLE
                </label>

                <input
                  id="profile-role"
                  type="text"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  placeholder="Frontend Developer"
                  className="w-full rounded-lg border border-white/10 bg-[#202020] px-4 py-3 text-white outline-none transition placeholder:text-[#666] focus:border-[#a7b6cc]"
                />

              </div>


              {/* LOCATION */}

              <div>

                <label
                  htmlFor="profile-location"
                  className="mb-2 block text-xs font-semibold tracking-wide text-[#8f9394]"
                >
                  LOCATION
                </label>

                <input
                  id="profile-location"
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Bengaluru, India"
                  className="w-full rounded-lg border border-white/10 bg-[#202020] px-4 py-3 text-white outline-none transition placeholder:text-[#666] focus:border-[#a7b6cc]"
                />

              </div>


              {/* BIO */}

              <div>

                <label
                  htmlFor="profile-bio"
                  className="mb-2 block text-xs font-semibold tracking-wide text-[#8f9394]"
                >
                  PROFESSIONAL BIO
                </label>

                <textarea
                  id="profile-bio"
                  rows="5"
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  className="w-full resize-none rounded-lg border border-white/10 bg-[#202020] px-4 py-3 text-white outline-none transition placeholder:text-[#666] focus:border-[#a7b6cc]"
                />

              </div>


              {/* SAVE */}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                <button
                  type="submit"
                  className="rounded-lg bg-[#d4e4fa] px-6 py-3 text-sm font-semibold text-[#171717] transition hover:bg-white"
                >
                  Save Changes
                </button>

                {saved && (
                  <span className="text-sm text-[#b9dfc8]">
                    ✓ Profile saved successfully
                  </span>
                )}

              </div>

            </form>

          </section>


          {/* CAREER SUMMARY */}

          <div className="space-y-8">

            <section className="rounded-3xl border border-white/10 bg-[#111111] p-8">

              <p className="text-xs font-semibold tracking-[0.12em] text-[#a7b6cc]">
                PROFILE STRENGTH
              </p>

              <div className="mt-5 flex items-end gap-3">

                <span className="text-5xl font-bold text-[#b9c8de]">
                  80%
                </span>

                <span className="pb-2 text-sm text-[#b9dfc8]">
                  Strong
                </span>

              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#292929]">

                <div
                  className="h-full rounded-full bg-[#a7b6cc]"
                  style={{ width: "80%" }}
                />

              </div>

              <p className="mt-4 text-sm leading-6 text-[#8f9394]">
                Your profile has strong technical coverage and relevant
                experience for your target roles.
              </p>

            </section>


            {/* QUICK LINKS */}

            <section className="rounded-3xl border border-white/10 bg-[#111111] p-8">

              <p className="text-xs font-semibold tracking-[0.12em] text-[#a7b6cc]">
                CAREER TOOLS
              </p>

              <div className="mt-6 space-y-3">

                <QuickLink
                  to="/resume"
                  title="Resume Manager"
                  description="Manage your resumes"
                />

                <QuickLink
                  to="/resume-analysis"
                  title="Resume Analysis"
                  description="Review your AI analysis"
                />

                <QuickLink
                  to="/role-matches"
                  title="Role Matches"
                  description="Find matching opportunities"
                />

                <QuickLink
                  to="/skill-lab"
                  title="Skill Lab"
                  description="Improve your skill gaps"
                />

              </div>

            </section>

          </div>

        </div>


        {/* CAREER GOAL */}

        <section className="mt-8 rounded-3xl border border-white/10 bg-[#111111] p-8">

          <p className="text-xs font-semibold tracking-[0.12em] text-[#a7b6cc]">
            CAREER GOAL
          </p>

          <h2 className="mt-3 text-2xl font-semibold">
            Build a stronger path to your next role
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-[#c4c7c8]">
            Keep your profile, resume, skills, and applications updated
            so Career Engine can provide better recommendations.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">

            <Link
              to="/candidate/match-engine"
              className="rounded-lg bg-[#d4e4fa] px-5 py-3 text-sm font-semibold text-[#171717] transition hover:bg-white"
            >
              Run Match Analysis
            </Link>

            <Link
              to="/applications"
              className="rounded-lg border border-white/10 px-5 py-3 text-sm font-semibold text-[#c4c7c8] transition hover:bg-white/5 hover:text-white"
            >
              Track Applications
            </Link>

          </div>

        </section>

      </div>
    </div>
  );
}


function QuickLink({
  to,
  title,
  description,
}) {
  return (
    <Link
      to={to}
      className="block rounded-xl border border-white/5 bg-[#181818] p-4 transition hover:border-white/10 hover:bg-[#202020]"
    >
      <p className="font-semibold text-white">
        {title}
      </p>

      <p className="mt-1 text-sm text-[#8f9394]">
        {description}
      </p>
    </Link>
  );
}