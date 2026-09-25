import React, { useState } from "react";
import { Link } from "react-router-dom";

const initialSkills = [
  {
    name: "React",
    level: "Advanced",
    progress: 92,
    category: "Frontend",
    status: "Strong",
  },
  {
    name: "JavaScript",
    level: "Advanced",
    progress: 88,
    category: "Frontend",
    status: "Strong",
  },
  {
    name: "Next.js",
    level: "Advanced",
    progress: 90,
    category: "Frontend",
    status: "Strong",
  },
  {
    name: "TypeScript",
    level: "Intermediate",
    progress: 65,
    category: "Frontend",
    status: "Improve",
  },
  {
    name: "Testing",
    level: "Beginner",
    progress: 30,
    category: "Quality",
    status: "Priority",
  },
  {
    name: "GraphQL",
    level: "Beginner",
    progress: 25,
    category: "Backend",
    status: "Priority",
  },
];

const learningPaths = [
  {
    title: "TypeScript Mastery",
    description:
      "Strengthen type safety, generics, interfaces, and advanced TypeScript patterns.",
    duration: "4 weeks",
    impact: "High",
  },
  {
    title: "Frontend Testing",
    description:
      "Learn unit, integration, and component testing for production applications.",
    duration: "3 weeks",
    impact: "High",
  },
  {
    title: "GraphQL Fundamentals",
    description:
      "Build confidence with queries, mutations, schemas, and API integration.",
    duration: "2 weeks",
    impact: "Medium",
  },
];

