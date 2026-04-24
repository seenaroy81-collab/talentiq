import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load questions from JSON file once on startup
const QUESTIONS_PATH = path.join(__dirname, "../data/questions.json");
let allQuestions = [];

try {
  const fileData = fs.readFileSync(QUESTIONS_PATH, "utf-8");
  allQuestions = JSON.parse(fileData);
  console.log(`[QuestionController] Loaded ${allQuestions.length} questions from JSON.`);
} catch (error) {
  console.error("[QuestionController] Error loading questions from JSON:", error);
}

export const getQuestions = async (req, res) => {
  try {
    const { search, category, difficulty, limit = 100, skip = 0 } = req.query;

    let filtered = [...allQuestions];

    // Search filter
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(term) || 
        q.question.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (category) {
      filtered = filtered.filter(q => q.category === category);
    }

    // Difficulty filter
    if (difficulty) {
      filtered = filtered.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    const total = filtered.length;
    const questions = filtered.slice(parseInt(skip), parseInt(skip) + parseInt(limit));

    res.status(200).json({ questions, total });
  } catch (error) {
    console.error("Error fetching questions from JSON:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const question = allQuestions.find(q => q._id === req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });
    res.status(200).json(question);
  } catch (error) {
    console.error("Error fetching question by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
