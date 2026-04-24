import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const sessionSchema = new mongoose.Schema(
  {
    sessionName: {
      type: String,
      required: true,
      trim: true,
    },
    problem: {
      type: String,
      default: "",
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard", ""],
      default: "",
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
    },
    maxDuration: {
      type: Number, // in minutes
      default: 60,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    // stream video call ID
    callId: {
      type: String,
      default: "",
    },
    // Proctoring Data
    proctoringData: {
      violations: [
        {
          type: { type: String, required: true },
          timestamp: { type: Date, default: Date.now },
          metadata: { type: mongoose.Schema.Types.Mixed },
        },
      ],
      heatmapData: [
        {
          x: { type: Number, required: true },
          y: { type: Number, required: true },
          timestamp: { type: Date, default: Date.now },
        },
      ],
      lastStats: {
        wpm: { type: Number, default: 0 },
        mouseRegion: { type: String, default: "Center" },
        isTabActive: { type: Boolean, default: true },
        faceDetected: { type: Boolean, default: true },
        gazeStatus: { type: String, default: "On Screen" },
      },
    },
    // === Autonomous AI Interview Fields ===
    expiresAt: {
      type: Date,
      default: null,
    },
    customQuestions: [
      {
        question: { type: String, required: true },
        category: { type: String, default: "general" },
      },
    ],
    isAI: {
      type: Boolean,
      default: true,
    },
    resumeRequired: {
      type: Boolean,
      default: true,
    },
    candidateEmail: {
      type: String,
      default: "",
    },
    interviewerEmail: {
      type: String,
      default: "",
    },
    questionCount: {
      type: Number,
      default: 5,
    },
    questionMode: {
      type: String,
      enum: ["ai", "manual", "mixed"],
      default: "mixed",
    },
    // === Coding Interview Fields ===
    interviewType: {
      type: String,
      enum: ["qa", "coding"],
      default: "qa",
    },
    codingLanguages: {
      type: [String],
      default: ["javascript"],
    },
    codingTopics: {
      type: [String],
      default: ["Arrays", "Strings"],
    },
    enableAIHelp: {
      type: Boolean,
      default: true,
    },
    aiHelpButton: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving
sessionSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for authentication
sessionSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

const Session = mongoose.model("Session", sessionSchema);

export default Session;
