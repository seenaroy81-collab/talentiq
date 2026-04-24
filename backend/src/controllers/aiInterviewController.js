import Groq from "groq-sdk";
import { processInterviewAndSendReport } from "../services/interviewService.js";
import AIInterview from "../models/AIInterview.js";
import Session from "../models/Session.js";
import { ENV } from "../lib/env.js";
import { cacheGet, cacheSet, cacheDel } from "../lib/redis.js";
import { inngest } from "../lib/inngest.js";

// Lazy initialization function
const getGroqClient = () => {
    if (!ENV.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is missing in environment variables.");
    }
    return new Groq({ apiKey: ENV.GROQ_API_KEY });
};

export const createInterview = async (req, res) => {
    try {
        const { interviewerId, jobDescription, candidateName, questionCount, difficulty } = req.body;

        const interview = await AIInterview.create({
            interviewerId,
            jobDescription,
            candidateName,
            status: "pending",
            questionCount: questionCount || 5,
            difficulty: difficulty || "Medium",
            conversation: [
                {
                    role: "ai",
                    content: `Hello ${candidateName}, I am your AI interviewer today. I've reviewed the job description for ${jobDescription}. I will be asking you ${questionCount || 5} questions at a ${difficulty || "Medium"} difficulty level. Shall we begin?`,
                },
            ],
        });

        res.status(201).json(interview);
    } catch (error) {
        console.error("Error creating interview:", error);
        res.status(500).json({ error: "Failed to create interview" });
    }
};

export const getInterview = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Try Cache First
        const cachedInterview = await cacheGet(`interview:${id}`);
        if (cachedInterview) {
            console.log(`[CACHE HIT] Interview: ${id}`);
            return res.status(200).json(cachedInterview);
        }

        const interview = await AIInterview.findById(id);
        if (!interview) {
            return res.status(404).json({ error: "Interview not found" });
        }

        // Set Cache
        await cacheSet(`interview:${id}`, interview, 3600); // cache for 1 hour

        res.status(200).json(interview);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch interview" });
    }
};

export const chat = async (req, res) => {
    // ... existing chat logic ...
    // keeping it for text-fallback if needed, but primarily we use transcribeAndChat
    try {
        const { id } = req.params;
        const { message } = req.body;

        console.log(`[CHAT REQUEST] ID: ${id}, Message: "${message}"`);

        const interview = await AIInterview.findById(id);
        if (!interview) {
            console.error(`[CHAT ERROR] Interview not found: ${id}`);
            return res.status(404).json({ error: "Interview not found" });
        }

        // Add candidate message
        interview.conversation.push({ role: "candidate", content: message });

        // ... (reuse the logic below) -> Refactoring to a helper would be better but for speed I will duplicate or call a shared function
        return processAIResponse(interview, res);

    } catch (error) {
        console.error("Error in chat:", error);
        res.status(500).json({ error: "Failed to process chat" });
    }
};

