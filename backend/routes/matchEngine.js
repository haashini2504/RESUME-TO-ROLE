import express from "express";
import Resume from "../models/Resume.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| ROLE DATABASE
|--------------------------------------------------------------------------
| These are role definitions, not demo users.
| The candidate is matched against the skill requirements of each role.
*/

const ROLE_DATABASE = [
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    category: "Software Development",

    requiredSkills: [
      "react",
      "javascript",
      "html",
      "css",
    ],

    preferredSkills: [
      "typescript",
      "next.js",
      "nextjs",
      "tailwind",
      "redux",
      "testing",
      "jest",
    ],

    keywords: [
      "frontend",
      "front end",
      "ui",
      "user interface",
      "web development",
    ],
  },

  {
    id: "backend-developer",
    title: "Backend Developer",
    category: "Software Development",

    requiredSkills: [
      "node.js",
      "nodejs",
      "express",
      "javascript",
      "rest api",
    ],

    preferredSkills: [
      "mongodb",
      "mysql",
      "postgresql",
      "sql",
      "redis",
      "docker",
      "python",
      "java",
    ],

    keywords: [
      "backend",
      "back end",
      "server",
      "api",
      "microservices",
    ],
  },

  {
    id: "full-stack-developer",
    title: "Full Stack Developer",
    category: "Software Development",

    requiredSkills: [
      "javascript",
      "react",
      "html",
      "css",
    ],

    preferredSkills: [
      "node.js",
      "nodejs",
      "express",
      "mongodb",
      "sql",
      "typescript",
      "docker",
      "rest api",
    ],

    keywords: [
      "full stack",
      "full-stack",
      "web application",
      "web development",
    ],
  },

  {
    id: "software-engineer",
    title: "Software Engineer",
    category: "Software Development",

    requiredSkills: [
      "programming",
      "git",
      "software development",
    ],

    preferredSkills: [
      "javascript",
      "python",
      "java",
      "sql",
      "testing",
      "docker",
      "api",
      "data structures",
      "algorithms",
    ],

    keywords: [
      "software engineer",
      "software developer",
      "engineering",
      "application development",
    ],
  },

  {
    id: "data-analyst",
    title: "Data Analyst",
    category: "Data & Analytics",

    requiredSkills: [
      "sql",
      "excel",
      "data analysis",
    ],

    preferredSkills: [
      "python",
      "pandas",
      "numpy",
      "tableau",
      "power bi",
      "statistics",
      "data visualization",
    ],

    keywords: [
      "data analyst",
      "data analysis",
      "analytics",
      "business intelligence",
    ],
  },

  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    category: "Cloud & Infrastructure",

    requiredSkills: [
      "linux",
      "git",
      "docker",
    ],

    preferredSkills: [
      "kubernetes",
      "aws",
      "azure",
      "gcp",
      "jenkins",
      "ci/cd",
      "terraform",
      "monitoring",
    ],

    keywords: [
      "devops",
      "dev ops",
      "cloud",
      "infrastructure",
      "deployment",
    ],
  },
];


/*
|--------------------------------------------------------------------------
| NORMALIZE TEXT
|--------------------------------------------------------------------------
*/

