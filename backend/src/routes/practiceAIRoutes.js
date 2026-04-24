import express from "express";
import { getAISuggestion, fixCode } from "../controllers/practiceAIController.js";

const router = express.Router();

// Public routes for practice arena AI
router.post("/ask", getAISuggestion);
router.post("/fix", fixCode);

export default router;