export const transcribeAndChat = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ error: "No audio file uploaded" });
        }

        console.log(`[TRANSCRIBE] Received file: ${req.file.originalname} (${req.file.size} bytes)`);

        // 1. Transcribe with Groq (Whisper)
        const groq = getGroqClient();

        // Create a File object from the buffer (Groq SDK expects a file-like object)
        // We can pass a ReadStream or a Blob. Node Buffer might need conversion.
        // Actually Groq SDK `transcriptions.create` accepts `file: Uploadable`. 
        // We need to convert Buffer to a compatible format or write to temp.
        // Easiest is to write to temp file, but let's try passing a mock file object.

        // Strategy: Use a tiny helper to create a File-like object or write to temp.
        // Writing to temp is safer for SDK compatibility.
        // ...Skipping temp file for speed if possible, but let's use the 'file-type' approach.
        // Actually, simplest is to use `toFile` from `fs` but we have it in memory.

        // Let's create a temporary file
        const fs = await import("fs");
        const path = await import("path");
        const os = await import("os");

        const tempFilePath = path.join(os.tmpdir(), `upload_${Date.now()}.webm`);
        fs.writeFileSync(tempFilePath, req.file.buffer);

        let transcript = "";
        try {
            // Create a read stream
            const stream = fs.createReadStream(tempFilePath);

            const transcription = await groq.audio.transcriptions.create({
                file: stream,
                model: "whisper-large-v3",
                prompt: "Technical job interview. Indian English accent. Keywords: JavaScript, React, Node.js, CSS, HTML, Database, MongoDB, SQL, System Design, Scalability, API, Async, Promise, Component, Hook, State.",
                response_format: "json",
                language: "en",
                temperature: 0.0,
            });
            transcript = transcription.text;
            console.log(`[TRANSCRIBE] Result: "${transcript}"`);

        } finally {
            // Cleanup
            fs.unlinkSync(tempFilePath);
        }

        // Filter known Whisper hallucinations on silence
        const cleanTranscript = transcript.trim();
        const hallucinations = ["Thank you.", "Thank you", "Thanks.", "You", "you"];
        const validShortWords = ["yes", "no", "ok", "okay", "yep", "sure", "next", "start", "stop"];

        if (hallucinations.includes(cleanTranscript)) {
            console.warn(`[TRANSCRIBE REJECTED] Hallucination: "${cleanTranscript}"`);
            // Instead of error, we treat it as silence/empty
            transcript = "";
        }

        // Only reject if it's truly garbage AND not a valid short answer
        if ((!cleanTranscript || cleanTranscript.length < 2) && !validShortWords.includes(cleanTranscript.toLowerCase())) {
            console.warn(`[TRANSCRIBE WARN] Short transcript: "${cleanTranscript}"`);
            // We allow it to pass for now to avoid blocking accents
        }

        let userMessage = transcript;
        let aiPromptAddition = "";

        // If transcript is empty (silence or hallucination rejected), prompt AI to ask for repeat
        if (!userMessage || userMessage.trim().length === 0) {
            console.log("[TRANSCRIBE] Silence detected. Requesting repeat.");
            userMessage = "(User was silent or audio was unclear)";
            aiPromptAddition = " The user was silent or the audio was unreadable. Politely ask them to speak up or repeat themselves.";
        }

        // 2. Process as a Chat Message
        const interview = await AIInterview.findById(id);
        if (!interview) {
            return res.status(404).json({ error: "Interview not found" });
        }

        interview.conversation.push({ role: "candidate", content: userMessage });

        // 3. Get AI Response (Pass strict=true if silent to force specific behavior if needed, but the prompt addition handles it)
        return processAIResponse(interview, res, transcript, aiPromptAddition);



    } catch (error) {
        console.error("Error in transcribeAndChat:", error);
        res.status(500).json({ error: "Failed to process audio", details: error.message });
    }
}

