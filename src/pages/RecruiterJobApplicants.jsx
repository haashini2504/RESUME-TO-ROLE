import React, { useEffect, useState } from "react";
import { API_URL } from "../lib/config";

// small helper for safe auth header
function authHeader() {
  const token = localStorage.getItem('careerEngineToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function RecruiterJobApplicants() {
  const [applications, setApplications] = useState(null);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const parts = window.location.pathname.split('/');
    const jobId = parts[3];
    if (jobId) fetchApplicants(jobId);
  }, []);

  async function fetchApplicants(jobId) {
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem('careerEngineToken');
      const res = await fetch(`${API_URL}/api/jobs/${jobId}/applicants`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed');
      setJob(data.job);
      setApplications(data.applications || []);
    } catch (err) { console.error(err); setError(err.message || 'Unable to load'); }
    finally { setLoading(false); }
  }

  async function updateStatus(appId, status) {
    try {
      const token = localStorage.getItem('careerEngineToken');
      const res = await fetch(`${API_URL}/api/applications/${appId}/status`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed');
      // refresh
      const parts = window.location.pathname.split('/');
      const jobId = parts[3];
      fetchApplicants(jobId);
    } catch (err) { console.error(err); alert(err.message || 'Unable to update'); }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Applicants</h1>
      {job && <div className="text-sm text-[#c4c7c8] mt-2">{job.title} • {job.company}</div>}

      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-400">{error}</p>}

      {!loading && applications && applications.length === 0 && <div className="mt-4 text-[#c4c7c8]">No applicants yet.</div>}

      {!loading && applications && applications.map(app => (
        <div key={app._id} className="mt-4 rounded-lg bg-[var(--color-surface)] border border-white/6 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{app.candidateId?.name}</div>
              <div className="text-sm text-[#c4c7c8]">{app.candidateId?.email}</div>
              <div className="text-sm text-[#c4c7c8] mt-2">Status: {app.status}</div>
            </div>

            <div className="text-right flex flex-col gap-2">
              <a href={`/recruiter/candidates/${app.candidateId?._id}`} className="text-sm text-blue-300">View Candidate</a>
              <button onClick={() => updateStatus(app._id, 'Shortlisted')} className="text-sm text-green-300">Shortlist</button>
              <button onClick={() => updateStatus(app._id, 'Interview')} className="text-sm text-blue-300">Interview</button>
              <button onClick={() => updateStatus(app._id, 'Rejected')} className="text-sm text-red-400">Reject</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
