import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";
import AIInterview from "../models/AIInterview.js";
import { cacheDel } from "../lib/redis.js";
import { validatePassword, sanitizePassword } from "../lib/passwordValidator.js";

export async function createSession(req, res) {
  try {
    const { problem, difficulty, sessionName, password, description, maxDuration, customQuestions, expiresAt, resumeRequired, isAI, interviewerEmail, questionCount, questionMode, interviewType, codingLanguages, codingTopics, enableAIHelp, aiHelpButton } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    // Validate required fields
    if (!sessionName || !password) {
      return res.status(400).json({
        message: "Session name and password are required",
      });
    }

    // Validate password
    const sanitizedPassword = sanitizePassword(password);
    const passwordValidation = validatePassword(sanitizedPassword);

    if (!passwordValidation.isValid) {
      return res.status(400).json({
        message: "Password validation failed",
        errors: passwordValidation.errors,
      });
    }

    // Generate a unique call id for stream video
    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Create session in db (password will be hashed automatically via pre-save hook)
    const session = await Session.create({
      sessionName,
      problem: problem || "",
      difficulty: difficulty || "",
      password: sanitizedPassword,
      description: description || "",
      maxDuration: maxDuration || 60,
      host: userId,
      callId,
      // New AI interview fields
      customQuestions: customQuestions || [],
      expiresAt: expiresAt || null,
      resumeRequired: resumeRequired !== undefined ? resumeRequired : true,
      isAI: isAI !== undefined ? isAI : true,
      interviewerEmail: interviewerEmail || req.user.email || "",
      questionCount: questionCount || 5,
      questionMode: questionMode || "mixed",
      // Coding interview fields
      interviewType: interviewType || "qa",
      codingLanguages: codingLanguages || ["javascript"],
      codingTopics: codingTopics || [],
      enableAIHelp: enableAIHelp !== undefined ? enableAIHelp : true,
      aiHelpButton: aiHelpButton !== undefined ? aiHelpButton : true,
    });

    // Create stream video call
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: {
          problem,
          difficulty,
          sessionId: session._id.toString(),
          sessionName,
        },
      },
    });

    // Chat messaging
    const channel = chatClient.channel("messaging", callId, {
      name: `${sessionName} - ${problem}`,
      created_by_id: clerkId,
      members: [clerkId],
    });

    await channel.create();

    // Don't send password in response
    const sessionResponse = session.toObject();
    delete sessionResponse.password;

    res.status(201).json({ session: sessionResponse });
  } catch (error) {
    console.log("Error in createSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getActiveSessions(_, res) {
  try {
    const sessions = await Session.find({ 
      status: "active",
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    })
      .select("-password") // Exclude password field
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getActiveSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user._id;

    // Get sessions where user is either host or participant
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMyRecentSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMySessions(req, res) {
  try {
    const userId = req.user._id;
    const { status } = req.query; // Filter by status: 'active', 'completed', or 'all'

    // Build query
    const query = { host: userId };
    if (status && status !== "all") {
      query.status = status;
    }

    const sessions = await Session.find(query)
      .select("-password")
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 });

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMySessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function searchSessions(req, res) {
  try {
    const { search, difficulty, status, page = 1, limit = 20 } = req.query;

    // Build dynamic query
    const query = {};

    if (status) {
      query.status = status;
    } else {
      query.status = "active"; // Default to active sessions
      query.$or = [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ];
    }

    if (difficulty) {
      query.difficulty = difficulty.toLowerCase();
    }

    if (search) {
      // Search in session name or problem title
      query.$or = [
        { sessionName: { $regex: search, $options: "i" } },
        { problem: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [sessions, total] = await Promise.all([
      Session.find(query)
        .select("-password")
        .populate("host", "name profileImage email clerkId")
        .populate("participant", "name profileImage email clerkId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Session.countDocuments(query),
    ]);

    res.status(200).json({
      sessions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.log("Error in searchSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getSessionById(req, res) {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .select("-password") // Don't send password
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    if (!session) return res.status(404).json({ message: "Session not found" });

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!password) {
      return res.status(400).json({ message: "Password is required to join session" });
    }

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.status !== "active") {
      return res.status(400).json({ message: "Cannot join a completed session" });
    }

    if (session.host.toString() === userId.toString()) {
      return res.status(400).json({ message: "Host cannot join their own session as participant" });
    }

    // Check if session is already full - has a participant
    if (session.participant) return res.status(409).json({ message: "Session is full" });

    // Verify password
    const isPasswordCorrect = await session.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    session.participant = userId;
    await session.save();

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    // Don't send password in response
    const sessionResponse = session.toObject();
    delete sessionResponse.password;

    res.status(200).json({ session: sessionResponse });
  } catch (error) {
    console.log("Error in joinSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    // Check if user is the host
    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the host can delete the session" });
    }

    // Delete stream video call if it exists
    try {
      const call = streamClient.video.call("default", session.callId);
      await call.delete({ hard: true });
    } catch (streamError) {
      console.log("Stream video call deletion error (may not exist):", streamError.message);
    }

    // Delete stream chat channel if it exists
    try {
      const channel = chatClient.channel("messaging", session.callId);
      await channel.delete();
    } catch (streamError) {
      console.log("Stream chat channel deletion error (may not exist):", streamError.message);
    }

    // Delete session from database
    await Session.findByIdAndDelete(id);

    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    console.log("Error in deleteSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateSessionProblem(req, res) {
  try {
    const { id } = req.params;
    const { problem, difficulty } = req.body;
    const userId = req.user._id;

    if (!problem || !difficulty) {
      return res.status(400).json({ message: "Problem and difficulty are required" });
    }

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    // Check if user is the host
    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the host can update the problem" });
    }

    // Check if session is active
    if (session.status !== "active") {
      return res.status(400).json({ message: "Cannot update problem for completed session" });
    }

    session.problem = problem;
    session.difficulty = difficulty.toLowerCase();
    await session.save();

    // Don't send password in response
    const sessionResponse = session.toObject();
    delete sessionResponse.password;

    res.status(200).json({ session: sessionResponse, message: "Problem updated successfully" });
  } catch (error) {
    console.log("Error in updateSessionProblem controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    // Check if user is the host
    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the host can end the session" });
    }

    // Check if session is already completed
    if (session.status === "completed") {
      return res.status(400).json({ message: "Session is already completed" });
    }

    // Delete stream video call (handle if not exists)
    try {
      const call = streamClient.video.call("default", session.callId);
      await call.delete({ hard: true });
    } catch (streamError) {
      console.log("Stream video call deletion warning:", streamError.message);
    }

    // Delete stream chat channel (handle if not exists)
    try {
      const channel = chatClient.channel("messaging", session.callId);
      await channel.delete();
    } catch (streamError) {
      console.log("Stream chat channel deletion warning:", streamError.message);
    }

    session.status = "completed";
    await session.save();

    // Don't send password in response
    const sessionResponse = session.toObject();
    delete sessionResponse.password;

    res.status(200).json({ session: sessionResponse, message: "Session ended successfully" });
  } catch (error) {
    console.log("Error in endSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateProctoringData(req, res) {
  try {
    const { id } = req.params;
    const { violation, heatmapPoints, lastStats } = req.body;
    const userId = req.user._id;

    let session = await Session.findById(id);
    let isAIInterview = false;

    if (!session) {
      session = await AIInterview.findById(id);
      isAIInterview = true;
    }

    if (!session) return res.status(404).json({ message: "Session or Interview not found" });

    // Only host or participant/candidate can update proctoring data
    const isHost = isAIInterview 
      ? session.interviewerId === req.user.clerkId 
      : session.host.toString() === userId.toString();
    
    const isParticipant = isAIInterview 
      ? true // In AI interview, the current user is the candidate
      : session.participant?.toString() === userId.toString();

    if (!isHost && !isParticipant) {
      return res.status(403).json({ message: "Not authorized to update proctoring data" });
    }

    const update = {};

    // Push new violation if provided
    if (violation) {
      update.$push = update.$push || {};
      update.$push["proctoringData.violations"] = {
        type: violation.type,
        metadata: violation.metadata,
        timestamp: violation.timestamp || Date.now(),
      };
    }

    // Push heatmap points if provided
    if (heatmapPoints && Array.isArray(heatmapPoints)) {
      update.$push = update.$push || {};
      update.$push["proctoringData.heatmapData"] = {
        $each: heatmapPoints.map((p) => ({
          x: p.x,
          y: p.y,
          timestamp: p.timestamp || Date.now(),
        })),
        $slice: -2000, // Keep last 2000 points to prevent document bloat
      };
    }

    // Update last known stats
    if (lastStats) {
      update.$set = update.$set || {};
      if (lastStats.wpm !== undefined) update.$set["proctoringData.lastStats.wpm"] = lastStats.wpm;
      if (lastStats.mouseRegion) update.$set["proctoringData.lastStats.mouseRegion"] = lastStats.mouseRegion;
      if (lastStats.isTabActive !== undefined) update.$set["proctoringData.lastStats.isTabActive"] = lastStats.isTabActive;
      if (lastStats.faceDetected !== undefined) update.$set["proctoringData.lastStats.faceDetected"] = lastStats.faceDetected;
      if (lastStats.gazeStatus) update.$set["proctoringData.lastStats.gazeStatus"] = lastStats.gazeStatus;
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: "No data provided for update" });
    }

    const TargetModel = isAIInterview ? AIInterview : Session;
    const updatedSession = await TargetModel.findByIdAndUpdate(id, update, { new: true }).select("-password");

    // Invalidate Cache if it's an AI Interview
    if (isAIInterview) {
      await cacheDel(`interview:${id}`);
    }

    res.status(200).json({ session: updatedSession, message: "Proctoring data updated" });
  } catch (error) {
    console.log("Error in updateProctoringData controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
