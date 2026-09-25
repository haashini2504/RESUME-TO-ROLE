import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#141313] text-white">

      {/* NAVBAR */}

      <header className="border-b border-white/10 bg-[#141313]">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">

          <Link
            to="/"
            className="text-xl font-semibold tracking-tight"
          >
            Career Engine
          </Link>

          <div className="flex items-center gap-3">

            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-[#c4c7c8] transition hover:text-white"
            >
              Sign In
            </Link>

            <Link
              to="/login"
              className="rounded-lg bg-[#d4e4fa] px-5 py-2.5 text-sm font-semibold text-[#171717] transition hover:bg-white"
            >
              Get Started
            </Link>

          </div>

        </div>

      </header>


      {/* HERO */}

      <main>

        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">

          <div className="max-w-4xl">

            <p className="text-xs font-semibold tracking-[0.18em] text-[#a7b6cc]">
              AI-POWERED CAREER ENGINE
            </p>

            <h1 className="mt-6 text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
              Turn your resume into your next opportunity.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#c4c7c8]">
              Analyze your resume, discover your strongest career matches,
              identify skill gaps, and build a smarter path toward your
              target role.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              {/* GET STARTED → LOGIN */}

              <Link
                to="/login"
                className="rounded-lg bg-[#d4e4fa] px-7 py-3.5 text-sm font-semibold text-[#171717] transition hover:bg-white"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="rounded-lg border border-white/10 px-7 py-3.5 text-sm font-semibold text-[#c4c7c8] transition hover:border-white/20 hover:text-white"
              >
                Sign In
              </Link>

            </div>

          </div>


          {/* FEATURE CARDS */}

          <div className="mt-24 grid gap-5 md:grid-cols-3">

            <Feature
              number="01"
              title="Analyze Your Resume"
              description="Extract your skills, experience, education, and professional strengths."
            />

            <Feature
              number="02"
              title="Discover Role Matches"
              description="See how closely your profile matches the roles you want."
            />

            <Feature
              number="03"
              title="Close Skill Gaps"
              description="Get a clear learning path based on the requirements of your target roles."
            />

          </div>

        </section>


        {/* CTA */}

        <section className="border-t border-white/10">

          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">

            <div className="rounded-3xl border border-white/10 bg-[#111111] p-8 md:p-12">

              <p className="text-xs font-semibold tracking-[0.15em] text-[#a7b6cc]">
                START YOUR CAREER JOURNEY
              </p>

              <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
                Know where you stand.
                <br />
                Know what to do next.
              </h2>

              <p className="mt-4 max-w-2xl text-[#c4c7c8]">
                Build a stronger career profile with data-driven insights
                from your resume and target roles.
              </p>

              <Link
                to="/login"
                className="mt-8 inline-flex rounded-lg bg-[#d4e4fa] px-6 py-3 text-sm font-semibold text-[#171717] transition hover:bg-white"
              >
                Get Started
              </Link>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}


function Feature({
  number,
  title,
  description,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111] p-7">

      <div className="text-xs font-semibold tracking-[0.15em] text-[#8f9394]">
        {number}
      </div>

      <h2 className="mt-5 text-xl font-semibold">
        {title}
      </h2>

      <p className="mt-3 text-sm leading-6 text-[#c4c7c8]">
        {description}
      </p>

    </div>
  );
}