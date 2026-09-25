import React, { useEffect, useState } from "react";
import { API_URL } from "../lib/config";

export default function RecruiterCandidateDetails() {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const parts = window.location.pathname.split('/');
    const candidateId = parts[3];
    // this route expects candidateId; we need to find an application id via query or similar.
    // For simplicity, try to load candidate's latest application for jobs of this recruiter
    if (candidateId) fetchCandidate(candidateId);
  }, []);

  async function fetchCandidate(candidateId) {
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem('careerEngineToken');
      // Try to find an application where candidateId matches and recruiter owns job
      const res = await fetch(`${API_URL}/api/applications/my`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed');
      const apps = data.applications || [];
      const found = apps.find(a => a.candidateId && String(a.candidateId._id) === String(candidateId));
      if (!found) {
        setError('Candidate application not found in your applications.');
      } else {
        setApplication(found);
      }
    } catch (err) { console.error(err); setError(err.message || 'Unable to load'); }
    finally { setLoading(false); }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Candidate</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {application && (
        <div className="mt-4 rounded-lg bg-[var(--color-surface)] border border-white/6 p-4">
          <div className="font-semibold">{application.candidateId?.name}</div>
          <div className="text-sm text-[#c4c7c8]">{application.candidateId?.email}</div>
          <div className="mt-3">Status: {application.status}</div>
          <div className="mt-3">Resume: {application.resumeId?.fileName || 'Not available'}</div>
        </div>
      )}
    </div>
  );
}
