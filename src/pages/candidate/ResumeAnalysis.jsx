import React, { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import { API_URL } from "../../lib/config";

export default function ResumeAnalysis() {
  const { resumeId } = useParams();

  const [analysis, setAnalysis] = useState(null);
  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!resumeId) {
      setError("No resume selected.");
      setLoading(false);
      return;
    }

    loadAnalysis();
  }, [resumeId]);

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem(
        "careerEngineToken"
      );

      if (!token) {
        throw new Error(
          "Your session has expired. Please sign in again."
        );
      }

      const response = await fetch(
        `${API_URL}/api/analysis/resume/${resumeId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to analyze resume."
        );
      }

      setAnalysis(data.analysis);

      // Get resume details separately
      const resumeResponse = await fetch(
        `${API_URL}/api/resumes/${resumeId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resumeData =
        await resumeResponse.json();

      if (
        resumeResponse.ok &&
        resumeData.success
      ) {
        setResume(resumeData.resume);
      }
    } catch (error) {
      console.error(
        "Resume analysis error:",
        error
      );

      setError(
        error.message ||
          "Unable to analyze resume."
      );
    } finally {
      setLoading(false);
    }
  };


  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141313] px-6 py-8 text-white md:px-10">

        <div className="mx-auto max-w-6xl">

          <div className="flex min-h-[70vh] items-center justify-center">

            <div className="text-center">

              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#d4e4fa]" />

              <p className="mt-5 text-sm text-[#a7b6cc]">
                Analyzing your resume...
              </p>

              <p className="mt-2 text-xs text-[#666]">
                Reading your actual resume content
              </p>

            </div>

          </div>

        </div>

      </div>
    );
  }


  /* =========================================
     ERROR
  ========================================= */

  if (error) {
    return (
      <div className="min-h-screen bg-[#141313] px-6 py-8 text-white md:px-10">

        <div className="mx-auto max-w-6xl">

          <div className="flex min-h-[70vh] items-center justify-center">

            <div className="w-full max-w-lg rounded-3xl border border-red-500/20 bg-[#111111] p-8 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-300">
                !
              </div>

              <h1 className="mt-5 text-2xl font-semibold">
                Analysis Failed
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#a7b6cc]">
                {error}
              </p>

              <div className="mt-6 flex justify-center gap-3">

                <button
                  type="button"
                  onClick={loadAnalysis}
                  className="rounded-lg bg-[#d4e4fa] px-5 py-3 text-sm font-semibold text-[#171717] hover:bg-white"
                >
                  Try Again
                </button>

                <Link
                  to="/resume"
                  className="rounded-lg border border-white/10 px-5 py-3 text-sm font-semibold hover:bg-white/5"
                >
                  Back to Resume
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }


  if (!analysis) {
    return null;
  }


  const atsScore =
    Number(analysis.atsScore) || 0;

  const skillsFound =
    Number(analysis.skillsFound) || 0;

  const profileStrength =
    Number(analysis.profileStrength) || 0;

  const strengths =
    analysis.strengths || [];

  const improvements =
    analysis.improvements || [];

  const skills =
    analysis.skillAnalysis || [];


  return (
    <div className="min-h-screen bg-[#141313] px-6 py-8 text-white md:px-10">

      <div className="mx-auto max-w-6xl">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>

            <p className="text-xs font-semibold tracking-[0.12em] text-[#a7b6cc]">
              RESUME ANALYSIS
            </p>

            <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
              AI Profile Analysis
            </h1>

            <p className="mt-3 text-[#c4c7c8]">
              Analysis generated from your uploaded resume.
            </p>

            {resume?.fileName && (
              <p className="mt-2 text-sm text-[#777]">
                {resume.fileName}
              </p>
            )}

          </div>

          <Link
            to="/resume"
            className="rounded-lg border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5"
          >
            ← Back to Resume
          </Link>

        </div>


        {/* =====================================
            SCORE CARDS
        ===================================== */}

        <div className="mt-10 grid gap-5 md:grid-cols-3">

          <ScoreCard
            label="ATS SCORE"
            value={atsScore}
            description={
              atsScore >= 80
                ? "Strong compatibility"
                : atsScore >= 60
                ? "Good compatibility"
                : "Needs improvement"
            }
          />

          <ScoreCard
            label="SKILLS FOUND"
            value={skillsFound}
            description="Skills detected in your resume"
          />

          <ScoreCard
            label="PROFILE STRENGTH"
            value={`${profileStrength}%`}
            description={
              profileStrength >= 80
                ? "Strong profile"
                : profileStrength >= 60
                ? "Good profile"
                : "Needs improvement"
            }
          />

        </div>


        {/* =====================================
            AI INSIGHTS
        ===================================== */}

        <section className="mt-8 rounded-3xl border border-white/10 bg-[#111111] p-8">

          <p className="text-xs font-semibold tracking-[0.12em] text-[#a7b6cc]">
            AI INSIGHTS
          </p>

          <h2 className="mt-3 text-2xl font-semibold">
            Your Resume Performance
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-[#c4c7c8]">
            Your scores and insights below are calculated
            from the actual text extracted from your
            uploaded resume.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-[#181818] p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#24352d] text-[#b9dfc8]">
                ✓
              </div>

              <div>

                <p className="font-semibold">
                  Real resume analysis completed
                </p>

                <p className="mt-1 text-sm text-[#a7b6cc]">
                  {analysis.textLength || 0} characters
                  of resume content analyzed.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================
            STRENGTHS + IMPROVEMENTS
        ===================================== */}

        <div className="mt-8 grid gap-6 md:grid-cols-2">

          {/* STRENGTHS */}

          <section className="rounded-3xl border border-white/10 bg-[#111111] p-8">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#24352d] text-[#b9dfc8]">
                ✓
              </div>

              <h2 className="text-xl font-semibold">
                Strengths
              </h2>

            </div>

            <div className="mt-6 space-y-4">

              {strengths.length > 0 ? (
                strengths.map(
                  (item, index) => (
                    <InsightItem
                      key={index}
                      text={item}
                    />
                  )
                )
              ) : (
                <EmptyMessage>
                  No specific strengths were detected.
                </EmptyMessage>
              )}

            </div>

          </section>


          {/* IMPROVEMENTS */}

          <section className="rounded-3xl border border-white/10 bg-[#111111] p-8">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3a2020] text-[#ffb4ab]">
                !
              </div>

              <h2 className="text-xl font-semibold">
                Areas to Improve
              </h2>

            </div>

            <div className="mt-6 space-y-4">

              {improvements.length > 0 ? (
                improvements.map(
                  (item, index) => (
                    <ImproveItem
                      key={index}
                      text={item}
                    />
                  )
                )
              ) : (
                <EmptyMessage>
                  No major improvement areas detected.
                </EmptyMessage>
              )}

            </div>

          </section>

        </div>


        {/* =====================================
            SKILL ANALYSIS
        ===================================== */}

        <section className="mt-8 rounded-3xl border border-white/10 bg-[#111111] p-8">

          <p className="text-xs font-semibold tracking-[0.12em] text-[#a7b6cc]">
            SKILL ANALYSIS
          </p>

          <h2 className="mt-3 text-2xl font-semibold">
            Technical Skill Coverage
          </h2>

          {skills.length > 0 ? (
            <div className="mt-8 space-y-6">

              {skills.map(
                (skill, index) => (
                  <SkillBar
                    key={index}
                    name={skill.name}
                    level={skill.level}
                    progress={skill.progress}
                  />
                )
              )}

            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-white/10 bg-[#181818] p-8 text-center text-sm text-[#8f9394]">
              No recognized technical skills were
              detected in this resume.
            </div>
          )}

        </section>


        {/* =====================================
            RECOMMENDATION
        ===================================== */}

        <section className="mt-8 rounded-3xl border border-white/10 bg-[#111111] p-8">

          <p className="text-xs font-semibold tracking-[0.12em] text-[#a7b6cc]">
            AI RECOMMENDATION
          </p>

          <h2 className="mt-3 text-2xl font-semibold">
            Improve your highest-impact areas
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-[#c4c7c8]">
            {improvements.length > 0
              ? improvements[0]
              : "Your resume is currently showing good coverage. Continue strengthening measurable achievements and relevant technical skills."}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">

            <Link
              to="/skill-lab"
              className="rounded-lg bg-[#d4e4fa] px-5 py-3 text-sm font-semibold text-[#171717] transition hover:bg-white"
            >
              Explore Skill Lab
            </Link>

            <Link
              to="/role-matches"
              className="rounded-lg border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5"
            >
              View Role Matches
            </Link>

          </div>

        </section>

      </div>

    </div>
  );
}


/* =========================================
   SCORE CARD
========================================= */

function ScoreCard({
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111111] p-6">

      <p className="text-xs font-semibold tracking-wide text-[#8f9394]">
        {label}
      </p>

      <div className="mt-4 text-5xl font-bold text-[#b9c8de]">
        {value}
      </div>

      <p className="mt-2 text-sm text-[#a7b6cc]">
        {description}
      </p>

    </div>
  );
}


/* =========================================
   INSIGHT ITEM
========================================= */

function InsightItem({ text }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#181818] p-4">

      <span className="text-[#b9dfc8]">
        ✓
      </span>

      <span className="text-sm text-[#c4c7c8]">
        {text}
      </span>

    </div>
  );
}


/* =========================================
   IMPROVEMENT ITEM
========================================= */

function ImproveItem({ text }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#181818] p-4">

      <span className="text-[#ffb4ab]">
        •
      </span>

      <span className="text-sm text-[#c4c7c8]">
        {text}
      </span>

    </div>
  );
}


/* =========================================
   EMPTY
========================================= */

function EmptyMessage({ children }) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#181818] p-4 text-sm text-[#8f9394]">
      {children}
    </div>
  );
}


/* =========================================
   SKILL BAR
========================================= */

function SkillBar({
  name,
  level,
  progress,
}) {
  return (
    <div>

      <div className="mb-2 flex items-center justify-between">

        <div>

          <span className="font-medium">
            {name}
          </span>

          {level && (
            <span className="ml-3 text-xs text-[#8f9394]">
              {level}
            </span>
          )}

        </div>

        <span className="text-sm text-[#b9c8de]">
          {progress}%
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#292929]">

        <div
          className="h-full rounded-full bg-[#a7b6cc] transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

    </div>
  );
}