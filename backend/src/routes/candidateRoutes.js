import express from "express";
import {
  joinSessionAsCandidate,
  uploadResume,
  startCandidateInterview,
  getSessionPublic,
} from "../controllers/candidateController.js";
import { resumeUpload } from "../middleware/resumeUpload.js";

const router = express.Router();

// All routes here are PUBLIC — no Clerk auth required

// Get session info (public-safe fields only)
router.get("/session/:id", getSessionPublic);

// Join session with password
router.post("/join", joinSessionAsCandidate);

// Upload resume (requires candidate JWT token)
router.post("/upload-resume", resumeUpload.single("resume"), uploadResume);

// Start the AI interview
router.post("/start-interview", startCandidateInterview);

export default router;
