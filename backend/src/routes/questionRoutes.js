import express from "express";
import { getQuestions, getQuestionById } from "../controllers/questionController.js";

const router = express.Router();

router.get("/", getQuestions);
router.get("/:id", getQuestionById);

export default router;
