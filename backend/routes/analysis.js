import express from "express";
import Resume from "../models/Resume.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

function normalizeText(text = "") {
  return text
    .toLowerCase()
    .replace(/[^\w\s+#.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function contains(text, keyword) {
  return text.includes(keyword.toLowerCase());
}

function countMatches(text, keywords) {
  return keywords.filter((keyword) =>
    contains(text, keyword)
  ).length;
}

function calculateSkills(text) {
  const skillGroups = {
    frontend: [
      "react",
      "javascript",
      "typescript",
      "html",
      "css",
      "next.js",
      "nextjs",
      "tailwind",
      "redux",
    ],

    backend: [
      "node.js",
      "nodejs",
      "express",
      "python",
      "java",
      "rest api",
      "graphql",
    ],

    database: [
      "mongodb",
      "mysql",
      "postgresql",
      "sql",
      "redis",
      "firebase",
    ],

    testing: [
      "jest",
      "vitest",
      "cypress",
      "playwright",
      "testing",
      "unit testing",
      "integration testing",
    ],

    cloud: [
      "aws",
      "azure",
      "gcp",
      "docker",
      "kubernetes",
      "ci/cd",
    ],
  };

  const found = [];

  Object.values(skillGroups)
    .flat()
    .forEach((skill) => {
      if (contains(text, skill)) {
        found.push(skill);
      }
    });

  return [...new Set(found)];
}

function calculateATS(text) {
  let score = 0;

  const sections = [
    "experience",
    "education",
    "skills",
    "projects",
    "summary",
  ];

  sections.forEach((section) => {
    if (contains(text, section)) {
      score += 12;
    }
  });

  const technicalKeywords = [
    "react",
    "javascript",
    "typescript",
    "python",
    "java",
    "node",
    "sql",
    "mongodb",
    "aws",
    "docker",
  ];

  score += Math.min(
    countMatches(text, technicalKeywords) * 4,
    28
  );

  const achievementWords = [
    "increased",
    "improved",
    "reduced",
    "achieved",
    "built",
    "developed",
    "led",
    "optimized",
  ];

  score += Math.min(
    countMatches(text, achievementWords) * 3,
    15
  );

  return Math.min(score, 100);
}

function calculateProfileStrength(
  atsScore,
  skills,
  text
) {
  let score = atsScore;

  if (skills.length >= 8) {
    score += 5;
  }

  if (text.length >= 1500) {
    score += 5;
  }

  return Math.min(score, 100);
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

      const rawText =
        resume.extractedText || "";

      const text = normalizeText(rawText);

      if (!text) {
        return res.status(400).json({
          success: false,
          message:
            "This resume does not contain readable text.",
        });
      }

      const skills = calculateSkills(text);

      const atsScore = calculateATS(text);

      const profileStrength =
        calculateProfileStrength(
          atsScore,
          skills,
          text
        );

      const strengths = [];

      if (
        contains(text, "react") ||
        contains(text, "javascript")
      ) {
        strengths.push(
          "Strong frontend technology coverage"
        );
      }

      if (contains(text, "experience")) {
        strengths.push(
          "Professional experience section detected"
        );
      }

      if (contains(text, "projects")) {
        strengths.push(
          "Projects section detected"
        );
      }

      if (skills.length >= 5) {
        strengths.push(
          "Good technical skill coverage"
        );
      }

      const improvements = [];

      if (!contains(text, "typescript")) {
        improvements.push(
          "Consider adding TypeScript experience"
        );
      }

      if (
        !contains(text, "testing") &&
        !contains(text, "jest") &&
        !contains(text, "cypress")
      ) {
        improvements.push(
          "Add testing experience"
        );
      }

      if (
        !contains(text, "achieved") &&
        !contains(text, "increased") &&
        !contains(text, "reduced") &&
        !contains(text, "improved")
      ) {
        improvements.push(
          "Add measurable achievements"
        );
      }

      if (skills.length < 5) {
        improvements.push(
          "Increase relevant technical keyword coverage"
        );
      }

      const skillAnalysis = skills.map(
        (skill) => ({
          name: skill,
          level: "Detected",
          progress: 100,
        })
      );

      res.json({
        success: true,

        analysis: {
          resumeId: resume._id,

          atsScore,

          skillsFound: skills.length,

          profileStrength,

          skills,

          skillAnalysis,

          strengths,

          improvements,

          textLength: rawText.length,
        },
      });
    } catch (error) {
      console.error(
        "Resume analysis error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to analyze resume.",
      });
    }
  }
);

export default router;