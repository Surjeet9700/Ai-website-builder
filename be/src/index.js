import dotenv from "dotenv";
dotenv.config();
import Groq from "groq-sdk";
import express from "express";
import { BASE_PROMPT, getSystemPrompt } from "./prompts.js";
import { basePrompt as nodeBasePrompt } from "./defaults/node.js";
import { basePrompt as reactBasePrompt } from "./defaults/reactfile.js";
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors());
app.use(express.json());
app.options('/template', cors());

app.post('/template', async (req, res) => {
    const prompt = req.body.prompt;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra"
                },
                {
                    role: 'user',
                    content: prompt
                },
            ],
            max_tokens: 200,
            model: "llama3-8b-8192",
        });

        const answer = response.choices[0].message.content.trim().toLowerCase();
        console.log(answer);
        if (answer === "react") {
            res.json({
                prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [reactBasePrompt]
            });
            return;
        }
        if (answer === "node") {
            res.json({
                prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [nodeBasePrompt]
            });
            return;
        }

        res.status(404).json({
            message: "you can't access this route",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/chat', async (req, res) => {
    const messages = req.body.messages;

    // Validate incoming messages
    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages are required and should be an array" });
    }

    // Validate the structure of each message
    for (const message of messages) {
        if (!message.role || typeof message.role !== 'string' || 
            !message.content || typeof message.content !== 'string') {
            return res.status(400).json({ error: "Each message must have 'role' (string) and 'content' (string)" });
        }
    }

    // Add the system prompt and send to Groq API
    try {
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: getSystemPrompt(), // Custom system prompt
                },
                ...messages // Spread the validated messages
            ],
            max_tokens: 8000,
            model: "llama-3.1-8b-instant",
        });

        console.log("Groq API response:", JSON.stringify(response, null, 2));

        res.json({
            response: response.choices[0].message.content,
        });
    } catch (error) {
        console.error("Error in /chat endpoint:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});