// Helper to share logic
async function processAIResponse(interview, res, userTranscript = null, extraInstruction = "") {
    // Fetch custom questions from linked session if available
    let customQuestionsPrompt = "";
    let resumeContextPrompt = "";
    let activeCount = interview.questionCount || 5;
    let activeMode = "mixed";

    if (interview.sessionId) {
        try {
            const session = await Session.findById(interview.sessionId);
            if (session) {
                if (session.customQuestions && session.customQuestions.length > 0) {
                    customQuestionsPrompt = `\n\nCUSTOM QUESTIONS (ASK THESE FIRST before generating your own):\n${session.customQuestions.map((q, i) => `  Q${i + 1}: ${q.question} [${q.category}]`).join("\n")}`;
                }
                activeCount = session.questionCount || interview.questionCount || 5;
                activeMode = session.questionMode || "mixed";
            }
        } catch (err) {
            console.warn("Could not fetch session for custom questions:", err.message);
        }
    }

    if (interview.resumeText) {
        resumeContextPrompt = `\n\nCANDIDATE RESUME CONTEXT (use this to personalize follow-up questions):\n${interview.resumeText.slice(0, 3000)}`;
    }

    let modeInstruction = "";
    if (activeMode === "manual") {
        modeInstruction = `You are in MANUAL mode. ASK THESE QUESTIONS STRICTLY in order: ${customQuestionsPrompt}. Do NOT generate any of your own technical questions. Once all provided questions are asked and answered, end the interview.`;
    } else if (activeMode === "ai") {
        modeInstruction = `You are in AUTONOMOUS AI mode. Ignore any custom questions provided. Generate your own set of ${activeCount} questions based on the job description and candidate resume.`;
    } else {
        // Mixed mode
        modeInstruction = `You are in MIXED mode. Start by asking the CUSTOM QUESTIONS provided below in order. After all custom questions are asked, if you haven't reached the total of ${activeCount} questions yet, generate your own follow-up questions to fill the gap.`;
    }

    // Construct context for Groq
    const messages = [
        {
            role: "system",
            content: `You are an expert AI Technical Interviewer. You are interviewing a candidate for a role defined as: "${interview.jobDescription}". ${extraInstruction} 
        
        CONFIGURATION:
        - Total Questions to Ask: ${activeCount}
        - Difficulty Level: ${interview.difficulty || "Medium"}
        - Mode: ${activeMode}
        ${modeInstruction}
        ${customQuestionsPrompt}
        ${resumeContextPrompt}

        INSTRUCTIONS:
        1. FIRST MESSAGE: If the user says "start" or "begin", welcome them and ask Question #1 immediately according to the Mode.
        2. SUBSEQUENT MESSAGES:
           - Provide feedback on their last answer.
           - If the answer was weak or wrong, briefly correct them.
           - Then, ask Question #next (respecting the Mode).
        3. Match the difficulty level (${interview.difficulty}).
        4. Keep track of question count.
        5. COMPLETION: If you have asked ${activeCount} questions and received the final answer, provide a final short summary and say "Thank you, the interview is complete."
        
        OUTPUT FORMAT (MANDATORY JSON):
        Return ONLY a JSON object with these fields:
        {
          "response": "The text you want to speak/display to the user (concise, 4-5 sentences max)",
          "feedback": "Your private evaluation of their answer (concise)",
          "idealAnswer": "Key points that should have been in a perfect answer",
          "score": 0-10 rating of their last response
        }`,
        },
        ...interview.conversation.map((msg) => ({
            role: msg.role === "ai" ? "assistant" : "user",
            content: msg.content,
        })),
    ];

    try {
        const groq = getGroqClient();
        const completion = await groq.chat.completions.create({
            messages,
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
        });

        const rawContent = completion.choices[0]?.message?.content || "{}";
        let aiData;
        try {
            aiData = JSON.parse(rawContent);
        } catch (e) {
            console.error("Failed to parse AI JSON:", rawContent);
            aiData = { response: rawContent, feedback: "", idealAnswer: "", score: 5 };
        }

        const aiResponse = aiData.response || "I didn't quite catch that.";

        // Normalize score to always be a valid number (0-10)
        let normalizedScore = typeof aiData.score === 'number' 
            ? aiData.score 
            : parseFloat(aiData.score);
        if (isNaN(normalizedScore) || normalizedScore < 0) normalizedScore = 0;
        if (normalizedScore > 10) normalizedScore = 10;

        // Add AI response with feedback and metadata
        interview.conversation.push({
            role: "ai",
            content: aiResponse,
            feedback: aiData.feedback || "",
            idealAnswer: aiData.idealAnswer || "",
            score: normalizedScore
        });

        await interview.save();

        // Update Cache
        await cacheSet(`interview:${interview._id}`, interview, 3600);

        res.status(200).json({
            response: aiResponse,
            conversation: interview.conversation,
            transcript: userTranscript,
            feedback: aiData.feedback,
            score: aiData.score
        });
    } catch (groqError) {
        console.error("Groq API Error:", groqError.message);
        return res.status(500).json({
            error: "AI Service Unavailable",
            details: "Please ensure GROQ_API_KEY is allowed and valid."
        });
    }
}

