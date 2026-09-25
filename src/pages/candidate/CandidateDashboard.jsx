import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CandidateDashboard() {
  const [user, setUser] = useState(null);
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    // ---------------------------------------------
    // GET REAL LOGGED-IN USER
    // ---------------------------------------------

    const storedUser =
      localStorage.getItem("careerEngineUser");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        setUser(parsedUser);
      } catch {
        // Older version may have stored only email/name
        setUser({
          name: storedUser,
          email: storedUser,
        });
      }
    }

    // ---------------------------------------------
    // GET REAL MATCH ENGINE RESULT
    // ---------------------------------------------

    const storedMatch =
      localStorage.getItem("careerEngineMatchResult");

    if (storedMatch) {
      try {
        const parsedMatch =
          JSON.parse(storedMatch);

        setMatchData(parsedMatch);
      } catch {
        setMatchData(null);
      }
    }
  }, []);

  // ---------------------------------------------
  // REAL USER NAME
  // ---------------------------------------------

  const displayName =
    user?.name ||
    user?.fullName ||
    user?.email?.split("@")[0] ||
    "Candidate";

  // ---------------------------------------------
  // REAL MATCH VALUES
  // ---------------------------------------------

  const resumeScore =
    matchData?.resumeScore ??
    matchData?.resume?.score ??
    matchData?.analysis?.resumeScore ??
    null;

  const roleMatch =
    matchData?.roleMatch ??
    matchData?.matchScore ??
    matchData?.score ??
    matchData?.analysis?.roleMatch ??
    null;

  const skills =
    matchData?.skills ??
    matchData?.detectedSkills ??
    matchData?.analysis?.skills ??
    [];

  const skillCount = Array.isArray(skills)
    ? skills.length
    : null;

  const recommendedRole =
    matchData?.recommendedRole ||
    matchData?.matchedRole ||
    matchData?.role ||
    matchData?.analysis?.recommendedRole ||
    null;

  const missingSkills =
    matchData?.missingSkills ??
    matchData?.skillGaps ??
    matchData?.analysis?.missingSkills ??
    [];

  const hasMatchData = Boolean(matchData);

  return (
    <div className="min-h-screen bg-[#141313] px-6 py-8 text-white md:px-10">

      <div className="mx-auto max-w-6xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>

            <p className="text-xs font-semibold tracking-[0.12em] text-[#a7b6cc]">
              CANDIDATE DASHBOARD
            </p>

            <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
              Welcome back, {displayName}
            </h1>

            <p className="mt-3 max-w-2xl text-[#c4c7c8]">
              Your career journey at a glance. Upload your resume,
              analyze your skills, and discover roles that match
              your real profile.
            </p>

          </div>

          <Link
            to="/candidate/match-engine"
            className="rounded-lg bg-[#d4e4fa] px-5 py-3 text-center text-sm font-semibold text-[#171717] transition hover:bg-white"
          >
            Run Match Engine
          </Link>

        </div>


        {/* =====================================================
            STATS
        ===================================================== */}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            label="RESUME SCORE"
            value={
              resumeScore !== null
                ? `${resumeScore}`
                : "—"
            }
            description={
              resumeScore !== null
                ? getScoreDescription(resumeScore)
                : "Not analyzed yet"
            }
          />

          <StatCard
            label="ROLE MATCH"
            value={
              roleMatch !== null
                ? `${roleMatch}%`
                : "—"
            }
            description={
              roleMatch !== null
                ? getMatchDescription(roleMatch)
                : "Run Match Engine"
            }
          />

          <StatCard
            label="SKILLS"
            value={
              skillCount !== null
                ? `${skillCount}`
                : "—"
            }
            description={
              skillCount !== null
                ? "Detected from resume"
                : "Upload resume first"
            }
          />

          <StatCard
            label="APPLICATIONS"
            value="—"
            description="No application data yet"
          />

        </div>


        {/* =====================================================
            MATCH STATUS
        ===================================================== */}

        {!hasMatchData && (

          <section className="mt-8 rounded-3xl border border-white/10 bg-[#111111] p-8">

            <p className="text-xs font-semibold tracking-[0.12em] text-[#a7b6cc]">
              GET STARTED
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              Your real career analysis starts here
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-[#8f9394]">
              No analysis results are available yet. Upload your
              actual resume and run the Match Engine. The dashboard
              will then display your real resume score, detected
              skills, role match, and skill gaps.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">

              <Link
                to="/resume"
                className="rounded-lg bg-[#d4e4fa] px-5 py-3 text-sm font-semibold text-[#171717] transition hover:bg-white"
              >
                Upload Resume
              </Link>

              <Link
                to="/candidate/match-engine"
                className="rounded-lg border border-white/10 px-5 py-3 text-sm font-semibold text-[#c4c7c8] transition hover:bg-white/5 hover:text-white"
              >
                Run Match Engine
              </Link>

            </div>

          </section>

        )}


        {/* =====================================================
            REAL CAREER OVERVIEW
        ===================================================== */}

        {hasMatchData && (

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">

            <section className="rounded-3xl border border-white/10 bg-[#111111] p-8">

              <p className="text-xs font-semibold tracking-[0.12em] text-[#a7b6cc]">
                CAREER OVERVIEW
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                {recommendedRole
                  ? recommendedRole
                  : "Your latest career analysis"}
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-[#c4c7c8]">
                These results are based on the resume analysis
                currently available from your Match Engine.
              </p>


              {/* PROFILE STRENGTH */}

              {resumeScore !== null && (

                <div className="mt-8">

                  <div className="mb-3 flex items-center justify-between">

                    <span className="text-sm text-[#8f9394]">
                      Resume strength
                    </span>

                    <span className="text-sm font-semibold text-[#b9c8de]">
                      {resumeScore}%
                    </span>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-[#292929]">

                    <div
                      className="h-full rounded-full bg-[#a7b6cc] transition-all duration-700"
                      style={{
                        width: `${clampPercentage(
                          resumeScore
                        )}%`,
                      }}
                    />

                  </div>

                </div>

              )}


              {/* ROLE MATCH */}

              {roleMatch !== null && (

                <div className="mt-6">

                  <div className="mb-3 flex items-center justify-between">

                    <span className="text-sm text-[#8f9394]">
                      Role compatibility
                    </span>

                    <span className="text-sm font-semibold text-[#b9c8de]">
                      {roleMatch}%
                    </span>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-[#292929]">

                    <div
                      className="h-full rounded-full bg-[#b9c8de] transition-all duration-700"
                      style={{
                        width: `${clampPercentage(
                          roleMatch
                        )}%`,
                      }}
                    />

                  </div>

                </div>

              )}


              {/* REAL INSIGHT */}

              <div className="mt-8 rounded-2xl border border-white/5 bg-[#181818] p-5">

                <div className="flex items-start gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#24352d] text-[#b9dfc8]">
                    ✓
                  </div>

                  <div>

                    <p className="font-semibold">
                      Latest analysis available
                    </p>

                    <p className="mt-1 text-sm leading-6 text-[#8f9394]">
                      Your dashboard is displaying results returned
                      by your actual resume analysis and Match Engine.
                    </p>

                  </div>

                </div>

              </div>

            </section>


            {/* =================================================
                SKILL GAPS
            ================================================= */}

            <section className="rounded-3xl border border-white/10 bg-[#111111] p-8">

              <p className="text-xs font-semibold tracking-[0.12em] text-[#a7b6cc]">
                SKILL GAPS
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                Areas to improve
              </h2>

              {Array.isArray(missingSkills) &&
              missingSkills.length > 0 ? (

                <div className="mt-6 space-y-3">

                  {missingSkills
                    .slice(0, 6)
                    .map((skill, index) => (

                      <div
                        key={`${skill}-${index}`}
                        className="rounded-xl border border-white/5 bg-[#181818] p-4"
                      >
                        <p className="text-sm font-semibold text-white">
                          {typeof skill === "string"
                            ? skill
                            : skill?.name ||
                              skill?.skill ||
                              "Skill gap"}
                        </p>
                      </div>

                    ))}

                </div>

              ) : (

                <div className="mt-6 rounded-xl border border-white/5 bg-[#181818] p-5">

                  <p className="text-sm text-[#8f9394]">
                    No skill gaps were returned by the current
                    analysis.
                  </p>

                </div>

              )}

            </section>

          </div>

        )}


        {/* =====================================================
            QUICK ACTIONS
        ===================================================== */}

        <section className="mt-8 rounded-3xl border border-white/10 bg-[#111111] p-8">

          <p className="text-xs font-semibold tracking-[0.12em] text-[#a7b6cc]">
            QUICK ACTIONS
          </p>

          <h2 className="mt-3 text-2xl font-semibold">
            Continue your journey
          </h2>

          <div className="mt-6 grid gap-3 md:grid-cols-2">

            <ActionLink
              to="/resume"
              title="Manage Resume"
              description="Upload and manage your real resume"
            />

            <ActionLink
              to="/resume-analysis"
              title="Analyze Resume"
              description="View your resume analysis"
            />

            <ActionLink
              to="/role-matches"
              title="Find Role Matches"
              description="Discover roles compatible with your profile"
            />

            <ActionLink
              to="/skill-lab"
              title="Improve Skills"
              description="Work on identified skill gaps"
            />

          </div>

        </section>


        {/* =====================================================
            RECOMMENDED NEXT STEP
        ===================================================== */}

        {hasMatchData && (

          <section className="mt-8 rounded-3xl border border-white/10 bg-[#111111] p-8">

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

              <div>

                <p className="text-xs font-semibold tracking-[0.12em] text-[#a7b6cc]">
                  RECOMMENDED NEXT STEP
                </p>

                <h2 className="mt-3 text-2xl font-semibold">
                  {missingSkills.length > 0
                    ? "Improve your identified skill gaps"
                    : "Continue improving your profile"}
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-[#c4c7c8]">
                  {missingSkills.length > 0
                    ? `Your analysis identified ${missingSkills.length} skill gap${
                        missingSkills.length === 1
                          ? ""
                          : "s"
                      }. Work on these areas to improve your role compatibility.`
                    : "Keep your resume and professional profile up to date."}
                </p>

              </div>

              <Link
                to="/skill-lab"
                className="shrink-0 rounded-lg bg-[#d4e4fa] px-5 py-3 text-center text-sm font-semibold text-[#171717] transition hover:bg-white"
              >
                Open Skill Lab
              </Link>

            </div>

          </section>

        )}


        {/* =====================================================
            APPLICATIONS
        ===================================================== */}

        <section className="mt-8 rounded-3xl border border-white/10 bg-[#111111] p-8">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs font-semibold tracking-[0.12em] text-[#a7b6cc]">
                APPLICATIONS
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                Application tracking
              </h2>

            </div>

            <Link
              to="/applications"
              className="text-sm font-semibold text-[#d4e4fa] hover:text-white"
            >
              View all
            </Link>

          </div>

          <div className="mt-6 rounded-xl border border-white/5 bg-[#181818] p-5">

            <p className="text-sm text-[#8f9394]">
              No application records are loaded yet.
            </p>

            <Link
              to="/applications"
              className="mt-3 inline-block text-sm font-semibold text-[#d4e4fa] hover:text-white"
            >
              Open Applications →
            </Link>

          </div>

        </section>


        {/* =====================================================
            FINAL CTA
        ===================================================== */}

        <section className="mt-8 rounded-3xl border border-white/10 bg-[#111111] p-8 text-center">

          <p className="text-xs font-semibold tracking-[0.12em] text-[#a7b6cc]">
            CAREER ENGINE
          </p>

          <h2 className="mt-3 text-3xl font-semibold">
            Ready to discover your best-fit roles?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl leading-7 text-[#8f9394]">
            Upload your resume and run the Match Engine to
            generate personalized career results.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">

            <Link
              to="/candidate/match-engine"
              className="rounded-lg bg-[#d4e4fa] px-6 py-3 text-sm font-semibold text-[#171717] transition hover:bg-white"
            >
              Find My Matches
            </Link>

            <Link
              to="/profile"
              className="rounded-lg border border-white/10 px-6 py-3 text-sm font-semibold text-[#c4c7c8] transition hover:bg-white/5 hover:text-white"
            >
              Update Profile
            </Link>

          </div>

        </section>


        <div className="h-10" />

      </div>

    </div>
  );
}


// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111111] p-6">

      <p className="text-xs font-semibold tracking-wide text-[#8f9394]">
        {label}
      </p>

      <div className="mt-4 text-4xl font-bold text-[#b9c8de]">
        {value}
      </div>

      <p className="mt-2 text-sm text-[#a7b6cc]">
        {description}
      </p>

    </div>
  );
}


// ============================================================
// ACTION LINK
// ============================================================

function ActionLink({
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


// ============================================================
// SCORE DESCRIPTION
// ============================================================

function getScoreDescription(score) {
  const value = Number(score);

  if (value >= 85) {
    return "Excellent";
  }

  if (value >= 70) {
    return "Strong";
  }

  if (value >= 50) {
    return "Moderate";
  }

  return "Needs improvement";
}


// ============================================================
// MATCH DESCRIPTION
// ============================================================

function getMatchDescription(score) {
  const value = Number(score);

  if (value >= 85) {
    return "Excellent match";
  }

  if (value >= 70) {
    return "Strong match";
  }

  if (value >= 50) {
    return "Potential match";
  }

  return "Low compatibility";
}


// ============================================================
// SAFE PERCENTAGE
// ============================================================

function clampPercentage(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(100, number)
  );
}