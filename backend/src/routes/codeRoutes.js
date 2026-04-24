import express from "express";
import { executeCode } from "../controllers/codeController.js";
import { requireAuth } from "@clerk/express"; // Optional: protect this if needed

const router = express.Router();

// Public for now, or use requireAuth()
router.post("/execute", executeCode);

export default router;
