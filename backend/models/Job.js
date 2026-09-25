import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, default: "", trim: true },
    employmentType: { type: String, default: "Full-time", trim: true },
    description: { type: String, default: "" },
    requiredSkills: { type: [String], default: [] },
    experienceRequired: { type: String, default: "" },
    status: { type: String, enum: ["active", "closed"], default: "active" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Job", jobSchema);