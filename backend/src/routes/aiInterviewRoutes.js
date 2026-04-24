import express from "express";
import { createInterview, getInterview, chat, transcribeAndChat, endInterview, generateCodingQuestion, submitCode, getCodingSuggestion } from "../controllers/aiInterviewController.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/", protectRoute, createInterview);
router.get("/:id", getInterview);
router.post("/:id/chat", chat);
router.post("/:id/end", endInterview);

// New Route for Audio Blob
router.post("/:id/transcribe", upload.single("audio"), transcribeAndChat);

// Coding Interview Routes
router.post("/:id/next-coding-question", generateCodingQuestion);
router.post("/:id/submit-code", submitCode);
router.post("/:id/suggestion", getCodingSuggestion);

export default router;