export default function SkillLab() {
  const [skills, setSkills] = useState(initialSkills);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    ...new Set(skills.map((skill) => skill.category)),
  ];

  const filteredSkills =
    category === "All"
      ? skills
      : skills.filter((skill) => skill.category === category);

  const markImproved = (skillName) => {
    setSkills((current) =>
      current.map((skill) =>
        skill.name === skillName
          ? {
              ...skill,
              progress: Math.min(skill.progress + 10, 100),
              level:
                skill.progress + 10 >= 80
                  ? "Advanced"
                  : skill.progress + 10 >= 50
                  ? "Intermediate"
                  : "Beginner",
              status:
                skill.progress + 10 >= 80
                  ? "Strong"
                  : "Improve",
            }
          : skill
      )
    );

    setSelectedSkill(null);
  };

  return (
    <div className="min-h-screen bg-[#141313] px-6 py-8 text-white md:px-10">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>
            <p className="text-xs font-semibold tracking-[0.12em] text-[#a7b6cc]">
              SKILL LAB
            </p>

            <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
              Build the skills that matter
            </h1>

            <p className="mt-3 max-w-2xl text-[#c4c7c8]">
              Focus on the skills that can make the biggest difference
              to your career and role-match score.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="rounded-lg border border-white/10 px-5 py-3 text-center text-sm font-semibold transition hover:bg-white/5"
          >
            ← Dashboard
          </Link>

        </div>


        {/* SKILL SUMMARY */}

        <div className="mt-10 grid gap-5 md:grid-cols-3">

          <SummaryCard
            label="SKILLS TRACKED"
            value={skills.length}
            description="Across your profile"
          />

          <SummaryCard
            label="STRONG SKILLS"
            value={
              skills.filter(
                (skill) => skill.status === "Strong"
              ).length
            }
            description="Already performing well"
          />

          <SummaryCard
            label="PRIORITY SKILLS"
            value={
              skills.filter(
                (skill) => skill.status === "Priority"
              ).length
            }
            description="Highest impact gaps"
          />

        </div>


        {/* AI RECOMMENDATION */}

        <section className="mt-8 rounded-3xl border border-white/10 bg-[#111111] p-8">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

            <div>

              <p className="text-xs font-semibold tracking-[0.12em] text-[#a7b6cc]">
                AI RECOMMENDATION
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                Start with Testing
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-[#c4c7c8]">
                Testing is currently your biggest skill gap. Improving
                it could increase your compatibility with several
                frontend engineering roles.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setSelectedSkill(
                  skills.find(
                    (skill) => skill.name === "Testing"
                  )
                )
              }
              className="shrink-0 rounded-lg bg-[#d4e4fa] px-5 py-3 text-sm font-semibold text-[#171717] transition hover:bg-white"
            >
              Start Learning
            </button>

          </div>

        </section>


        {/* SKILL FILTER */}

        <div className="mt-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h2 className="text-2xl font-semibold">
              Your skills
            </h2>

            <p className="mt-1 text-sm text-[#8f9394]">
              Track your current capability and improvement areas.
            </p>
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-lg border border-white/10 bg-[#202020] px-4 py-3 text-sm text-white outline-none"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

        </div>


        {/* SKILL LIST */}

        <div className="mt-6 grid gap-5 md:grid-cols-2">

          {filteredSkills.map((skill) => (
            <SkillCard
              key={skill.name}
              skill={skill}
              onClick={() => setSelectedSkill(skill)}
            />
          ))}

        </div>


        {/* LEARNING PATHS */}

        <section className="mt-10">

          <div>

            <p className="text-xs font-semibold tracking-[0.12em] text-[#a7b6cc]">
              LEARNING PATHS
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              Recommended learning
            </h2>

            <p className="mt-2 text-[#8f9394]">
              Focused paths based on your current skill gaps.
            </p>

          </div>


          <div className="mt-6 grid gap-5 md:grid-cols-3">

            {learningPaths.map((path) => (
              <LearningCard
                key={path.title}
                path={path}
              />
            ))}

          </div>

        </section>


        {/* CAREER CTA */}

        <section className="mt-10 rounded-3xl border border-white/10 bg-[#111111] p-8">

          <p className="text-xs font-semibold tracking-[0.12em] text-[#a7b6cc]">
            NEXT STEP
          </p>

          <h2 className="mt-3 text-2xl font-semibold">
            See how your skills affect your opportunities
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-[#c4c7c8]">
            Run the Match Engine after improving your skills to see
            how your role compatibility changes.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">

            <Link
              to="/candidate/match-engine"
              className="rounded-lg bg-[#d4e4fa] px-5 py-3 text-sm font-semibold text-[#171717] transition hover:bg-white"
            >
              Run Match Engine
            </Link>

            <Link
              to="/role-matches"
              className="rounded-lg border border-white/10 px-5 py-3 text-sm font-semibold text-[#c4c7c8] transition hover:bg-white/5 hover:text-white"
            >
              View Role Matches
            </Link>

          </div>

        </section>

      </div>


      {/* SKILL MODAL */}

      {selectedSkill && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-6 py-8">

          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/10 bg-[#111111] p-8 shadow-2xl">

            <div className="flex items-start justify-between gap-5">

              <div>

                <p className="text-xs font-semibold tracking-[0.12em] text-[#a7b6cc]">
                  SKILL DEVELOPMENT
                </p>

                <h2 className="mt-3 text-3xl font-semibold">
                  {selectedSkill.name}
                </h2>

                <p className="mt-2 text-[#8f9394]">
                  {selectedSkill.category}
                </p>

              </div>

              <button
                type="button"
                onClick={() => setSelectedSkill(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-xl text-[#8f9394] hover:bg-white/5 hover:text-white"
              >
                ×
              </button>

            </div>


            <div className="mt-8 rounded-2xl border border-white/5 bg-[#181818] p-5">

              <div className="flex items-center justify-between">

                <span className="text-sm text-[#8f9394]">
                  Current level
                </span>

                <span className="font-semibold text-[#b9c8de]">
                  {selectedSkill.level}
                </span>

              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#292929]">

                <div
                  className="h-full rounded-full bg-[#a7b6cc]"
                  style={{
                    width: `${selectedSkill.progress}%`,
                  }}
                />

              </div>

              <p className="mt-3 text-right text-sm text-[#a7b6cc]">
                {selectedSkill.progress}%
              </p>

            </div>


            <div className="mt-7">

              <p className="text-sm leading-7 text-[#c4c7c8]">
                Continue practicing {selectedSkill.name} through
                projects, hands-on exercises, and targeted learning.
                Improving this skill can strengthen your role matches.
              </p>

            </div>


            <div className="mt-8 flex flex-wrap gap-3">

              <button
                type="button"
                onClick={() =>
                  markImproved(selectedSkill.name)
                }
                className="rounded-lg bg-[#d4e4fa] px-5 py-3 text-sm font-semibold text-[#171717] transition hover:bg-white"
              >
                Mark Progress
              </button>

              <button
                type="button"
                onClick={() => setSelectedSkill(null)}
                className="rounded-lg border border-white/10 px-5 py-3 text-sm font-semibold text-[#c4c7c8] hover:bg-white/5"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}


/* =========================================
   SUMMARY CARD
========================================= */

function SummaryCard({
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111111] p-6">

      <p className="text-xs font-semibold tracking-wide text-[#8f9394]">
        {label}
      </p>

      <p className="mt-4 text-4xl font-bold text-[#b9c8de]">
        {value}
      </p>

      <p className="mt-2 text-sm text-[#a7b6cc]">
        {description}
      </p>

    </div>
  );
}


/* =========================================
   SKILL CARD
========================================= */

function SkillCard({
  skill,
  onClick,
}) {
  const priority =
    skill.status === "Priority";

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-3xl border border-white/10 bg-[#111111] p-7 text-left transition hover:border-white/20 hover:bg-[#151515]"
    >

      <div className="flex items-center justify-between gap-4">

        <div>

          <h3 className="text-xl font-semibold">
            {skill.name}
          </h3>

          <p className="mt-1 text-sm text-[#8f9394]">
            {skill.level} · {skill.category}
          </p>

        </div>

        <span
          className={
            priority
              ? "rounded-full border border-[#4a2929] bg-[#321d1d] px-3 py-1 text-xs font-semibold text-[#ffb4ab]"
              : "rounded-full border border-[#31463a] bg-[#1d2b23] px-3 py-1 text-xs font-semibold text-[#b9dfc8]"
          }
        >
          {skill.status}
        </span>

      </div>


      <div className="mt-6 flex items-center justify-between">

        <span className="text-xs text-[#8f9394]">
          Skill progress
        </span>

        <span className="text-sm font-semibold text-[#b9c8de]">
          {skill.progress}%
        </span>

      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#292929]">

        <div
          className={
            priority
              ? "h-full rounded-full bg-[#a36f6a]"
              : "h-full rounded-full bg-[#a7b6cc]"
          }
          style={{
            width: `${skill.progress}%`,
          }}
        />

      </div>

    </button>
  );
}


/* =========================================
   LEARNING CARD
========================================= */

function LearningCard({
  path,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111111] p-7">

      <div className="flex items-center justify-between gap-3">

        <span className="rounded-full border border-white/10 bg-[#202020] px-3 py-1 text-xs text-[#c4c7c8]">
          {path.duration}
        </span>

        <span className="text-xs font-semibold text-[#b9c8de]">
          {path.impact} Impact
        </span>

      </div>

      <h3 className="mt-6 text-xl font-semibold">
        {path.title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-[#8f9394]">
        {path.description}
      </p>

      <button
        type="button"
        className="mt-6 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-[#c4c7c8] transition hover:bg-white/5 hover:text-white"
      >
        Start Path
      </button>

    </div>
  );
}