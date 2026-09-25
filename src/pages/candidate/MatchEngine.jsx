import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { API_URL } from "../../lib/config";

export default function MatchEngine() {
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMatchEngine();
  }, []);

  async function loadMatchEngine() {
    try {
      setLoading(true);
      setError("");

      // ---------------------------------------------
      // AUTH TOKEN
      // ---------------------------------------------

      const token =
        localStorage.getItem("careerEngineToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("authToken");

      if (!token) {
        throw new Error(
          "Your login session has expired. Please sign in again."
        );
      }

      // ---------------------------------------------
      // RESUME ID
      // ---------------------------------------------

      let resumeId = location.state?.resumeId;

      if (!resumeId) {
        resumeId =
          localStorage.getItem("selectedResumeId");
      }

      if (!resumeId) {
        resumeId =
          localStorage.getItem("resumeId");
      }

      if (!resumeId) {
        throw new Error(
          "No resume selected. Please upload a resume before running the Match Engine."
        );
      }

      // ---------------------------------------------
      // CALL REAL MATCH ENGINE
      // ---------------------------------------------

      const response = await fetch(
        `${API_URL}/api/match-engine/resume/${resumeId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      // ---------------------------------------------
      // READ RESPONSE SAFELY
      // ---------------------------------------------

      const contentType =
        response.headers.get("content-type") || "";

      let result;

      if (contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();

        throw new Error(
          `Backend returned a non-JSON response (${response.status}). ${
            text.slice(0, 120) || "Please check that the backend is running."
          }`
        );
      }

      // ---------------------------------------------
      // BACKEND ERROR
      // ---------------------------------------------

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `Match Engine request failed with status ${response.status}.`
        );
      }

      if (!result?.success) {
        throw new Error(
          result?.message ||
            "The Match Engine could not generate results."
        );
      }

      if (!result?.matchEngine) {
        throw new Error(
          "The backend responded successfully, but no Match Engine result was returned."
        );
      }

      // ---------------------------------------------
      // REAL RESULT
      // ---------------------------------------------

      const matchEngine = result.matchEngine;

      setData(matchEngine);

      // ---------------------------------------------
      // SAVE REAL RESULT FOR DASHBOARD
      // ---------------------------------------------

      localStorage.setItem(
        "careerEngineMatchResult",
        JSON.stringify(matchEngine)
      );

      // Also remember which resume generated this result.
      localStorage.setItem(
        "selectedResumeId",
        String(resumeId)
      );

    } catch (err) {
      console.error("Match Engine error:", err);

      setError(
        err?.message ||
          "Something went wrong while generating your career matches."
      );
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141313] px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl">

          <div className="animate-pulse">

            <div className="h-5 w-32 rounded bg-white/10" />

            <div className="mt-8 h-10 w-72 rounded bg-white/10" />

            <div className="mt-3 h-5 w-96 rounded bg-white/10" />

            <div className="mt-10 grid gap-5 md:grid-cols-3">

              <div className="h-32 rounded-3xl bg-white/5" />

              <div className="h-32 rounded-3xl bg-white/5" />

              <div className="h-32 rounded-3xl bg-white/5" />

            </div>

            <div className="mt-6 h-72 rounded-3xl bg-white/5" />

          </div>

        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="min-h-screen bg-[#141313] px-6 py-10 text-white">

        <div className="mx-auto max-w-3xl">

          <Link
            to="/resume"
            className="text-sm text-[#9ca8b8] hover:text-white"
          >
            ← Back to Resume
          </Link>

          <div className="mt-10 rounded-3xl border border-red-500/20 bg-red-500/5 p-8">

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-300">
              MATCH ENGINE ERROR
            </p>

            <h1 className="mt-3 text-2xl font-semibold">
              Match Engine couldn't start
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#b0b0b0]">
              {error}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">

              <button
                onClick={loadMatchEngine}
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Try Again
              </button>

              <Link
                to="/resume"
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                Go to Resume
              </Link>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // ============================================================
  // NO DATA
  // ============================================================

  if (!data) {
    return (
      <div className="min-h-screen bg-[#141313] px-6 py-10 text-white">

        <div className="mx-auto max-w-3xl">

          <h1 className="text-2xl font-semibold">
            No Match Engine result
          </h1>

          <p className="mt-3 text-[#8f9394]">
            The backend did not return a career analysis.
          </p>

          <Link
            to="/resume"
            className="mt-6 inline-block rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black"
          >
            Return to Resume
          </Link>

        </div>

      </div>
    );
  }

  // ============================================================
  // REAL DATA
  // ============================================================

  const candidate = data.candidate || {};
  const bestMatch = data.bestMatch || {};
  const matches = Array.isArray(data.matches)
    ? data.matches
    : [];
  const roadmap = Array.isArray(data.roadmap)
    ? data.roadmap
    : [];

  const profileScore =
    candidate.profileScore ?? null;

  const skillCount =
    candidate.skillCount ??
    (Array.isArray(candidate.skills)
      ? candidate.skills.length
      : null);

  const matchPercentage =
    bestMatch.matchPercentage ?? null;

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="min-h-screen bg-[#141313] px-6 py-10 text-white">

      <div className="mx-auto max-w-6xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

          <div>

            <Link
              to="/resume"
              className="text-sm text-[#9ca8b8] transition hover:text-white"
            >
              ← Resume
            </Link>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight">
              Match Engine
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#929292]">
              Your resume has been analyzed against the
              available career roles using your detected
              skills and profile information.
            </p>

          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">

            <p className="text-xs uppercase tracking-wider text-[#777]">
              Resume
            </p>

            <p className="mt-1 max-w-[240px] truncate text-sm font-medium text-white">
              {data.resumeName || "Uploaded Resume"}
            </p>

          </div>

        </div>

        {/* =====================================================
            PROFILE METRICS
        ===================================================== */}

        <div className="mt-10 grid gap-4 md:grid-cols-3">

          <MetricCard
            label="Profile Strength"
            value={
              profileScore !== null
                ? `${profileScore}%`
                : "—"
            }
            description="Calculated from your resume"
          />

          <MetricCard
            label="Skills Detected"
            value={
              skillCount !== null
                ? skillCount
                : "—"
            }
            description="Extracted from your resume"
          />

          <MetricCard
            label="Top Career Match"
            value={
              matchPercentage !== null
                ? `${matchPercentage}%`
                : "—"
            }
            description={
              bestMatch.title ||
              "No role match returned"
            }
          />

        </div>

        {/* =====================================================
            BEST MATCH
        ===================================================== */}

        <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[#101010]">

          <div className="p-7 md:p-9">

            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#77869b]">
                  Best career match
                </p>

                <h2 className="mt-3 text-3xl font-semibold">
                  {bestMatch.title ||
                    "No role matched"}
                </h2>

                {bestMatch.category && (
                  <p className="mt-2 text-sm text-[#777]">
                    {bestMatch.category}
                  </p>
                )}

              </div>

              <div className="text-left md:text-right">

                <div className="text-5xl font-semibold tracking-tight text-[#c8d4e5]">
                  {matchPercentage !== null
                    ? `${matchPercentage}%`
                    : "—"}
                </div>

                <p className="mt-1 text-xs uppercase tracking-wider text-[#666]">
                  Match score
                </p>

              </div>

            </div>

            {/* MATCH BAR */}

            {matchPercentage !== null && (
              <div className="mt-8">

                <div className="h-2 overflow-hidden rounded-full bg-white/10">

                  <div
                    className="h-full rounded-full bg-[#b9c8de] transition-all duration-700"
                    style={{
                      width: `${clampPercentage(
                        matchPercentage
                      )}%`,
                    }}
                  />

                </div>

              </div>
            )}

            {/* WHY MATCH */}

            <div className="mt-8">

              <h3 className="text-sm font-semibold">
                Why you're a match
              </h3>

              <div className="mt-4 space-y-3">

                {Array.isArray(
                  bestMatch.whyYouMatch
                ) &&
                bestMatch.whyYouMatch.length > 0 ? (
                  bestMatch.whyYouMatch.map(
                    (reason, index) => (
                      <div
                        key={index}
                        className="flex gap-3 text-sm leading-6 text-[#b0b0b0]"
                      >

                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#b9c8de]" />

                        <span>
                          {reason}
                        </span>

                      </div>
                    )
                  )
                ) : (
                  <p className="text-sm text-[#666]">
                    No match explanation was returned.
                  </p>
                )}

              </div>

            </div>

            {/* MATCHED SKILLS */}

            <SkillSection
              title="Skills you already have"
              skills={
                Array.isArray(
                  bestMatch.matchedSkills
                )
                  ? bestMatch.matchedSkills
                  : []
              }
              positive
            />

            {/* MISSING SKILLS */}

            <SkillSection
              title="Skills that can improve your match"
              skills={
                Array.isArray(
                  bestMatch.missingSkills
                )
                  ? bestMatch.missingSkills
                  : []
              }
            />

          </div>

        </section>

        {/* =====================================================
            ALL ROLE MATCHES
        ===================================================== */}

        <section className="mt-6">

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#77869b]">
            Career paths
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Your role matches
          </h2>

          {matches.length > 0 ? (

            <div className="mt-5 grid gap-4 md:grid-cols-2">

              {matches.map((match, index) => (
                <RoleCard
                  key={
                    match.roleId ||
                    match._id ||
                    `${match.title}-${index}`
                  }
                  match={match}
                />
              ))}

            </div>

          ) : (

            <div className="mt-5 rounded-3xl border border-white/10 bg-[#101010] p-7">

              <p className="text-sm text-[#777]">
                No additional career matches were returned
                by the Match Engine.
              </p>

            </div>

          )}

        </section>

        {/* =====================================================
            CAREER ROADMAP
        ===================================================== */}

        <section className="mt-6 rounded-3xl border border-white/10 bg-[#101010] p-7 md:p-9">

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#77869b]">
            Personalized roadmap
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Your next best steps
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#777]">
            Focus on the areas returned by your resume
            analysis to strengthen your compatibility
            with your target roles.
          </p>

          {roadmap.length > 0 ? (

            <div className="mt-8 space-y-4">

              {roadmap.map((item, index) => (

                <div
                  key={
                    item.step ||
                    item.skill ||
                    index
                  }
                  className="flex gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                >

                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                    {item.step || index + 1}
                  </div>

                  <div>

                    <h3 className="text-sm font-semibold">
                      {formatSkill(
                        item.skill || ""
                      )}
                    </h3>

                    {item.reason && (
                      <p className="mt-1 text-sm leading-6 text-[#777]">
                        {item.reason}
                      </p>
                    )}

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5">

              <p className="text-sm text-[#666]">
                No roadmap recommendations were returned
                by the current analysis.
              </p>

            </div>

          )}

        </section>

        {/* =====================================================
            DETECTED PROFILE
        ===================================================== */}

        <section className="mt-6 grid gap-6 md:grid-cols-2">

          {/* SKILLS */}

          <div className="rounded-3xl border border-white/10 bg-[#101010] p-7">

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#77869b]">
              Detected skills
            </p>

            {Array.isArray(candidate.skills) &&
            candidate.skills.length > 0 ? (

              <div className="mt-5 flex flex-wrap gap-2">

                {candidate.skills.map(
                  (skill, index) => (

                    <span
                      key={`${skill}-${index}`}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-[#c4c7c8]"
                    >
                      {formatSkill(skill)}
                    </span>

                  )
                )}

              </div>

            ) : (

              <p className="mt-5 text-sm text-[#666]">
                No skills were detected.
              </p>

            )}

          </div>

          {/* SIGNALS */}

          <div className="rounded-3xl border border-white/10 bg-[#101010] p-7">

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#77869b]">
              Resume signals
            </p>

            <div className="mt-5 space-y-4">

              <Signal
                label="Experience"
                value={
                  candidate.experienceYears !==
                  undefined &&
                  candidate.experienceYears !==
                  null
                    ? `${candidate.experienceYears} years`
                    : "Not detected"
                }
              />

              <Signal
                label="Education"
                value={
                  Array.isArray(
                    candidate.education
                  ) &&
                  candidate.education.length > 0
                    ? "Detected"
                    : "Not detected"
                }
              />

              <Signal
                label="Projects"
                value={
                  candidate.hasProjects
                    ? "Detected"
                    : "Not detected"
                }
              />

              <Signal
                label="Achievements"
                value={
                  Array.isArray(
                    candidate.achievements
                  ) &&
                  candidate.achievements.length > 0
                    ? `${candidate.achievements.length} detected`
                    : "Not detected"
                }
              />

            </div>

          </div>

        </section>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div className="mt-10 flex flex-wrap justify-center gap-3 pb-10">

          <Link
            to="/resume"
            className="rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            Analyze another resume
          </Link>

          <Link
            to="/candidate-dashboard"
            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Back to Dashboard
          </Link>

        </div>

      </div>

    </div>
  );
}


// ============================================================
// METRIC CARD
// ============================================================

function MetricCard({
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#101010] p-6">

      <p className="text-xs uppercase tracking-[0.16em] text-[#666]">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold text-[#d4dce8]">
        {value}
      </p>

      <p className="mt-2 text-xs text-[#666]">
        {description}
      </p>

    </div>
  );
}


// ============================================================
// ROLE CARD
// ============================================================

function RoleCard({ match }) {
  const percentage =
    match.matchPercentage ?? null;

  return (
    <div className="rounded-3xl border border-white/10 bg-[#101010] p-6">

      <div className="flex items-start justify-between gap-5">

        <div>

          <h3 className="text-lg font-semibold">
            {match.title || "Untitled role"}
          </h3>

          {match.category && (
            <p className="mt-1 text-xs text-[#666]">
              {match.category}
            </p>
          )}

        </div>

        <div className="text-right">

          <div className="text-2xl font-semibold text-[#c8d4e5]">
            {percentage !== null
              ? `${percentage}%`
              : "—"}
          </div>

          <p className="text-[10px] uppercase tracking-wider text-[#666]">
            match
          </p>

        </div>

      </div>

      {percentage !== null && (
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">

          <div
            className="h-full rounded-full bg-[#8797ad]"
            style={{
              width: `${clampPercentage(
                percentage
              )}%`,
            }}
          />

        </div>
      )}

      <div className="mt-5">

        <p className="text-xs uppercase tracking-wider text-[#666]">
          Strong skills
        </p>

        <div className="mt-3 flex flex-wrap gap-2">

          {Array.isArray(
            match.matchedSkills
          ) &&
          match.matchedSkills.length > 0 ? (

            match.matchedSkills
              .slice(0, 5)
              .map((skill, index) => (

                <span
                  key={`${skill}-${index}`}
                  className="rounded-full bg-white/5 px-2.5 py-1.5 text-[11px] text-[#a9a9a9]"
                >
                  {formatSkill(skill)}
                </span>

              ))

          ) : (

            <span className="text-xs text-[#666]">
              No matched skills returned
            </span>

          )}

        </div>

      </div>

    </div>
  );
}


// ============================================================
// SKILL SECTION
// ============================================================

function SkillSection({
  title,
  skills,
  positive = false,
}) {
  return (
    <div className="mt-8">

      <h3 className="text-sm font-semibold">
        {title}
      </h3>

      <div className="mt-4 flex flex-wrap gap-2">

        {Array.isArray(skills) &&
        skills.length > 0 ? (

          skills.map((skill, index) => (

            <span
              key={`${skill}-${index}`}
              className={
                positive
                  ? "rounded-full bg-white/10 px-3 py-2 text-xs text-[#cbd5e1]"
                  : "rounded-full border border-white/10 px-3 py-2 text-xs text-[#777]"
              }
            >
              {formatSkill(skill)}
            </span>

          ))

        ) : (

          <p className="text-sm text-[#666]">
            None detected.
          </p>

        )}

      </div>

    </div>
  );
}


// ============================================================
// SIGNAL
// ============================================================

function Signal({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-white/5 pb-3 last:border-0">

      <span className="text-sm text-[#777]">
        {label}
      </span>

      <span className="text-right text-sm font-medium text-[#c4c7c8]">
        {value}
      </span>

    </div>
  );
}


// ============================================================
// FORMAT SKILL
// ============================================================

function formatSkill(skill = "") {
  if (!skill) {
    return "";
  }

  const normalized =
    String(skill).trim().toLowerCase();

  const names = {
    "node.js": "Node.js",
    nodejs: "Node.js",
    "next.js": "Next.js",
    nextjs: "Next.js",
    "rest api": "REST API",
    "ci/cd": "CI/CD",
    "power bi": "Power BI",
    mongodb: "MongoDB",
    postgresql: "PostgreSQL",
    javascript: "JavaScript",
    typescript: "TypeScript",
    react: "React",
    tailwind: "Tailwind CSS",
    "tailwind css": "Tailwind CSS",
    kubernetes: "Kubernetes",
    aws: "AWS",
    gcp: "Google Cloud",
    sql: "SQL",
    html: "HTML",
    css: "CSS",
    git: "Git",
    docker: "Docker",
    python: "Python",
    java: "Java",
    testing: "Testing",
  };

  return (
    names[normalized] ||
    String(skill).replace(
      /\b\w/g,
      (char) => char.toUpperCase()
    )
  );
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