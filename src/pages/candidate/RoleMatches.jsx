import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { API_URL } from "../../lib/config";

export default function RoleMatches() {
  const { resumeId } = useParams();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMatches();
  }, [resumeId]);

  async function loadMatches() {
    try {
      const token = localStorage.getItem(
        "careerEngineToken"
      );

      if (!token) {
        throw new Error(
          "Please sign in again."
        );
      }

      const response = await fetch(
        `${API_URL}/api/roles/resume/${resumeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to load role matches."
        );
      }

      setMatches(data.matches || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141313] p-10 text-white">
        Loading real role matches...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#141313] p-10 text-white">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141313] px-6 py-10 text-white md:px-10">
      <div className="mx-auto max-w-6xl">

        <Link
          to="/resume"
          className="text-sm text-[#a7b6cc]"
        >
          ← Resume
        </Link>

        <h1 className="mt-6 text-4xl font-semibold">
          Role Matches
        </h1>

        <p className="mt-3 text-[#a7b6cc]">
          Roles matched against the skills detected
          in your actual resume.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">

          {matches.map((role) => (
            <div
              key={role.title}
              className="rounded-3xl border border-white/10 bg-[#111111] p-7"
            >

              <div className="flex items-start justify-between gap-5">

                <div>
                  <h2 className="text-xl font-semibold">
                    {role.title}
                  </h2>

                  <p className="mt-1 text-sm text-[#777]">
                    {role.company}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-[#b9c8de]">
                    {role.matchPercentage}%
                  </div>

                  <p className="text-xs text-[#777]">
                    match
                  </p>
                </div>

              </div>

              <div className="mt-6">

                <p className="text-xs font-semibold tracking-wide text-[#a7b6cc]">
                  MATCHED SKILLS
                </p>

                <div className="mt-3 flex flex-wrap gap-2">

                  {role.matchedSkills.length > 0 ? (
                    role.matchedSkills.map(
                      (skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-[#c4c7c8]"
                        >
                          {skill}
                        </span>
                      )
                    )
                  ) : (
                    <span className="text-sm text-[#666]">
                      No matching skills detected.
                    </span>
                  )}

                </div>

              </div>

              {role.missingSkills.length > 0 && (
                <div className="mt-6">

                  <p className="text-xs font-semibold tracking-wide text-[#a7b6cc]">
                    SKILLS TO DEVELOP
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">

                    {role.missingSkills
                      .slice(0, 5)
                      .map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-[#777]"
                        >
                          {skill}
                        </span>
                      ))}

                  </div>

                </div>
              )}

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}