import React, { useEffect, useState } from "react";

import { API_URL } from "../lib/config";

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("careerEngineToken");

      const res = await fetch(`${API_URL}/api/jobs/by-recruiter/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load jobs.");
      }

      setJobs(data.jobs || []);
    } catch (err) {
      console.error("Recruiter dashboard error:", err);
      setError(err.message || "Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  const totalJobs = jobs ? jobs.length : 0;
  const activeJobs = jobs ? jobs.filter(j => j.status === "active").length : 0;
  const totalApplicants = jobs ? jobs.reduce((sum, j) => sum + (j.applicantCount || 0), 0) : 0;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Recruiter Dashboard</h1>

      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-400">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="rounded-xl bg-[var(--color-surface)] border border-white/6 p-4">
            <div className="text-sm text-[#c4c7c8]">Total Jobs</div>
            <div className="text-3xl font-semibold mt-2">{totalJobs}</div>
          </div>

          <div className="rounded-xl bg-[var(--color-surface)] border border-white/6 p-4">
            <div className="text-sm text-[#c4c7c8]">Active Jobs</div>
            <div className="text-3xl font-semibold mt-2">{activeJobs}</div>
          </div>

          <div className="rounded-xl bg-[var(--color-surface)] border border-white/6 p-4">
            <div className="text-sm text-[#c4c7c8]">Total Applicants</div>
            <div className="text-3xl font-semibold mt-2">{totalApplicants}</div>
          </div>
        </div>
      )}

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Recent Jobs</h2>
          <a href="/recruiter/jobs/new" className="text-sm text-blue-300">Create job</a>
        </div>

        {!loading && (!jobs || jobs.length === 0) && (
          <div className="mt-4 text-[#c4c7c8]">You have not posted any jobs yet.</div>
        )}

        {!loading && jobs && jobs.map(job => (
          <div key={job._id} className="mt-4 rounded-lg bg-[var(--color-surface)] border border-white/6 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{job.title}</div>
                <div className="text-sm text-[#c4c7c8]">{job.company} • {job.location}</div>
              </div>

              <div className="text-right">
                <div className="text-sm text-[#c4c7c8]">Applicants</div>
                <div className="font-semibold">{job.applicantCount || 0}</div>
                <a href={`/recruiter/jobs/${job._id}/applicants`} className="text-sm text-blue-300">View applicants</a>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
