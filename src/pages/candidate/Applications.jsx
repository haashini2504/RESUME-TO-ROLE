import React, { useState } from "react";
import { Link } from "react-router-dom";

const initialApplications = [
  {
    id: 1,
    company: "TechNova",
    role: "Frontend Developer",
    location: "Bengaluru, India",
    date: "Aug 12, 2026",
    status: "Interview",
  },
  {
    id: 2,
    company: "Digital Labs",
    role: "React Developer",
    location: "Remote",
    date: "Aug 10, 2026",
    status: "Applied",
  },
  {
    id: 3,
    company: "Product Studio",
    role: "Frontend Engineer",
    location: "Chennai, India",
    date: "Aug 08, 2026",
    status: "Under Review",
  },
  {
    id: 4,
    company: "CloudWorks",
    role: "UI Engineer",
    location: "Hyderabad, India",
    date: "Aug 05, 2026",
    status: "Saved",
  },
];

export default function Applications() {
  const [applications, setApplications] = useState(
    initialApplications
  );

  const [filter, setFilter] = useState("All");

  const filteredApplications =
    filter === "All"
      ? applications
      : applications.filter(
          (application) => application.status === filter
        );

  const updateStatus = (id, status) => {
    setApplications((current) =>
      current.map((application) =>
        application.id === id
          ? { ...application, status }
          : application
      )
    );
  };

  const deleteApplication = (id) => {
    setApplications((current) =>
      current.filter((application) => application.id !== id)
    );
  };

  return (
    <div className="min-h-screen bg-[#141313] px-6 py-8 text-white md:px-10">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>
            <p className="text-xs font-semibold tracking-[0.12em] text-[#a7b6cc]">
              APPLICATIONS
            </p>

            <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
              Track your applications
            </h1>

            <p className="mt-3 max-w-2xl text-[#c4c7c8]">
              Keep your job search organized and monitor every
              opportunity from one place.
            </p>
          </div>

          <Link
            to="/role-matches"
            className="rounded-lg bg-[#d4e4fa] px-5 py-3 text-center text-sm font-semibold text-[#171717] transition hover:bg-white"
          >
            Find New Roles
          </Link>

        </div>


        {/* STATS */}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <ApplicationStat
            label="TOTAL"
            value={applications.length}
          />

          <ApplicationStat
            label="APPLIED"
            value={
              applications.filter(
                (item) => item.status === "Applied"
              ).length
            }
          />

          <ApplicationStat
            label="INTERVIEWS"
            value={
              applications.filter(
                (item) => item.status === "Interview"
              ).length
            }
          />

          <ApplicationStat
            label="UNDER REVIEW"
            value={
              applications.filter(
                (item) => item.status === "Under Review"
              ).length
            }
          />

        </div>


        {/* FILTER */}

        <section className="mt-8 rounded-3xl border border-white/10 bg-[#111111] p-6">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>

              <h2 className="text-xl font-semibold">
                Application pipeline
              </h2>

              <p className="mt-1 text-sm text-[#8f9394]">
                {filteredApplications.length} application
                {filteredApplications.length !== 1 ? "s" : ""}
                {" "}shown
              </p>

            </div>

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-lg border border-white/10 bg-[#202020] px-4 py-3 text-sm text-white outline-none"
            >
              <option value="All">All Applications</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Under Review">Under Review</option>
              <option value="Saved">Saved</option>
              <option value="Rejected">Rejected</option>
            </select>

          </div>

        </section>


        {/* APPLICATION LIST */}

        <div className="mt-6 space-y-5">

          {filteredApplications.length === 0 ? (
            <section className="rounded-3xl border border-white/10 bg-[#111111] p-12 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#202020] text-2xl">
                —
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                No applications found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8f9394]">
                Try another filter or explore new role matches.
              </p>

              <Link
                to="/role-matches"
                className="mt-6 inline-block rounded-lg bg-[#d4e4fa] px-5 py-3 text-sm font-semibold text-[#171717]"
              >
                Find Roles
              </Link>

            </section>
          ) : (
            filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onUpdate={updateStatus}
                onDelete={deleteApplication}
              />
            ))
          )}

        </div>


        {/* CTA */}

        <section className="mt-8 rounded-3xl border border-white/10 bg-[#111111] p-8">

          <p className="text-xs font-semibold tracking-[0.12em] text-[#a7b6cc]">
            KEEP GOING
          </p>

          <h2 className="mt-3 text-2xl font-semibold">
            Find your next opportunity
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-[#c4c7c8]">
            Explore roles that match your resume, experience, and
            current skill profile.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">

            <Link
              to="/role-matches"
              className="rounded-lg bg-[#d4e4fa] px-5 py-3 text-sm font-semibold text-[#171717] transition hover:bg-white"
            >
              Explore Role Matches
            </Link>

            <Link
              to="/resume-analysis"
              className="rounded-lg border border-white/10 px-5 py-3 text-sm font-semibold text-[#c4c7c8] transition hover:bg-white/5 hover:text-white"
            >
              Improve Resume
            </Link>

          </div>

        </section>

      </div>
    </div>
  );
}


