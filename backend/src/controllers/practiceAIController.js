import Groq from "groq-sdk";
import { ENV } from "../lib/env.js";
import { PROBLEMS } from "../data/problems.js";

const getGroqClient = () => {
    if (!ENV.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is missing in environment variables.");
    }
    return new Groq({ apiKey: ENV.GROQ_API_KEY });
};

export const getAISuggestion = async (req, res) => {
    try {
        const { problemId, message, conversation = [] } = req.body;
        const problem = PROBLEMS[problemId];

        if (!problem) {
            return res.status(404).json({ error: "Problem not found" });
        }

        const groq = getGroqClient();
        const systemPrompt = `You are a helpful AI Coding Assistant. You are helping a user with the coding problem: "${problem.title}".
    
    PROBLEM CONTEXT:
    Category: ${problem.category}
    Difficulty: ${problem.difficulty}
    Description: ${problem.description.text}
    
    INSTRUCTIONS:
    1. Be concise and technical.
    2. Do NOT give away the full solution immediately unless explicitly asked for a hint that leads there.
    3. Use code snippets only where necessary to explain concepts.
    4. Focus on helping the user understand the algorithmic patterns involved.`;

        const messages = [
            { role: "system", content: systemPrompt },
            ...conversation.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: message }
        ];

        const completion = await groq.chat.completions.create({
            messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1000,
        });

        res.status(200).json({
            response: completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that request."
        });
    } catch (error) {
        console.error("AI Suggestion Error:", error);
        res.status(500).json({ error: "Failed to get AI suggestion" });
    }
};

export const fixCode = async (req, res) => {
    try {
        const { problemId, code, language, error } = req.body;
        const problem = PROBLEMS[problemId];

        if (!problem) {
            return res.status(404).json({ error: "Problem not found" });
        }

        const groq = getGroqClient();
        const systemPrompt = `You are an expert Code Debugger. Analyze the user's code for the problem "${problem.title}" and provide a concise fix.
    
    PROBLEM: ${problem.description.text}
    LANGUAGE: ${language}
    USER CODE:
    ${code}
    
    RUNTIME ERROR (if any):
    ${error || "None reported, but logic might be wrong."}
    
    INSTRUCTIONS:
    1. Identify the bug precisely.
    2. Provide a short explanation of the fix.
    3. Provide the corrected code block.
    4. Be discouraging of bad practices and encourage efficient algorithmic thinking.`;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: systemPrompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
        });

        res.status(200).json({
            fix: completion.choices[0]?.message?.content || "I couldn't find a fix for this code."
        });
    } catch (error) {
        console.error("Fix Code Error:", error);
        res.status(500).json({ error: "Failed to analyze code" });
    }
};
