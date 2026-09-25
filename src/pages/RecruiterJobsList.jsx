import React, { useEffect, useState } from "react";
import { API_URL } from "../lib/config";

export default function RecruiterJobsList() {
  const [jobs, setJobs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetchJobs(); }, []);

  async function fetchJobs() {
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem('careerEngineToken');
      const res = await fetch(`${API_URL}/api/jobs/by-recruiter/me`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed');
      setJobs(data.jobs || []);
    } catch (err) { console.error(err); setError(err.message || 'Unable to load'); }
    finally { setLoading(false); }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Jobs</h1>
        <a href="/recruiter/jobs/new" className="text-blue-300">Create</a>
      </div>

      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-400">{error}</p>}

      {!loading && jobs && jobs.length === 0 && <div className="mt-4 text-[#c4c7c8]">No jobs posted yet.</div>}

      {!loading && jobs && jobs.map(job => (
        <div key={job._id} className="mt-4 rounded-lg bg-[var(--color-surface)] border border-white/6 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{job.title}</div>
              <div className="text-sm text-[#c4c7c8]">{job.company} • {job.location}</div>
              <div className="text-sm text-[#c4c7c8] mt-2">Skills: {(job.requiredSkills || []).join(', ')}</div>
            </div>

            <div className="text-right">
              <div className="text-sm text-[#c4c7c8]">Applicants</div>
              <div className="font-semibold">{job.applicantCount || 0}</div>
              <a href={`/recruiter/jobs/${job._id}/applicants`} className="text-sm text-blue-300">View</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