export const endInterview = async (req, res) => {
    try {
        const { id } = req.params;
        const interview = await AIInterview.findById(id);

        if (!interview) {
            return res.status(404).json({ message: "Interview not found" });
        }

        interview.status = "completed";
        await interview.save();

        // Mark session as completed so it's not shown in active lists
        if (interview.sessionId) {
            await Session.findByIdAndUpdate(interview.sessionId, { status: "completed" });
        }

        // Update Cache
        await cacheSet(`interview:${id}`, interview, 3600);

        // Trigger async post-interview processing (email report, analysis)
        try {
            await inngest.send({
                name: "interview/completed",
                data: { interviewId: id },
            });
            console.log(`✅ Inngest event 'interview/completed' sent for ${id}`);

            // 🛠️ DEVELOPMENT FALLBACK: 
            // If we are in local development and likely don't have the Inngest CLI running,
            // we trigger the email processing synchronously so the user actually gets the email.
            if (process.env.NODE_ENV === "development") {
                console.log("🛠️ Dev Mode: Triggering synchronous report generation...");
                processInterviewAndSendReport(id).catch(err => 
                    console.error("❌ Sync fallback failed:", err.message)
                );
            }
        } catch (inngestErr) {
            console.error("⚠️ Inngest send failed, trying manual fallback:", inngestErr.message);
            // Manual fallback if Inngest itself fails to even send the event
            processInterviewAndSendReport(id).catch(err => 
                console.error("❌ Sync fallback failed:", err.message)
            );
        }

        res.status(200).json({ message: "Interview completed successfully", status: "completed" });
    } catch (error) {
        console.error("Error ending interview:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ═══════════════════════════════════════════════════
// CODING INTERVIEW ENDPOINTS
// ═══════════════════════════════════════════════════

/**
 * Generate a DSA coding question for the interview
 */
export const generateCodingQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const interview = await AIInterview.findById(id);

        if (!interview) {
            return res.status(404).json({ error: "Interview not found" });
        }

        // Get session for topics/languages config
        let topics = ["Arrays", "Strings", "Linked Lists", "Trees", "Dynamic Programming"];
        let difficulty = interview.difficulty || "Medium";

        if (interview.sessionId) {
            const session = await Session.findById(interview.sessionId);
            if (session?.codingTopics?.length > 0) {
                topics = session.codingTopics;
            }
        }

        const currentQuestionIndex = interview.codingQuestions.length;
        const totalQuestions = interview.questionCount || 5;

        if (currentQuestionIndex >= totalQuestions) {
            return res.status(200).json({ 
                done: true, 
                message: "All questions have been asked",
                totalQuestions 
            });
        }

        let questionData = null;
        let useAI = true;

        if (interview.sessionId) {
            const session = await Session.findById(interview.sessionId);
            if (session) {
                if (session.codingTopics?.length > 0) {
                    topics = session.codingTopics;
                }
                
                const mode = session.questionMode || "mixed";
                const customQuestions = session.customQuestions || [];
                
                if (mode === "manual") {
                    if (currentQuestionIndex < customQuestions.length) {
                        const cq = customQuestions[currentQuestionIndex];
                        // If it's a library question, it might have a ": " separator for title
                        const titleParts = cq.question.split(": ");
                        const title = titleParts.length > 1 ? titleParts[0] : (cq.title || `Question ${currentQuestionIndex + 1}`);
                        const description = titleParts.length > 1 ? titleParts.slice(1).join(": ") : cq.question;

                        questionData = {
                            title: title.substring(0, 100),
                            description: description,
                            examples: cq.examples || [],
                            constraints: cq.constraints || [],
                            hints: cq.hints || [],
                            topic: cq.category || "General"
                        };
                        useAI = false;
                    } else {
                        return res.status(200).json({ 
                            done: true, 
                            message: "All manual questions have been asked",
                            totalQuestions: customQuestions.length
                        });
                    }
                } else if (mode === "mixed") {
                    if (currentQuestionIndex < customQuestions.length) {
                        const cq = customQuestions[currentQuestionIndex];
                        const titleParts = cq.question.split(": ");
                        const title = titleParts.length > 1 ? titleParts[0] : (cq.title || `Question ${currentQuestionIndex + 1}`);
                        const description = titleParts.length > 1 ? titleParts.slice(1).join(": ") : cq.question;

                        questionData = {
                            title: title.substring(0, 100),
                            description: description,
                            examples: cq.examples || [],
                            constraints: cq.constraints || [],
                            hints: cq.hints || [],
                            topic: cq.category || "General",
                            difficulty: cq.difficulty || "Easy"
                        };
                        useAI = false; // CRITICAL FIX: Don't overwrite with AI if we found a custom question
                    }
                }
            }
        }

        if (useAI) {
            // Pick a topic for this question (cycle through topics)
            const topicForQuestion = topics[currentQuestionIndex % topics.length];

            const groq = getGroqClient();
            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are an expert DSA interview question generator. Generate a coding interview question.
    
    REQUIREMENTS:
    - Topic: ${topicForQuestion}
    - Difficulty: ${difficulty}
    - Question #${currentQuestionIndex + 1} of ${totalQuestions}
    - Make it a classic DSA/algorithmic problem suitable for a coding interview
    - Include 2-3 examples with input/output
    - Include constraints
    - Include 1-2 hints
    
    OUTPUT FORMAT (MANDATORY JSON):
    {
      "title": "Problem Title (e.g. Two Sum)",
      "description": "Full problem description explaining what to solve",
      "examples": [
        { "input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "Because nums[0] + nums[1] == 9" }
      ],
      "constraints": ["1 <= nums.length <= 10^4", "..."],
      "hints": ["Think about using a hash map", "..."],
      "topic": "${topicForQuestion}"
    }`
                    }
                ],
                model: "llama-3.3-70b-versatile",
                response_format: { type: "json_object" },
            });

            const rawContent = completion.choices[0]?.message?.content || "{}";
            try {
                questionData = JSON.parse(rawContent);
            } catch (e) {
                console.error("Failed to parse coding question JSON:", rawContent);
                questionData = {
                    title: `${topicForQuestion} Problem`,
                    description: "Solve the given problem efficiently.",
                    examples: [{ input: "example input", output: "example output", explanation: "Example" }],
                    constraints: ["Standard constraints apply"],
                    hints: ["Think about optimal time complexity"],
                    topic: topicForQuestion,
                };
            }
        }

        // Add to interview
        const newQuestion = {
            title: questionData.title,
            description: questionData.description,
            examples: questionData.examples || [],
            constraints: questionData.constraints || [],
            difficulty,
            topic: questionData.topic || topicForQuestion,
            hints: questionData.hints || [],
        };

        interview.codingQuestions.push(newQuestion);

        // Add to conversation for tracking
        interview.conversation.push({
            role: "ai",
            content: `📝 Question ${currentQuestionIndex + 1}/${totalQuestions}: **${newQuestion.title}**\n\n${newQuestion.description}`,
        });

        await interview.save();
        await cacheSet(`interview:${id}`, interview, 3600);

        res.status(200).json({
            question: newQuestion,
            questionIndex: currentQuestionIndex,
            totalQuestions,
            done: false,
        });
    } catch (error) {
        console.error("Error generating coding question:", error);
        res.status(500).json({ error: "Failed to generate coding question" });
    }
};

/**
 * Submit code for a coding question — AI evaluates it
 */
export const submitCode = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, language, questionIndex } = req.body;

        if (!code || code.trim().length === 0) {
            return res.status(400).json({ error: "Code cannot be empty" });
        }

        const interview = await AIInterview.findById(id);
        if (!interview) {
            return res.status(404).json({ error: "Interview not found" });
        }

        const question = interview.codingQuestions[questionIndex];
        if (!question) {
            return res.status(400).json({ error: "Invalid question index" });
        }

        console.log(`[CODE SUBMIT] Interview: ${id}, Q${questionIndex + 1}, Language: ${language}, Code length: ${code.length}`);

        // AI Code Review
        const groq = getGroqClient();
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a senior software engineer and coding interview evaluator. A candidate has submitted code for a DSA problem. Evaluate their solution thoroughly.

PROBLEM:
Title: ${question.title}
Description: ${question.description}
Examples: ${JSON.stringify(question.examples)}
Constraints: ${JSON.stringify(question.constraints)}
Difficulty: ${question.difficulty}

CANDIDATE'S CODE (${language}):
\`\`\`${language}
${code}
\`\`\`

Evaluate and provide your response as JSON:
{
  "correctness": "Is the code correct? Does it handle all edge cases? (2-3 sentences)",
  "timeComplexity": "What is the time complexity? Is it optimal? (e.g. O(n log n) - optimal for this problem)",
  "spaceComplexity": "What is the space complexity? (e.g. O(n) due to hash map)",
  "codeQuality": "Code style, readability, naming conventions (2-3 sentences)",
  "suggestions": "What could be improved? Any bugs? (2-3 sentences)",
  "score": 0-10,
  "response": "Brief feedback to tell the candidate (4-5 sentences max, encouraging but honest)"
}`
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
        });

        const rawContent = completion.choices[0]?.message?.content || "{}";
        let reviewData;
        try {
            reviewData = JSON.parse(rawContent);
        } catch (e) {
            console.error("Failed to parse code review JSON:", rawContent);
            reviewData = {
                correctness: "Could not properly evaluate",
                timeComplexity: "Unknown",
                spaceComplexity: "Unknown",
                codeQuality: "Submitted code received",
                suggestions: "No suggestions",
                score: 5,
                response: "I received your code. Let's move to the next question.",
            };
        }

        // Normalize score
        let normalizedScore = typeof reviewData.score === 'number' 
            ? reviewData.score 
            : parseFloat(reviewData.score);
        if (isNaN(normalizedScore) || normalizedScore < 0) normalizedScore = 0;
        if (normalizedScore > 10) normalizedScore = 10;

        // Save code submission
        interview.codeSubmissions.push({
            questionIndex,
            language,
            code,
            aiReview: {
                correctness: reviewData.correctness || "",
                timeComplexity: reviewData.timeComplexity || "",
                spaceComplexity: reviewData.spaceComplexity || "",
                codeQuality: reviewData.codeQuality || "",
                suggestions: reviewData.suggestions || "",
                score: normalizedScore,
            },
        });

        // Add to conversation
        interview.conversation.push({
            role: "candidate",
            content: `[CODE SUBMISSION for Q${questionIndex + 1}]\n\`\`\`${language}\n${code}\n\`\`\``,
        });

        interview.conversation.push({
            role: "ai",
            content: reviewData.response || "Code received and evaluated.",
            feedback: reviewData.suggestions || "",
            idealAnswer: `Correctness: ${reviewData.correctness}\nTime: ${reviewData.timeComplexity}\nSpace: ${reviewData.spaceComplexity}`,
            score: normalizedScore,
        });

        await interview.save();
        await cacheSet(`interview:${id}`, interview, 3600);

        res.status(200).json({
            review: {
                correctness: reviewData.correctness,
                timeComplexity: reviewData.timeComplexity,
                spaceComplexity: reviewData.spaceComplexity,
                codeQuality: reviewData.codeQuality,
                suggestions: reviewData.suggestions,
                score: normalizedScore,
            },
            response: reviewData.response,
            questionIndex,
        });
    } catch (error) {
        console.error("Error submitting code:", error);
        res.status(500).json({ error: "Failed to evaluate code" });
    }
};


/**
 * Provide a dynamic hint/suggestion for a coding question based on the candidate's code
 */
export const getCodingSuggestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, language, questionIndex } = req.body;

        const interview = await AIInterview.findById(id);
        if (!interview) {
            return res.status(404).json({ error: "Interview not found" });
        }

        // Check if session allows suggestions
        if (interview.sessionId) {
            const session = await Session.findById(interview.sessionId);
            if (session && session.enableAIHelp === false) {
                return res.status(403).json({ error: "AI Suggestions are disabled for this session" });
            }
        }

        const question = interview.codingQuestions[questionIndex];
        if (!question) {
            return res.status(400).json({ error: "Invalid question index" });
        }

        const groq = getGroqClient();
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a helpful AI coding mentor. A candidate is struggling with a DSA problem and has asked for a hint.
                    
