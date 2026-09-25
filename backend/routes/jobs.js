import express from "express";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Create job (recruiter only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "recruiter") {
      return res.status(403).json({ success: false, message: "Only recruiters can create jobs." });
    }

    const {
      title,
      company,
      location,
      employmentType,
      description,
      requiredSkills,
      experienceRequired,
    } = req.body;

    if (!title || !company) {
      return res.status(400).json({ success: false, message: "Title and company are required." });
    }

    const job = await Job.create({
      recruiterId: user._id,
      title,
      company,
      location,
      employmentType,
      description,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : (requiredSkills || "").split(",").map(s => s.trim()).filter(Boolean),
      experienceRequired,
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({ success: false, message: "Failed to create job." });
  }
});

// Get all jobs (public) - candidate uses this to browse
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({ success: false, message: "Failed to get jobs." });
  }
});

// Get job by id
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found." });
    }

    res.json({ success: true, job });
  } catch (error) {
    console.error("Get job error:", error);
    res.status(500).json({ success: false, message: "Failed to get job." });
  }
});

// Get jobs by recruiter
router.get("/by-recruiter/me", authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "recruiter") {
      return res.status(403).json({ success: false, message: "Only recruiters can view this." });
    }

    const jobs = await Job.find({ recruiterId: user._id }).sort({ createdAt: -1 });

    // Append applicant counts
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const count = await Application.countDocuments({ jobId: job._id });
        return { ...job.toObject(), applicantCount: count };
      })
    );

    res.json({ success: true, jobs: jobsWithCounts });
  } catch (error) {
    console.error("Recruiter jobs error:", error);
    res.status(500).json({ success: false, message: "Failed to get recruiter jobs." });
  }
});

// Get applicants for a job (recruiter only)
router.get("/:id/applicants", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found." });
    }

    if (String(job.recruiterId) !== String(user._id)) {
      return res.status(403).json({ success: false, message: "You do not have access to this job's applicants." });
    }

    const applications = await Application.find({ jobId: job._id })
      .sort({ createdAt: -1 })
      .populate("candidateId", "name email role")
      .populate("resumeId");

    res.json({ success: true, job: job.toObject(), applications });
  } catch (error) {
    console.error("Get applicants error:", error);
    res.status(500).json({ success: false, message: "Failed to get applicants." });
  }
});

export default router;