import jwt from "jsonwebtoken";
import Session from "../models/Session.js";
import AIInterview from "../models/AIInterview.js";
import { processResume } from "../services/resumeService.js";
import { ENV } from "../lib/env.js";

const JWT_SECRET = ENV.JWT_SECRET || "talent-iq-candidate-secret-key";

/**
 * PUBLIC: Candidate joins a session with session ID + password.
 * No Clerk auth required.
 */
export async function joinSessionAsCandidate(req, res) {
  try {
    const { sessionId, password } = req.body;

    if (!sessionId || !password) {
      return res.status(400).json({ message: "Session ID and password are required" });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check if session is active
    if (session.status !== "active") {
      return res.status(400).json({ message: "This session has already been completed" });
    }

    // Check expiry
    if (session.expiresAt && new Date() > new Date(session.expiresAt)) {
      return res.status(400).json({ message: "This session has expired" });
    }

    // Verify password
    const isPasswordCorrect = await session.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate a temporary JWT token for the candidate
    const candidateToken = jwt.sign(
      {
        sessionId: session._id.toString(),
        role: "candidate",
        sessionName: session.sessionName,
      },
      JWT_SECRET,
      { expiresIn: `${session.maxDuration + 30}m` } // Token valid for session duration + 30 min buffer
    );

    // Return session config (without password)
    const sessionConfig = {
      _id: session._id,
      sessionName: session.sessionName,
      description: session.description,
      difficulty: session.difficulty,
      maxDuration: session.maxDuration,
      resumeRequired: session.resumeRequired,
      customQuestions: session.customQuestions,
      isAI: session.isAI,
      expiresAt: session.expiresAt,
    };

    res.status(200).json({
      session: sessionConfig,
      token: candidateToken,
      message: "Session joined successfully",
    });
  } catch (error) {
    console.error("Error in joinSessionAsCandidate:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * PUBLIC: Upload resume for a session.
 * Requires candidate JWT token.
 */
export async function uploadResume(req, res) {
  try {
    // Verify candidate token
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Process the resume
    const result = await processResume(req.file);

    res.status(200).json({
      message: "Resume uploaded successfully",
      resumeUrl: result.url,
      resumeText: result.extractedText,
      filename: result.filename,
    });
  } catch (error) {
    console.error("Error in uploadResume:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * PUBLIC: Start the AI interview for a candidate.
 * Creates an AIInterview document linked to the session.
 */
export async function startCandidateInterview(req, res) {
  try {
    // Verify candidate token
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const { candidateName, candidateEmail, resumeUrl, resumeText } = req.body;
    const sessionId = decoded.sessionId;

    // Fetch session to get custom questions and config
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check expiry again
    if (session.expiresAt && new Date() > new Date(session.expiresAt)) {
      return res.status(400).json({ message: "This session has expired" });
    }

    // Build the custom questions prompt
    let customQuestionsPrompt = "";
    if (session.customQuestions && session.customQuestions.length > 0) {
      customQuestionsPrompt = session.customQuestions
        .map((q, i) => `  Q${i + 1}: ${q.question} (${q.category})`)
        .join("\n");
    }

    // Build the resume context prompt
    let resumeContextPrompt = "";
    if (resumeText) {
      resumeContextPrompt = `\n\nCANDIDATE RESUME CONTEXT (use this to personalize questions):\n${resumeText.slice(0, 3000)}`;
    }

    const questionCount = session.questionCount || session.customQuestions?.length || 5;
    const difficulty = session.difficulty || "Medium";
    const jobDescription = session.description || session.sessionName;

    // Build welcome message
    const isCodingInterview = session.interviewType === "coding";
    const welcomeContent = isCodingInterview
      ? `Hello ${candidateName || "Candidate"}, welcome to your AI Coding Interview! I'll present you with ${questionCount} coding challenges at ${difficulty} difficulty level. You'll write your solution in the code editor and submit when ready. Good luck!`
      : `Hello ${candidateName || "Candidate"}, I am your AI interviewer today. I'll be conducting your interview for the "${jobDescription}" position. I will ask you ${questionCount} questions at a ${difficulty} difficulty level. When you're ready, say "start" or "begin" and we'll get started!`;

    // Create AI Interview linked to this session
    const interview = await AIInterview.create({
      interviewerId: session.host.toString(),
      candidateName: candidateName || "Candidate",
      candidateEmail: candidateEmail || "",
      jobDescription,
      sessionId: session._id,
      resumeUrl: resumeUrl || "",
      resumeText: resumeText || "",
      questionCount,
      difficulty:
        difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase(),
      status: "pending",
      interviewType: session.interviewType || "qa",
      conversation: [
        {
          role: "ai",
          content: welcomeContent,
        },
      ],
    });

    // Update session with candidate email
    if (candidateEmail) {
      session.candidateEmail = candidateEmail;
      await session.save();
    }

    // Generate a new token that includes the interview ID
    const interviewToken = jwt.sign(
      {
        sessionId: session._id.toString(),
        interviewId: interview._id.toString(),
        role: "candidate",
      },
      JWT_SECRET,
      { expiresIn: `${session.maxDuration + 30}m` }
    );

    res.status(201).json({
      interview,
      token: interviewToken,
      customQuestionsPrompt,
      resumeContextPrompt,
    });
  } catch (error) {
    console.error("Error in startCandidateInterview:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * PUBLIC: Get session info by ID (limited, public-safe fields only).
 */
export async function getSessionPublic(req, res) {
  try {
    const { id } = req.params;

    const session = await Session.findById(id).select(
      "sessionName description difficulty maxDuration resumeRequired expiresAt status isAI customQuestions"
    );

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check expiry
    const isExpired = session.expiresAt && new Date() > new Date(session.expiresAt);

    res.status(200).json({
      session: {
        ...session.toObject(),
        isExpired,
        questionCount: session.customQuestions?.length || 0,
      },
    });
  } catch (error) {
    console.error("Error in getSessionPublic:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
