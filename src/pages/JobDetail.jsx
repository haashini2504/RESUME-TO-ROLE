import React, { useEffect, useState } from "react";
import { API_URL } from "../lib/config";

export default function JobDetail() {
  const [job, setJob] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const parts = window.location.pathname.split('/');
    const jobId = parts[2];
    if (jobId) {
      fetchJob(jobId);
      fetchResumes();
    }
  }, []);

  async function fetchJob(jobId) {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API_URL}/api/jobs/${jobId}`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed');
      setJob(data.job);
    } catch (err) { console.error(err); setError(err.message || 'Unable to load'); }
    finally { setLoading(false); }
  }

  async function fetchResumes() {
    try {
      const token = localStorage.getItem('careerEngineToken');
      const res = await fetch(`${API_URL}/api/resumes`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok && data.success) setResumes(data.resumes || []);
    } catch (err) { console.error(err); }
  }

  async function apply() {
    setError(''); setSuccess('');
    if (!selectedResume) { setError('Please select a resume to apply.'); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem('careerEngineToken');
      const parts = window.location.pathname.split('/');
      const jobId = parts[2];
      const res = await fetch(`${API_URL}/api/applications`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ jobId, resumeId: selectedResume })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed');
      setSuccess('Application submitted successfully.');
    } catch (err) { console.error(err); setError(err.message || 'Unable to apply'); }
    finally { setLoading(false); }
  }

  return (
    <div className="p-6">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {success && <p className="text-green-400">{success}</p>}

      {job && (
        <div>
          <h1 className="text-2xl font-semibold">{job.title}</h1>
          <div className="text-sm text-[#c4c7c8]">{job.company} • {job.location}</div>
          <div className="mt-4">{job.description}</div>

          <div className="mt-6">
            <label className="block mb-2">Select Resume</label>
            <select className="input mb-3" value={selectedResume} onChange={e => setSelectedResume(e.target.value)}>
              <option value="">-- choose resume --</option>
              {resumes.map(r => <option key={r._id} value={r._id}>{r.fileName}</option>)}
            </select>

            <button className="btn" onClick={apply} disabled={loading}>{loading ? 'Please wait...' : 'Apply'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
