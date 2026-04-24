
import Groq from "groq-sdk";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: "backend/.env" });

const testGroq = async () => {
    console.log("Checking GROQ_API_KEY:", process.env.GROQ_API_KEY ? "Present" : "Missing");

    if (!process.env.GROQ_API_KEY) {
        console.error("ERROR: No API Key found.");
        return;
    }

    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        console.log("Initialize Groq...");

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: "Say hello" }],
            model: "llama-3.1-8b-instant",
        });

        console.log("Success! Response:", completion.choices[0]?.message?.content);
    } catch (err) {
        console.error("Groq Connection Failed:", err);
    }
};

testGroq();