/* =========================================
   APPLICATION CARD
========================================= */

function ApplicationCard({
  application,
  onUpdate,
  onDelete,
}) {
  return (
    <article className="rounded-3xl border border-white/10 bg-[#111111] p-7">

      <div className="flex flex-col justify-between gap-6 lg:flex-row">

        {/* INFO */}

        <div>

          <div className="flex flex-wrap items-center gap-3">

            <h2 className="text-2xl font-semibold">
              {application.role}
            </h2>

            <StatusBadge status={application.status} />

          </div>

          <p className="mt-2 font-medium text-[#c4c7c8]">
            {application.company}
          </p>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#8f9394]">

            <span>{application.location}</span>

            <span>
              Applied {application.date}
            </span>

          </div>

        </div>


        {/* ACTIONS */}

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">

          <select
            value={application.status}
            onChange={(event) =>
              onUpdate(application.id, event.target.value)
            }
            className="rounded-lg border border-white/10 bg-[#202020] px-4 py-3 text-sm text-white outline-none"
          >
            <option value="Saved">Saved</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
          </select>

          <button
            type="button"
            onClick={() => onDelete(application.id)}
            className="rounded-lg border border-red-500/10 px-4 py-3 text-sm font-semibold text-[#ffb4ab] transition hover:bg-red-950/20"
          >
            Remove
          </button>

        </div>

      </div>


      {/* PROGRESS */}

      <div className="mt-7">

        <div className="mb-3 flex justify-between">

          <span className="text-xs font-semibold tracking-wide text-[#8f9394]">
            APPLICATION PROGRESS
          </span>

          <span className="text-xs text-[#a7b6cc]">
            {getProgress(application.status)}%
          </span>

        </div>

        <div className="h-2 overflow-hidden rounded-full bg-[#292929]">

          <div
            className="h-full rounded-full bg-[#a7b6cc] transition-all"
            style={{
              width: `${getProgress(application.status)}%`,
            }}
          />

        </div>

      </div>

    </article>
  );
}


/* =========================================
   STATUS BADGE
========================================= */

function StatusBadge({ status }) {
  const positive =
    status === "Interview";

  const neutral =
    status === "Applied" ||
    status === "Under Review";

  const negative =
    status === "Rejected";

  let className =
    "rounded-full border px-3 py-1 text-xs font-semibold";

  if (positive) {
    className +=
      " border-[#31463a] bg-[#1d2b23] text-[#b9dfc8]";
  } else if (negative) {
    className +=
      " border-[#4a2929] bg-[#321d1d] text-[#ffb4ab]";
  } else if (neutral) {
    className +=
      " border-white/10 bg-[#202020] text-[#c4c7c8]";
  } else {
    className +=
      " border-white/10 bg-[#181818] text-[#8f9394]";
  }

  return (
    <span className={className}>
      {status}
    </span>
  );
}


/* =========================================
   STAT
========================================= */

function ApplicationStat({
  label,
  value,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111111] p-6">

      <p className="text-xs font-semibold tracking-wide text-[#8f9394]">
        {label}
      </p>

      <p className="mt-4 text-4xl font-bold text-[#b9c8de]">
        {value}
      </p>

    </div>
  );
}


/* =========================================
   PROGRESS
========================================= */

function getProgress(status) {
  switch (status) {
    case "Saved":
      return 20;

    case "Applied":
      return 40;

    case "Under Review":
      return 60;

    case "Interview":
      return 85;

    case "Rejected":
      return 100;

    default:
      return 0;
  }
}