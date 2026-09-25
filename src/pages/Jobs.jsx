import React, { useEffect, useState } from "react";
import { API_URL } from "../lib/config";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetchJobs(); }, []);

  async function fetchJobs() {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API_URL}/api/jobs`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed');
      setJobs(data.jobs || []);
    } catch (err) { console.error(err); setError(err.message || 'Unable to load'); }
    finally { setLoading(false); }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Jobs</h1>
      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-400">{error}</p>}

      {!loading && jobs.length === 0 && <div className="mt-4 text-[#c4c7c8]">No jobs available.</div>}

      {!loading && jobs.map(job => (
        <div key={job._id} className="mt-4 rounded-lg bg-[var(--color-surface)] border border-white/6 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{job.title}</div>
              <div className="text-sm text-[#c4c7c8]">{job.company} • {job.location}</div>
              <div className="text-sm text-[#c4c7c8] mt-2">Skills: {(job.requiredSkills || []).join(', ')}</div>
            </div>

            <div className="text-right">
              <a href={`/jobs/${job._id}`} className="text-sm text-blue-300">View</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