function normalizeText(text = "") {
  return text
    .toLowerCase()
    .replace(/\r/g, " ")
    .replace(/\n/g, " ")
    .replace(/[^\w\s+#./-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}


/*
|--------------------------------------------------------------------------
| SKILL ALIASES
|--------------------------------------------------------------------------
*/

const SKILL_ALIASES = {
  react: [
    "react",
    "react.js",
    "reactjs",
  ],

  javascript: [
    "javascript",
    "java script",
    "js",
  ],

  typescript: [
    "typescript",
    "type script",
    "ts",
  ],

  html: [
    "html",
    "html5",
  ],

  css: [
    "css",
    "css3",
  ],

  "node.js": [
    "node.js",
    "nodejs",
    "node js",
  ],

  express: [
    "express",
    "express.js",
    "expressjs",
  ],

  mongodb: [
    "mongodb",
    "mongo db",
    "mongo",
  ],

  mysql: [
    "mysql",
  ],

  postgresql: [
    "postgresql",
    "postgres",
  ],

  sql: [
    "sql",
  ],

  python: [
    "python",
  ],

  java: [
    "java",
  ],

  docker: [
    "docker",
  ],

  kubernetes: [
    "kubernetes",
    "k8s",
  ],

  aws: [
    "aws",
    "amazon web services",
  ],

  azure: [
    "azure",
  ],

  gcp: [
    "gcp",
    "google cloud",
    "google cloud platform",
  ],

  git: [
    "git",
    "github",
    "gitlab",
  ],

  "rest api": [
    "rest api",
    "restful api",
    "restful",
    "api development",
  ],

  graphql: [
    "graphql",
  ],

  redux: [
    "redux",
  ],

  nextjs: [
    "next.js",
    "nextjs",
    "next js",
  ],

  tailwind: [
    "tailwind",
    "tailwindcss",
  ],

  testing: [
    "testing",
    "unit testing",
    "integration testing",
    "software testing",
  ],

  jest: [
    "jest",
  ],

  cypress: [
    "cypress",
  ],

  playwright: [
    "playwright",
  ],

  excel: [
    "excel",
    "microsoft excel",
  ],

  pandas: [
    "pandas",
  ],

  numpy: [
    "numpy",
  ],

  tableau: [
    "tableau",
  ],

  "power bi": [
    "power bi",
    "powerbi",
  ],

  statistics: [
    "statistics",
    "statistical analysis",
  ],

  "data analysis": [
    "data analysis",
    "data analytics",
  ],

  "data visualization": [
    "data visualization",
    "data visualisation",
  ],

  linux: [
    "linux",
  ],

  jenkins: [
    "jenkins",
  ],

  "ci/cd": [
    "ci/cd",
    "ci cd",
    "continuous integration",
    "continuous deployment",
  ],

  terraform: [
    "terraform",
  ],

  monitoring: [
    "monitoring",
    "prometheus",
    "grafana",
  ],

  programming: [
    "programming",
    "programmer",
    "coding",
    "software development",
  ],

  "software development": [
    "software development",
    "software engineering",
    "application development",
  ],

  "data structures": [
    "data structures",
    "data structure",
  ],

  algorithms: [
    "algorithms",
    "algorithm",
  ],
};


/*
|--------------------------------------------------------------------------
| CHECK WHETHER SKILL EXISTS
|--------------------------------------------------------------------------
*/

function hasSkill(text, skill) {
  const aliases =
    SKILL_ALIASES[skill] || [skill];

  return aliases.some((alias) =>
    text.includes(alias.toLowerCase())
  );
}


/*
|--------------------------------------------------------------------------
| EXTRACT ALL SKILLS
|--------------------------------------------------------------------------
*/

function extractSkills(text) {
  const detected = [];

  for (const skill of Object.keys(
    SKILL_ALIASES
  )) {
    if (hasSkill(text, skill)) {
      detected.push(skill);
    }
  }

  return detected;
}


/*
|--------------------------------------------------------------------------
| EXPERIENCE EXTRACTION
|--------------------------------------------------------------------------
*/

function extractExperience(text) {
  const patterns = [
    /(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)\s+(?:of\s+)?experience/i,

    /experience\s*(?:of|:)?\s*(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match) {
      return Number(match[1]);
    }
  }

  return null;
}


/*
|--------------------------------------------------------------------------
| EDUCATION EXTRACTION
|--------------------------------------------------------------------------
*/

function extractEducation(text) {
  const educationKeywords = [
    "bachelor",
    "b.tech",
    "btech",
    "b.e",
    "be ",
    "master",
    "m.tech",
    "mtech",
    "m.e",
    "me ",
    "mba",
    "bsc",
    "b.sc",
    "msc",
    "m.sc",
    "degree",
    "diploma",
  ];

  return educationKeywords.filter(
    (keyword) =>
      text.includes(keyword)
  );
}


/*
|--------------------------------------------------------------------------
| PROJECT DETECTION
|--------------------------------------------------------------------------
*/

function detectProjects(text) {
  return (
    text.includes("projects") ||
    text.includes("project experience") ||
    text.includes("personal projects")
  );
}


/*
|--------------------------------------------------------------------------
| ACHIEVEMENT DETECTION
|--------------------------------------------------------------------------
*/

function detectAchievements(text) {
  const achievementWords = [
    "increased",
    "improved",
    "reduced",
    "saved",
    "achieved",
    "generated",
    "optimized",
    "optimised",
    "led",
    "built",
    "developed",
    "launched",
    "delivered",
  ];

  return achievementWords.filter(
    (word) => text.includes(word)
  );
}


/*
|--------------------------------------------------------------------------
| PROFILE EXTRACTION
|--------------------------------------------------------------------------
*/

function buildCandidateProfile(text) {
  const skills = extractSkills(text);

  const experience =
    extractExperience(text);

  const education =
    extractEducation(text);

  const projects =
    detectProjects(text);

  const achievements =
    detectAchievements(text);

  return {
    skills,
    skillCount: skills.length,
    experienceYears: experience,
    education,
    hasProjects: projects,
    achievements,
  };
}


/*
|--------------------------------------------------------------------------
| ROLE MATCHING
|--------------------------------------------------------------------------
*/

function calculateRoleMatch(
  text,
  candidateSkills,
  role
) {
  const requiredMatched =
    role.requiredSkills.filter(
      (skill) =>
        hasSkill(text, skill)
    );

  const requiredMissing =
    role.requiredSkills.filter(
      (skill) =>
        !hasSkill(text, skill)
    );

  const preferredMatched =
    role.preferredSkills.filter(
      (skill) =>
        hasSkill(text, skill)
    );

  const preferredMissing =
    role.preferredSkills.filter(
      (skill) =>
        !hasSkill(text, skill)
    );

  /*
   * Required skills carry more weight.
   */

  const requiredScore =
    role.requiredSkills.length > 0
      ? (requiredMatched.length /
          role.requiredSkills.length) *
        65
      : 0;

  /*
   * Preferred skills carry less weight.
   */

  const preferredScore =
    role.preferredSkills.length > 0
      ? (preferredMatched.length /
          role.preferredSkills.length) *
        25
      : 0;

  /*
   * Resume relevance keywords.
   */

  const keywordMatches =
    role.keywords.filter(
      (keyword) =>
        text.includes(
          keyword.toLowerCase()
        )
    );

  const keywordScore =
    role.keywords.length > 0
      ? Math.min(
          (keywordMatches.length /
            role.keywords.length) *
            10,
          10
        )
      : 0;

  let score =
    requiredScore +
    preferredScore +
    keywordScore;

  /*
   * Small bonus for broader skill coverage.
   */

  if (candidateSkills.length >= 8) {
    score += 3;
  }

  score = Math.min(
    Math.round(score),
    100
  );

  return {
    roleId: role.id,

    title: role.title,

    category: role.category,

    matchPercentage: score,

    matchedSkills: [
      ...new Set([
        ...requiredMatched,
        ...preferredMatched,
      ]),
    ],

    missingSkills: [
      ...new Set([
        ...requiredMissing,
        ...preferredMissing,
      ]),
    ],

    requiredSkills: role.requiredSkills,

    preferredSkills: role.preferredSkills,

    keywordMatches,

    requiredCoverage:
      role.requiredSkills.length
        ? Math.round(
            (requiredMatched.length /
              role.requiredSkills.length) *
              100
          )
        : 0,

    preferredCoverage:
      role.preferredSkills.length
        ? Math.round(
            (preferredMatched.length /
              role.preferredSkills.length) *
              100
          )
        : 0,
  };
}


/*
|--------------------------------------------------------------------------
| WHY MATCH?
|--------------------------------------------------------------------------
*/

function generateWhyMatch(match) {
  const reasons = [];

  if (match.requiredCoverage >= 75) {
    reasons.push(
      "You already have most of the core skills required for this role."
    );
  }

  if (match.matchedSkills.length >= 5) {
    reasons.push(
      `Your resume contains ${match.matchedSkills.length} relevant skills for this role.`
    );
  }

  if (match.keywordMatches.length > 0) {
    reasons.push(
      "Your resume contains experience related to this career area."
    );
  }

  if (reasons.length === 0) {
    reasons.push(
      "Some relevant skills were detected, but additional preparation is recommended."
    );
  }

  return reasons;
}


/*
|--------------------------------------------------------------------------
| LEARNING ROADMAP
|--------------------------------------------------------------------------
*/

function buildRoadmap(
  bestMatch,
  candidateSkills
) {
  const missing =
    bestMatch.missingSkills || [];

  const roadmap = [];

  const priority = [
    "typescript",
    "javascript",
    "react",
    "node.js",
    "express",
    "mongodb",
    "sql",
    "rest api",
    "testing",
    "jest",
    "docker",
    "aws",
    "kubernetes",
    "python",
    "data analysis",
    "pandas",
    "tableau",
    "power bi",
  ];

  const orderedMissing =
    priority.filter((skill) =>
      missing.includes(skill)
    );

  const remainingMissing =
    missing.filter(
      (skill) =>
        !orderedMissing.includes(skill)
    );

  const finalSkills = [
    ...orderedMissing,
    ...remainingMissing,
  ].slice(0, 5);

  finalSkills.forEach(
    (skill, index) => {
      roadmap.push({
        step: index + 1,
        skill,
        reason: `Develop ${skill} to improve your ${bestMatch.title} match.`,
      });
    }
  );

  if (
    roadmap.length === 0
  ) {
    roadmap.push({
      step: 1,
      skill: "Advanced projects",
      reason:
        "Your resume already covers the major skills for this role. Strengthen your profile with measurable projects and achievements.",
    });
  }

  return roadmap;
}


/*
|--------------------------------------------------------------------------
| GET MATCH ENGINE
|--------------------------------------------------------------------------
|
| GET /api/match-engine/resume/:resumeId
|
*/

router.get(
  "/resume/:resumeId",
  authMiddleware,
  async (req, res) => {
    try {
      /*
       * Find ONLY the logged-in user's resume.
       */

      const resume =
        await Resume.findOne({
          _id: req.params.resumeId,
          userId: req.user._id,
        });

      if (!resume) {
        return res.status(404).json({
          success: false,
          message:
            "Resume not found or you do not have access to it.",
        });
      }

      const rawText =
        resume.extractedText || "";

      if (!rawText.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "This resume does not contain readable text.",
        });
      }

      const text =
        normalizeText(rawText);

      /*
       * Build candidate profile.
       */

      const candidate =
        buildCandidateProfile(text);

      /*
       * Match against every role.
       */

      const matches =
        ROLE_DATABASE.map((role) =>
          calculateRoleMatch(
            text,
            candidate.skills,
            role
          )
        );

      /*
       * Highest match first.
       */

      matches.sort(
        (a, b) =>
          b.matchPercentage -
          a.matchPercentage
      );

      const bestMatch =
        matches[0];

      /*
       * Generate explanations.
       */

      const enrichedMatches =
        matches.map((match) => ({
          ...match,

          whyYouMatch:
            generateWhyMatch(match),
        }));

      /*
       * Personalized roadmap.
       */

      const roadmap =
        buildRoadmap(
          bestMatch,
          candidate.skills
        );

      /*
       * Overall profile score.
       */

      const profileScore =
        Math.min(
          Math.round(
            Math.min(
              candidate.skillCount * 7,
              60
            ) +
              (candidate.hasProjects
                ? 15
                : 0) +
              (candidate.achievements
                .length > 0
                ? 15
                : 0) +
              (candidate.education
                .length > 0
                ? 10
                : 0)
          ),
          100
        );

      res.json({
        success: true,

        matchEngine: {
          resumeId: resume._id,

          resumeName:
            resume.fileName,

          candidate: {
            profileScore,

            skills:
              candidate.skills,

            skillCount:
              candidate.skillCount,

            experienceYears:
              candidate.experienceYears,

            education:
              candidate.education,

            hasProjects:
              candidate.hasProjects,

            achievements:
              candidate.achievements,
          },

          bestMatch: {
            ...bestMatch,

            whyYouMatch:
              generateWhyMatch(
                bestMatch
              ),
          },

          matches:
            enrichedMatches,

          roadmap,
        },
      });
    } catch (error) {
      console.error(
        "Match Engine error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to generate Match Engine results.",
      });
    }
  }
);


/*
|--------------------------------------------------------------------------
| GET AVAILABLE ROLES
|--------------------------------------------------------------------------
|
| Useful for frontend dropdowns / future expansion.
|
*/

router.get(
  "/roles",
  authMiddleware,
  (req, res) => {
    const availableRoles =
      ROLE_DATABASE.map((role) => ({
        id: role.id,
        title: role.title,
        category: role.category,
      }));

    res.json({
      success: true,
      roles: availableRoles,
    });
  }
);


export { normalizeText, SKILL_ALIASES, hasSkill, extractSkills, extractExperience, extractEducation, detectProjects, detectAchievements, buildCandidateProfile, calculateRoleMatch, generateWhyMatch, buildRoadmap };

export default router;