import express from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import Resume from "../models/Resume.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Only PDF, DOC and DOCX files are allowed."
        )
      );
    }

    cb(null, true);
  },
});


/* =========================================
   GET USER RESUMES
========================================= */

router.get("/", authMiddleware, async (req, res) => {
  try {
    const resumes = await Resume.find({
      userId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      resumes,
    });
  } catch (error) {
    console.error("Get resumes error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch resumes.",
    });
  }
});


/* =========================================
   UPLOAD + EXTRACT RESUME
========================================= */

router.post(
  "/upload",
  authMiddleware,
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select a resume file.",
        });
      }

      let extractedText = "";

      /* PDF */

      if (
        req.file.mimetype ===
        "application/pdf"
      ) {
        const pdfData = await pdfParse(
          req.file.buffer
        );

        extractedText = pdfData.text;
      }

      /* DOCX */

      else if (
        req.file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const result =
          await mammoth.extractRawText({
            buffer: req.file.buffer,
          });

        extractedText = result.value;
      }

      /* DOC */

      else {
        return res.status(400).json({
          success: false,
          message:
            "Old .doc files are not supported. Please save the resume as PDF or DOCX.",
        });
      }

      extractedText =
        extractedText
          .replace(/\r/g, "")
          .replace(/\n{3,}/g, "\n\n")
          .trim();

      if (!extractedText) {
        return res.status(400).json({
          success: false,
          message:
            "Could not extract text from this resume.",
        });
      }

      const resume = await Resume.create({
        userId: req.user._id,

        fileName: req.file.originalname,

        fileType: req.file.mimetype,

        fileSize: req.file.size,

        extractedText,

        uploadedAt: new Date(),
      });

      res.status(201).json({
        success: true,
        message:
          "Resume uploaded and analyzed successfully.",

        resume: {
          _id: resume._id,
          fileName: resume.fileName,
          fileType: resume.fileType,
          fileSize: resume.fileSize,
          extractedText: resume.extractedText,
          uploadedAt: resume.uploadedAt,
          createdAt: resume.createdAt,
        },
      });
    } catch (error) {
      console.error(
        "Resume upload error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error.message ||
          "Resume upload failed.",
      });
    }
  }
);


/* =========================================
   GET ONE RESUME
========================================= */

router.get(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const resume = await Resume.findOne({
        _id: req.params.id,
        userId: req.user._id,
      });

      if (!resume) {
        return res.status(404).json({
          success: false,
          message: "Resume not found.",
        });
      }

      res.json({
        success: true,
        resume,
      });
    } catch (error) {
      console.error(
        "Get resume error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch resume.",
      });
    }
  }
);


/* =========================================
   DELETE RESUME
========================================= */

router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const resume =
        await Resume.findOneAndDelete({
          _id: req.params.id,
          userId: req.user._id,
        });

      if (!resume) {
        return res.status(404).json({
          success: false,
          message: "Resume not found.",
        });
      }

      res.json({
        success: true,
        message:
          "Resume deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete resume error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to delete resume.",
      });
    }
  }
);


export default router;