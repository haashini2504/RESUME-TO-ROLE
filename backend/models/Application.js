import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },

    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
    },

    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Interview", "Rejected"],
      default: "Applied",
    },

    matchResult: {
      type: Object,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Application", applicationSchema);