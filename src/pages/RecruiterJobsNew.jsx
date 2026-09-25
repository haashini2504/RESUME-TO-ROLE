import React, { useState } from "react";
import { API_URL } from "../lib/config";

export default function RecruiterJobsNew() {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    employmentType: "Full-time",
    description: "",
    requiredSkills: "",
    experienceRequired: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const update = (field) => (e) => setForm(prev => ({...prev, [field]: e.target.value}));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem("careerEngineToken");
      const body = {
        ...form,
        requiredSkills: form.requiredSkills.split(",").map(s => s.trim()).filter(Boolean),
      };

      const res = await fetch(`${API_URL}/api/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to create job.");

      setSuccess("Job created successfully.");
      // redirect to jobs list
      window.location.href = "/recruiter/jobs";
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to create job.");
    } finally { setLoading(false); }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Create Job</h1>

      <form onSubmit={handleSubmit} className="mt-6 max-w-2xl">
        <label className="block mb-2">Title</label>
        <input className="input mb-3" value={form.title} onChange={update('title')} />

        <label className="block mb-2">Company</label>
        <input className="input mb-3" value={form.company} onChange={update('company')} />

        <label className="block mb-2">Location</label>
        <input className="input mb-3" value={form.location} onChange={update('location')} />

        <label className="block mb-2">Employment Type</label>
        <input className="input mb-3" value={form.employmentType} onChange={update('employmentType')} />

        <label className="block mb-2">Description</label>
        <textarea className="input mb-3" value={form.description} onChange={update('description')} />

        <label className="block mb-2">Required Skills (comma separated)</label>
        <input className="input mb-3" value={form.requiredSkills} onChange={update('requiredSkills')} />

        <label className="block mb-2">Experience Required</label>
        <input className="input mb-3" value={form.experienceRequired} onChange={update('experienceRequired')} />

        {error && <div className="text-red-400 mb-2">{error}</div>}
        {success && <div className="text-green-400 mb-2">{success}</div>}

        <button type="submit" className="btn" disabled={loading}>{loading ? 'Please wait...' : 'Create Job'}</button>
      </form>

    </div>
  );
}
