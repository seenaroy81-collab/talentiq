import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    question: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      default: "dsa",
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    tags: [String],
  },
  { timestamps: true }
);

// Add text search index
questionSchema.index({ title: "text", question: "text" });

const Question = mongoose.model("Question", questionSchema);

export default Question;
