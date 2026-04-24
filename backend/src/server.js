import express from "express";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { connectRedis } from "./lib/redis.js";
import { inngest, functions } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";
import aiInterviewRoutes from "./routes/aiInterviewRoutes.js";
import codeRoutes from "./routes/codeRoutes.js";
import practiceAIRoutes from "./routes/practiceAIRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";

const app = express();

const __dirname = path.resolve();

// middleware
app.use(express.json());

// Global Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  ENV.CLIENT_URL,
].filter(Boolean);

console.log("CORS Origins Allowed:", allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true
}));
app.use(clerkMiddleware()); // this adds auth field to request object: req.auth()

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/ai-interview", aiInterviewRoutes);
app.use("/api/code", codeRoutes);
app.use("/api/practice-ai", practiceAIRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/questions", questionRoutes);

// Serve uploaded resumes as static files
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: ENV.NODE_ENV
  });
});

// Deployment logic
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) return res.status(404).json({ error: "API route not found" });
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Initialize Socket.io
import { Server } from "socket.io";
import http from "http";

const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", ENV.CLIENT_URL],
    credentials: true,
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  // console.log("Client connected:", socket.id);

  // Join a specific interview room
  socket.on("join-interview", (interviewId) => {
    socket.join(interviewId);
    // console.log(`Socket ${socket.id} joined room ${interviewId}`);
  });

  // RECEIVE Gaze Data from Candidate
  socket.on("send-gaze-data", (data) => {
    const { interviewId, x, y } = data;
    // BROADCAST to everyone else in the room (i.e., the Admin)
    socket.to(interviewId).emit("receive-gaze-data", {
      userId: socket.id,
      x: x, // percentage (0-1)
      y: y  // percentage (0-1)
    });
  });
});

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();
    server.listen(ENV.PORT, "0.0.0.0", () => {
      console.log(`🚀 Server is running on port: ${ENV.PORT}`);
      console.log(`🌍 Environment: ${ENV.NODE_ENV}`);
    });
  } catch (error) {
    console.error("💥 Error starting the server", error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated.');
    process.exit(0);
  });
});

startServer();
