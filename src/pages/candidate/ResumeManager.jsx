import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { API_URL } from "../../lib/config";

export default function ResumeManager() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadedResume, setUploadedResume] = useState(null);

  // Restore the latest MongoDB resume whenever this page opens.
  // This is what makes the resume survive refresh/logout/login instead of
  // depending only on the browser File object or React state.
  useEffect(() => {
    loadSavedResume();
  }, []);

  async function loadSavedResume() {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/resumes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) return;

      const latest = Array.isArray(data.resumes) ? data.resumes[0] : null;
      if (!latest?._id) return;

      const resumeInfo = {
        id: String(latest._id),
        name: latest.fileName || "Resume",
        fileName: latest.fileName || "Resume",
        size: latest.fileSize || 0,
        type: latest.fileType || "",
        uploadedAt: latest.uploadedAt || latest.createdAt || new Date().toISOString(),
      };

      localStorage.setItem("selectedResumeId", resumeInfo.id);
      localStorage.setItem("resumeId", resumeInfo.id);
      localStorage.setItem("careerEngineResume", JSON.stringify(resumeInfo));
      setUploadedResume(resumeInfo);
    } catch (error) {
      console.error("Failed to restore saved resume:", error);
    }
  }

  // --------------------------------------------------
  // GET AUTH TOKEN
  // --------------------------------------------------

  function getToken() {
    return (
      localStorage.getItem("careerEngineToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      ""
    );
  }

  // --------------------------------------------------
  // SELECT FILE
  // --------------------------------------------------

  function handleFile(file) {
    if (!file) {
      return;
    }

    setError("");
    setSuccess("");

    const fileName = file.name.toLowerCase();

    const validExtension =
      fileName.endsWith(".pdf") ||
      fileName.endsWith(".doc") ||
      fileName.endsWith(".docx");

    if (!validExtension) {
      setError(
        "Invalid file type. Please upload a PDF, DOC, or DOCX resume."
      );
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Resume must be smaller than 10 MB.");
      return;
    }

    setSelectedFile(file);
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    handleFile(file);
  }

  // --------------------------------------------------
  // DRAG & DROP
  // --------------------------------------------------

  function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();

    setDragActive(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();

    setDragActive(false);
  }

  function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();

    setDragActive(false);

    const file = event.dataTransfer.files?.[0];

    handleFile(file);
  }

  // --------------------------------------------------
  // REMOVE FILE
  // --------------------------------------------------

  function removeFile() {
    setSelectedFile(null);
    setError("");
    setSuccess("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // --------------------------------------------------
  // READ RESPONSE SAFELY
  // --------------------------------------------------

  async function readResponse(response) {
    const contentType =
      response.headers.get("content-type") || "";

    const rawText = await response.text();

    console.log(
      "UPLOAD STATUS:",
      response.status
    );

    console.log(
      "UPLOAD CONTENT TYPE:",
      contentType
    );

    console.log(
      "UPLOAD RAW RESPONSE:",
      rawText
    );

    // JSON response
    if (
      contentType.includes("application/json")
    ) {
      try {
        return JSON.parse(rawText);
      } catch (error) {
        throw new Error(
          "Backend returned invalid JSON."
        );
      }
    }

    // HTML response
    if (
      rawText.trim().startsWith("<!") ||
      rawText.trim().startsWith("<html") ||
      rawText.includes("<!DOCTYPE")
    ) {
      throw new Error(
        `Backend returned an HTML page instead of JSON. Status: ${response.status}. Check the upload API URL.`
      );
    }

    // Try JSON anyway
    try {
      return JSON.parse(rawText);
    } catch {
      throw new Error(
        rawText ||
          `Upload failed with status ${response.status}.`
      );
    }
  }

  // --------------------------------------------------
  // REAL RESUME UPLOAD
  // --------------------------------------------------

  async function handleAnalyze() {
    if (!selectedFile) {
      setError(
        "Please choose your resume first."
      );

      return;
    }

    const token = getToken();

    console.log(
      "AUTH TOKEN EXISTS:",
      Boolean(token)
    );

    if (!token) {
      setError(
        "You are not logged in. Please sign in again."
      );

      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      /*
       * IMPORTANT:
       * This is the exact API we are calling.
       */

      const primaryUrl =
        `${API_URL}/api/resumes/upload`;

      console.log(
        "================================"
      );

      console.log(
        "REAL RESUME UPLOAD STARTED"
      );

      console.log(
        "UPLOAD URL:",
        primaryUrl
      );

      console.log(
        "FILE:",
        selectedFile.name
      );

      console.log(
        "FILE SIZE:",
        selectedFile.size
      );

      console.log(
        "FILE TYPE:",
        selectedFile.type
      );

      console.log(
        "================================"
      );

      // ------------------------------------------------
      // FORM DATA
      // ------------------------------------------------

      const formData = new FormData();

      /*
       * This name must match multer:
       *
       * upload.single("resume")
       */

      formData.append(
        "resume",
        selectedFile
      );

      // ------------------------------------------------
      // API REQUEST
      // ------------------------------------------------

      let response;

      try {
        response = await fetch(
          primaryUrl,
          {
            method: "POST",

            headers: {
              Authorization: `Bearer ${token}`,
            },

            body: formData,
          }
        );
      } catch (networkError) {
        console.error(
          "PRIMARY UPLOAD NETWORK ERROR:",
          networkError
        );

        /*
         * Try singular endpoint as fallback.
         *
         * This handles projects where the backend
         * was registered as /api/resume instead of
         * /api/resumes.
         */

        const fallbackUrl =
          `${API_URL}/api/resume/upload`;

        console.log(
          "Trying fallback URL:",
          fallbackUrl
        );

        // FormData can safely be created again
        // for the second request.

        const fallbackFormData =
          new FormData();

        fallbackFormData.append(
          "resume",
          selectedFile
        );

        response = await fetch(
          fallbackUrl,
          {
            method: "POST",

            headers: {
              Authorization: `Bearer ${token}`,
            },

            body: fallbackFormData,
          }
        );
      }

      // ------------------------------------------------
      // READ RESPONSE
      // ------------------------------------------------

      const result =
        await readResponse(response);

      console.log(
        "UPLOAD PARSED RESULT:",
        result
      );

      // ------------------------------------------------
      // ERROR FROM BACKEND
      // ------------------------------------------------

      if (
        !response.ok ||
        !result?.success
      ) {
        throw new Error(
          result?.message ||
            `Resume upload failed with status ${response.status}.`
        );
      }

      // ------------------------------------------------
      // FIND REAL RESUME OBJECT
      // ------------------------------------------------

      const resume =
        result.resume ||
        result.data?.resume ||
        result.data ||
        null;

      console.log(
        "RESUME OBJECT:",
        resume
      );

      // ------------------------------------------------
      // FIND REAL MONGODB ID
      // ------------------------------------------------

      const resumeId =
        resume?._id ||
        resume?.id ||
        result.resumeId ||
        result.data?.resumeId ||
        result.data?._id ||
        null;

      console.log(
        "REAL RESUME ID:",
        resumeId
      );

      if (!resumeId) {
        console.error(
          "FULL BACKEND RESPONSE:",
          result
        );

        throw new Error(
          "The resume was uploaded, but the backend did not return a MongoDB resume ID."
        );
      }

      // ------------------------------------------------
      // SAVE REAL RESUME ID
      // ------------------------------------------------

      const realResumeId =
        String(resumeId);

      localStorage.setItem(
        "selectedResumeId",
        realResumeId
      );

      localStorage.setItem(
        "resumeId",
        realResumeId
      );

      // ------------------------------------------------
      // SAVE RESUME INFORMATION
      // ------------------------------------------------

      const resumeInfo = {
        id: realResumeId,

        name:
          resume?.fileName ||
          resume?.filename ||
          resume?.name ||
          selectedFile.name,

        fileName:
          resume?.fileName ||
          resume?.filename ||
          selectedFile.name,

        size:
          resume?.size ||
          selectedFile.size,

        type:
          resume?.mimeType ||
          resume?.fileType ||
          selectedFile.type,

        uploadedAt:
          new Date().toISOString(),
      };

      localStorage.setItem(
        "careerEngineResume",
        JSON.stringify(resumeInfo)
      );

      // ------------------------------------------------
      // UPDATE UI
      // ------------------------------------------------

      setUploadedResume(
        resumeInfo
      );

      setSuccess(
        "Resume uploaded successfully. Opening Match Engine..."
      );

      console.log(
        "================================"
      );

      console.log(
        "RESUME UPLOAD SUCCESS"
      );

      console.log(
        "REAL MONGODB RESUME ID:",
        realResumeId
      );

      console.log(
        "GOING TO MATCH ENGINE"
      );

      console.log(
        "================================"
      );

      // ------------------------------------------------
      // GO TO MATCH ENGINE
      // ------------------------------------------------

      setTimeout(() => {
        navigate(
          "/candidate/match-engine",
          {
            state: {
              resumeId:
                realResumeId,
            },
          }
        );
      }, 500);

    } catch (error) {
      console.error(
        "================================"
      );

      console.error(
        "REAL RESUME UPLOAD ERROR"
      );

      console.error(
        error
      );

      console.error(
        "================================"
      );

      setError(
        error?.message ||
          "Unable to upload the resume."
      );
    } finally {
      setUploading(false);
    }
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-[#141313] px-6 py-10 text-white">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

          <div>

            <Link
              to="/dashboard"
              className="text-sm text-[#9ca8b8] transition hover:text-white"
            >
              ← Back to Dashboard
            </Link>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-[#77869b]">
              Resume Manager
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              Upload your resume
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#8f9394]">
              Upload your actual resume to generate
              real career matches based on your
              skills and experience.
            </p>

          </div>

          <Link
            to="/candidate/match-engine"
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5"
          >
            Open Match Engine
          </Link>

        </div>


        {/* ERROR */}

        {error && (
          <div className="mt-7 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">

            <p className="text-sm font-medium text-red-300">
              {error}
            </p>

            <p className="mt-2 text-xs leading-5 text-red-200/60">
              Open F12 → Console if this happens
              again. The frontend now logs the exact
              API URL and backend response.
            </p>

          </div>
        )}


        {/* SUCCESS */}

        {success && (
          <div className="mt-7 rounded-2xl border border-green-500/20 bg-green-500/10 p-5">

            <p className="text-sm font-medium text-green-300">
              {success}
            </p>

          </div>
        )}


        {/* UPLOAD CARD */}

        <section className="mt-8 rounded-3xl border border-white/10 bg-[#101010] p-6 md:p-8">

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`rounded-3xl border-2 border-dashed p-10 text-center transition md:p-16 ${
              dragActive
                ? "border-[#b9c8de] bg-[#1c1c1c]"
                : "border-white/10 bg-[#161616] hover:border-white/20"
            }`}
          >

            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-white/5 text-3xl">
              📄
            </div>

            <h2 className="mt-6 text-2xl font-semibold">
              Drop your resume here
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#777]">
              Upload your real PDF, DOC, or DOCX
              resume. Maximum file size is 10 MB.
            </p>

            <button
              type="button"
              disabled={uploading}
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="mt-7 rounded-xl bg-[#d4e4fa] px-6 py-3 text-sm font-semibold text-[#171717] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Choose Resume
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />

            <p className="mt-4 text-xs text-[#555]">
              PDF / DOC / DOCX
            </p>

          </div>


          {/* SELECTED FILE */}

          {selectedFile && (

            <div className="mt-6 rounded-2xl border border-white/10 bg-[#181818] p-5">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex min-w-0 items-center gap-4">

                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/5">
                    📄
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold">
                      {selectedFile.name}
                    </p>

                    <p className="mt-1 text-xs text-[#666]">
                      {formatFileSize(
                        selectedFile.size
                      )}
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  disabled={uploading}
                  onClick={removeFile}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-[#999] transition hover:border-red-500/30 hover:text-red-300 disabled:opacity-40"
                >
                  Remove
                </button>

              </div>

            </div>

          )}


          {/* ANALYZE */}

          <div className="mt-6">

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={
                !selectedFile ||
                uploading
              }
              className="w-full rounded-xl bg-[#d4e4fa] px-6 py-4 text-sm font-semibold text-[#171717] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {uploading
                ? "Uploading your real resume..."
                : "Analyze Resume"}
            </button>

          </div>

        </section>


        {/* CURRENT RESUME */}

        <section className="mt-8 rounded-3xl border border-white/10 bg-[#101010] p-7">

          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#77869b]">
            Current resume
          </p>

          <div className="mt-5">

            {uploadedResume ? (
              <>
                <h2 className="text-xl font-semibold">
                  {uploadedResume.name}
                </h2>

                <p className="mt-2 text-sm text-[#777]">
                  Uploaded successfully and connected
                  to your real MongoDB resume record.
                </p>

                <p className="mt-3 break-all text-xs text-[#555]">
                  Resume ID: {uploadedResume.id}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold">
                  No resume uploaded yet
                </h2>

                <p className="mt-2 text-sm text-[#777]">
                  Upload your resume above to begin
                  real career matching.
                </p>
              </>
            )}

          </div>

        </section>


        {/* FEATURES */}

        <section className="mt-8 grid gap-5 pb-10 md:grid-cols-3">

          <Feature
            title="Real Resume"
            text="Uses the actual file you upload."
          />

          <Feature
            title="Real Database"
            text="Stores your resume against your MongoDB account."
          />

          <Feature
            title="Real Matching"
            text="Passes your actual resume ID into Match Engine."
          />

        </section>

      </div>

    </div>
  );
}


// --------------------------------------------------
// FEATURE CARD
// --------------------------------------------------

function Feature({
  title,
  text,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#101010] p-6">

      <div className="flex size-10 items-center justify-center rounded-xl bg-white/5 text-[#c8d4e5]">
        ✓
      </div>

      <h3 className="mt-5 font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#777]">
        {text}
      </p>

    </div>
  );
}


// --------------------------------------------------
// FILE SIZE
// --------------------------------------------------

function formatFileSize(bytes) {
  if (!bytes) {
    return "0 KB";
  }

  const units = [
    "Bytes",
    "KB",
    "MB",
    "GB",
  ];

  const index = Math.floor(
    Math.log(bytes) / Math.log(1024)
  );

  const size =
    bytes /
    Math.pow(1024, index);

  return `${size.toFixed(
    index === 0 ? 0 : 1
  )} ${units[index]}`;
}