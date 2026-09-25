import express from "express";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Resume from "../models/Resume.js";
import authMiddleware from "../middleware/auth.js";

// reuse match engine helpers
import {
  normalizeText,
  buildCandidateProfile,
  calculateRoleMatch,
  generateWhyMatch,
} from "./matchEngine.js";

const router = express.Router();

// Apply to a job (candidate)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "candidate") {
      return res.status(403).json({ success: false, message: "Only candidates can apply to jobs." });
    }

    const { jobId, resumeId } = req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, message: "jobId is required." });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found." });
    }

    // If resumeId provided, ensure it belongs to user
    if (resumeId) {
      const resume = await Resume.findById(resumeId);
      if (!resume || String(resume.userId) !== String(user._id)) {
        return res.status(400).json({ success: false, message: "Resume not found or doesn't belong to you." });
      }
    } else {
      return res.status(400).json({ success: false, message: "Please upload or select a resume before applying." });
    }

    // Prevent duplicate applications
    const existing = await Application.findOne({ jobId, candidateId: user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: "You have already applied to this job." });
    }

    const application = await Application.create({
      jobId,
      candidateId: user._id,
      resumeId,
      status: "Applied",
    });

    res.status(201).json({ success: true, application });
  } catch (error) {
    console.error("Apply error:", error);
    res.status(500).json({ success: false, message: "Failed to apply to job." });
  }
});

// Get my applications (candidate)
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    const applications = await Application.find({ candidateId: user._id })
      .sort({ createdAt: -1 })
      .populate("jobId")
      .populate("resumeId");

    res.json({ success: true, applications });
  } catch (error) {
    console.error("Get my applications error:", error);
    res.status(500).json({ success: false, message: "Failed to get your applications." });
  }
});

// Get application by id
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("jobId")
      .populate("candidateId", "name email role")
      .populate("resumeId");

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }

    // Allow candidate or the job's recruiter to view
    const user = req.user;
    if (String(application.candidateId._id) !== String(user._id)) {
      const job = await Job.findById(application.jobId);
      if (!job || String(job.recruiterId) !== String(user._id)) {
        return res.status(403).json({ success: false, message: "You do not have access to this application." });
      }
    }

    res.json({ success: true, application });
  } catch (error) {
    console.error("Get application error:", error);
    res.status(500).json({ success: false, message: "Failed to get application." });
  }
});

// Update application status (recruiter for that job)
router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required." });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found." });
    }

    const job = await Job.findById(application.jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: "Related job not found." });
    }

    if (String(job.recruiterId) !== String(user._id)) {
      return res.status(403).json({ success: false, message: "Only the job owner can change the application status." });
    }

    application.status = status;
    await application.save();

    res.json({ success: true, application });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ success: false, message: "Failed to update status." });
  }
});


// Run job-specific AI match for an application (recruiter only)
router.post(
  "/:id/match",
  authMiddleware,
  async (req, res) => {
    try {
      const user = req.user;
      const application = await Application.findById(req.params.id);

      if (!application) {
        return res.status(404).json({ success: false, message: "Application not found." });
      }

      const job = await Job.findById(application.jobId);

      if (!job) {
        return res.status(404).json({ success: false, message: "Related job not found." });
      }

      // Only the job owner (recruiter) can run matching
      if (String(job.recruiterId) !== String(user._id)) {
        return res.status(403).json({ success: false, message: "You do not have permission to run matching for this application." });
      }

      if (!application.resumeId) {
        return res.status(400).json({ success: false, message: "Candidate does not have a resume attached to this application." });
      }

      const resume = await Resume.findById(application.resumeId);

      if (!resume) {
        return res.status(404).json({ success: false, message: "Resume not found." });
      }

      const rawText = resume.extractedText || "";

      if (!rawText.trim()) {
        return res.status(400).json({ success: false, message: "Resume does not contain readable text." });
      }

      const text = normalizeText(rawText);

      // Candidate profile
      const candidate = buildCandidateProfile(text);

      // Build a temporary role-like object from the job so we can reuse calculateRoleMatch
      const roleLike = {
        id: String(job._id),
        title: job.title || "",
        category: job.company || "",
        requiredSkills: Array.isArray(job.requiredSkills) ? job.requiredSkills : [],
        preferredSkills: [],
        keywords: [job.title || "", job.company || "", job.location || ""].filter(Boolean),
      };

      const match = calculateRoleMatch(text, candidate.skills, roleLike);

      // Build a human-friendly recommendation using existing helper
      const why = generateWhyMatch(match);

      const matchResult = {
        score: match.matchPercentage,
        matchingSkills: match.matchedSkills || [],
        missingSkills: match.missingSkills || [],
        recommendation: Array.isArray(why) ? why.join(" ") : (why || ""),
        matchedAt: new Date(),
      };

      application.matchResult = matchResult;
      await application.save();

      // Return the saved matchResult
      return res.json({ success: true, matchResult });
    } catch (error) {
      console.error("Run match error:", error);
      return res.status(500).json({ success: false, message: "Failed to run match." });
    }
  }
);

export default router;