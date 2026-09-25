import React from "react";
import { Link } from "react-router-dom";

const cards = [
  ["CAREER READINESS", "—", "Complete your profile and resume to measure readiness."],
  ["CAREER PATHS", "Explore", "Discover career directions that fit your interests and skills."],
  ["INTERNSHIPS", "Browse", "Find opportunities and prepare for applications."],
  ["SKILL GAP", "Learn", "Turn missing skills into an actionable learning plan."],
];

export default function StudentDashboard() {
  let user = null;
  try { user = JSON.parse(localStorage.getItem("careerEngineUser") || "null"); } catch {}
  const name = user?.name || "Student";

  return (
    <div className="min-h-screen bg-[#141313] px-6 py-8 text-white md:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold tracking-[0.12em] text-[#a7b6cc]">STUDENT DASHBOARD</p>
        <h1 className="mt-3 text-4xl font-semibold md:text-5xl">Welcome, {name}</h1>
        <p className="mt-3 max-w-2xl text-[#c4c7c8]">Build career readiness, explore career paths, discover internships and grow the skills you need next.</p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(([label, value, description]) => (
            <div key={label} className="rounded-3xl border border-white/10 bg-[#111111] p-6">
              <p className="text-xs font-semibold tracking-[0.12em] text-[#a7b6cc]">{label}</p>
              <div className="mt-4 text-2xl font-semibold">{value}</div>
              <p className="mt-2 text-sm leading-6 text-[#8f9394]">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <ActionCard title="Build your profile" text="Add your education, experience and target interests." to="/profile" action="Open Profile" />
          <ActionCard title="Work on your skills" text="Use the Skill Lab to turn skill gaps into concrete next steps." to="/skill-lab" action="Open Skill Lab" />
          <ActionCard title="Prepare your resume" text="Upload your resume and review AI analysis when available." to="/resume" action="Manage Resume" />
          <ActionCard title="Explore opportunities" text="Browse jobs and use role matching to understand fit." to="/jobs" action="Explore Jobs" />
        </div>
      </div>
    </div>
  );
}

function ActionCard({ title, text, to, action }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#111111] p-7">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[#8f9394]">{text}</p>
      <Link to={to} className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#d4e4fa] px-5 py-3 text-sm font-semibold !text-[#171717] transition-all hover:bg-[#bcd3f0] hover:!text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#d4e4fa] focus:ring-offset-2 focus:ring-offset-[#111111]">{action}</Link>
    </section>
  );
}