PROBLEM:
${question.title}
${question.description}

CANDIDATE'S CURRENT CODE (${language}):
\`\`\`${language}
${code}
\`\`\`

INSTRUCTIONS:
1. Provide a helpful, constructive hint without giving away the full solution or code.
2. If the user's current logic is on the right track, encourage them.
3. If they have a bug, point them towards the area without fixing it for them.
4. Keep it concise (2-3 sentences).
5. Output format (JSON):
{
  "suggestion": "Your hint for the candidate."
}`
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
        });

        const rawContent = completion.choices[0]?.message?.content || "{}";
        let suggestionData;
        try {
            suggestionData = JSON.parse(rawContent);
        } catch (e) {
            suggestionData = { suggestion: "Try to break down the problem into smaller steps." };
        }

        // Add to conversation so the history shows they asked for help
        interview.conversation.push({
            role: "candidate",
            content: "[Requested AI Suggestion]",
        });
        
        interview.conversation.push({
            role: "ai",
            content: `💡 **Suggestion:** ${suggestionData.suggestion}`,
        });

        await interview.save();
        await cacheSet(`interview:${id}`, interview, 3600);

        res.status(200).json({ 
            suggestion: suggestionData.suggestion,
            conversation: interview.conversation
        });
    } catch (error) {
        console.error("Error getting coding suggestion:", error);
        res.status(500).json({ error: "Failed to get AI suggestion" });
    }
};

