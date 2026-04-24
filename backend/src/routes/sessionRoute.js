import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { rateLimitPasswordAttempts } from "../middleware/rateLimiter.js";
import {
  createSession,
  endSession,
  getActiveSessions,
  getMyRecentSessions,
  getMySessions,
  getSessionById,
  joinSession,
  searchSessions,
  deleteSession,
  updateSessionProblem,
  updateProctoringData,
} from "../controllers/sessionController.js";

const router = express.Router();

router.post("/", protectRoute, createSession);
router.get("/active", protectRoute, getActiveSessions);
router.get("/my-recent", protectRoute, getMyRecentSessions);
router.get("/my-sessions", protectRoute, getMySessions);
router.get("/search", protectRoute, searchSessions);

router.get("/:id", protectRoute, getSessionById);
router.put("/:id/problem", protectRoute, updateSessionProblem);
router.post("/:id/join", protectRoute, rateLimitPasswordAttempts, joinSession);
router.post("/:id/end", protectRoute, endSession);
router.post("/:id/proctoring", protectRoute, updateProctoringData);
router.delete("/:id", protectRoute, deleteSession);

export default router;

