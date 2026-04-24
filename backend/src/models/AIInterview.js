import mongoose from "mongoose";

const aiInterviewSchema = new mongoose.Schema(
    {
        interviewerId: {
            type: String,
            required: true,
        },
        candidateName: {
            type: String,
            required: true, // For demo purposes, we might just use a placeholder if anonymous
        },
        jobDescription: {
            type: String,
            required: true,
        },
        questionCount: {
            type: Number,
            default: 5,
        },
        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Medium",
        },
        status: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending",
        },
        // === Interview Type: "qa" (default chat) or "coding" (Monaco editor) ===
        interviewType: {
            type: String,
            enum: ["qa", "coding"],
            default: "qa",
        },
        conversation: [
            {
                role: { type: String, enum: ["ai", "candidate"], required: true },
                content: { type: String, required: true },
                feedback: { type: String }, // AI's internal feedback on the candidate's last answer
                idealAnswer: { type: String }, // What the AI thinks a good answer would have been
                score: { type: Number, min: 0, max: 10 }, // Numeric rating of the candidate's answer
                timestamp: { type: Date, default: Date.now },
            },
        ],
        // === Coding Interview: DSA Questions ===
        codingQuestions: [
            {
                title: { type: String, required: true },
                description: { type: String, required: true },
                examples: [
                    {
                        input: { type: String },
                        output: { type: String },
                        explanation: { type: String },
                    },
                ],
                constraints: [{ type: String }],
                difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
                topic: { type: String, default: "General" },
                hints: [{ type: String }],
            },
        ],
        // === Coding Interview: Code Submissions ===
        codeSubmissions: [
            {
                questionIndex: { type: Number, required: true },
                language: { type: String, required: true },
                code: { type: String, required: true },
                aiReview: {
                    correctness: { type: String, default: "" },
                    timeComplexity: { type: String, default: "" },
                    spaceComplexity: { type: String, default: "" },
                    codeQuality: { type: String, default: "" },
                    suggestions: { type: String, default: "" },
                    score: { type: Number, min: 0, max: 10, default: 0 },
                },
                timestamp: { type: Date, default: Date.now },
            },
        ],
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
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            default: null,
        },
        resumeUrl: {
            type: String,
            default: "",
        },
        resumeText: {
            type: String,
            default: "",
        },
        candidateEmail: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const AIInterview = mongoose.model("AIInterview", aiInterviewSchema);

export default AIInterview;
