import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();
const VALID_ROLES = new Set(["candidate", "student", "recruiter"]);

function normalizeRole(role) {
  const value = String(role || "").trim().toLowerCase();
  if (value === "jobseeker") return "candidate";
  return VALID_ROLES.has(value) ? value : null;
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    onboardingComplete: Boolean(user.onboardingComplete),
  };
}

router.post("/register", async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    const role = normalizeRole(req.body?.role);

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and a valid role are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please sign in.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      onboardingComplete: false,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed.",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    const requestedRole = req.body?.role ? normalizeRole(req.body.role) : null;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const actualRole = normalizeRole(user.role) || "candidate";

    // If the UI has a selected role, enforce it. This prevents a recruiter
    // account from silently opening the candidate dashboard and vice versa.
    if (requestedRole && requestedRole !== actualRole) {
      return res.status(403).json({
        success: false,
        message: `This account is registered as ${actualRole}. Choose that role to continue.`,
        actualRole,
      });
    }

    if (user.role !== actualRole) {
      user.role = actualRole;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: actualRole },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login successful.",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed.",
    });
  }
});

router.patch("/me", async (req, res) => {
  return res.status(401).json({
    success: false,
    message: "Authentication required.",
  });
});

export default router;
