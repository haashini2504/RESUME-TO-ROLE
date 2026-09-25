import express from "express";
import Resume from "../models/Resume.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

const roles = [
  {
    title: "Frontend Developer",
    company: "Technology",
    skills: [
      "react",
      "javascript",
      "typescript",
      "html",
      "css",
      "next.js",
      "nextjs",
      "tailwind",
    ],
  },
  {
    title: "Backend Developer",
    company: "Technology",
    skills: [
      "node.js",
      "nodejs",
      "express",
      "python",
      "java",
      "mongodb",
      "mysql",
      "postgresql",
      "sql",
      "rest api",
    ],
  },
  {
    title: "Full Stack Developer",
    company: "Technology",
    skills: [
      "react",
      "javascript",
      "node.js",
      "nodejs",
      "express",
      "mongodb",
      "sql",
      "html",
      "css",
    ],
  },
  {
    title: "Software Engineer",
    company: "Technology",
    skills: [
      "javascript",
      "python",
      "java",
      "sql",
      "git",
      "testing",
      "api",
      "docker",
    ],
  },
  {
    title: "Data Analyst",
    company: "Analytics",
    skills: [
      "python",
      "sql",
      "excel",
      "tableau",
      "power bi",
      "statistics",
      "pandas",
      "data analysis",
    ],
  },
  {
    title: "DevOps Engineer",
    company: "Infrastructure",
    skills: [
      "docker",
      "kubernetes",
      "aws",
      "azure",
      "gcp",
      "linux",
      "ci/cd",
      "jenkins",
    ],
  },
];

function normalize(text = "") {
  return text
    .toLowerCase()
    .replace(/[^\w\s+#.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

router.get(
  "/resume/:resumeId",
  authMiddleware,
  async (req, res) => {
    try {
      const resume = await Resume.findOne({
        _id: req.params.resumeId,
        userId: req.user._id,
      });

      if (!resume) {
        return res.status(404).json({
          success: false,
          message: "Resume not found.",
        });
      }

      const text = normalize(
        resume.extractedText
      );

      if (!text) {
        return res.status(400).json({
          success: false,
          message:
            "No readable resume content found.",
        });
      }

      const matches = roles.map((role) => {
        const matchedSkills =
          role.skills.filter((skill) =>
            text.includes(skill.toLowerCase())
          );

        const missingSkills =
          role.skills.filter(
            (skill) =>
              !text.includes(skill.toLowerCase())
          );

        const percentage = Math.round(
          (matchedSkills.length /
            role.skills.length) *
            100
        );

        return {
          title: role.title,
          company: role.company,
          matchPercentage: percentage,
          matchedSkills,
          missingSkills,
        };
      });

      matches.sort(
        (a, b) =>
          b.matchPercentage -
          a.matchPercentage
      );

      res.json({
        success: true,
        resumeId: resume._id,
        matches,
      });
    } catch (error) {
      console.error(
        "Role matching error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to generate role matches.",
      });
    }
  }
);

export default router;