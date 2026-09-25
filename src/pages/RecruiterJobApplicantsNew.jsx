import React, { useEffect, useState } from "react";
import { API_URL } from "../lib/config";

function authHeader() {
  const token = localStorage.getItem('careerEngineToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function RecruiterJobApplicantsNew() {
  const [applications, setApplications] = useState(null);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [runningMatchId, setRunningMatchId] = useState(null);

  useEffect(() => {
    const parts = window.location.pathname.split('/');
    const jobId = parts[3];
    if (jobId) fetchApplicants(jobId);
  }, []);

  async function fetchApplicants(jobId) {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API_URL}/api/jobs/${jobId}/applicants`, { headers: { ...authHeader() } });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed');
      setJob(data.job);
      setApplications(data.applications || []);
    } catch (err) { console.error(err); setError(err.message || 'Unable to load'); }
    finally { setLoading(false); }
  }

  async function updateStatus(appId, status) {
    try {
      const res = await fetch(`${API_URL}/api/applications/${appId}/status`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json', ...authHeader() },
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

  async function runMatch(appId) {
    try {
      setRunningMatchId(appId);
      const res = await fetch(`${API_URL}/api/applications/${appId}/match`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() },
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Matching failed');
      // refresh
      const parts = window.location.pathname.split('/');
      const jobId = parts[3];
      await fetchApplicants(jobId);
    } catch (err) {
      console.error('Run match failed', err);
      alert(err.message || 'Unable to analyze candidate.');
    } finally {
      setRunningMatchId(null);
    }
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

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="font-semibold">{app.candidateId?.name}</div>
              <div className="text-sm text-[#c4c7c8]">{app.candidateId?.email}</div>
              <div className="text-sm text-[#c4c7c8] mt-2">Status: {app.status}</div>

              {/* Match result card */}
              {app.matchResult ? (
                <div className="mt-4 rounded-md bg-[#0f1720] border border-white/6 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-[#c4c7c8]">AI Match</div>
                      <div className="text-2xl font-semibold mt-1">{app.matchResult.score}%</div>
                      <div className="text-sm text-[#9ca3af]">{app.matchResult.score >= 75 ? 'Strong Match' : app.matchResult.score >= 50 ? 'Good Match' : 'Weak Match'}</div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-[#c4c7c8]">Matching Skills</div>
                      <ul className="mt-2 list-disc list-inside">
                        {(app.matchResult.matchingSkills || []).map(skill => (
                          <li key={skill} className="text-sm text-[#c4c7c8]">{skill}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="text-xs text-[#c4c7c8]">Missing Skills</div>
                      <ul className="mt-2 list-disc list-inside">
                        {(app.matchResult.missingSkills || []).map(skill => (
                          <li key={skill} className="text-sm text-[#c4c7c8]">{skill}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {app.matchResult.recommendation && (
                    <div className="mt-3 text-sm text-[#c4c7c8]">{app.matchResult.recommendation}</div>
                  )}

                </div>
              ) : (
                <div className="mt-4 text-sm text-[#c4c7c8]">No match results yet.</div>
              )}

            </div>

            <div className="w-44 flex-shrink-0 flex flex-col items-end gap-2">
              <a href={`/recruiter/candidates/${app.candidateId?._id}`} className="text-sm text-blue-300">View Candidate</a>

              <button onClick={() => updateStatus(app._id, 'Shortlisted')} className="text-sm text-green-300">Shortlist</button>
              <button onClick={() => updateStatus(app._id, 'Interview')} className="text-sm text-blue-300">Interview</button>
              <button onClick={() => updateStatus(app._id, 'Rejected')} className="text-sm text-red-400">Reject</button>

              <button
                onClick={() => runMatch(app._id)}
                className="mt-2 w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium"
                disabled={runningMatchId === app._id}
              >
                {runningMatchId === app._id ? 'Analyzing...' : 'Run AI Match'}
              </button>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}
