import express from "express";
import mongoose from "mongoose";
import Thread from "../models/Thread.js";
import Feedback from "../models/Feedback.js";
import getOpenAIAPIResponse from "../utils/openai.js";
import { isWeatherQuery, getWeatherResponse, isCalculatorQuery, getCalculatorResponse } from "../utils/services.js";

const router = express.Router();
const hasDbConnection = () => mongoose.connection.readyState === 1;
const inMemoryThreads = new Map();
const inMemoryFeedback = [];
const MAX_THREAD_MESSAGES = 100;
const MODEL_CONTEXT_WINDOW = 12;
const SUPPORTED_MODES = ["default", "tutor", "concise", "deep"];

const createInMemoryThread = (threadId, title) => ({
    threadId,
    title,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
});

const getModelContext = (messages) => {
    return messages
        .slice(-MODEL_CONTEXT_WINDOW)
        .map(({ role, content }) => ({ role, content }));
};

const buildFeedbackItem = ({ name, message, threadId, pageUrl }) => ({
    name: name?.trim() || "Anonymous",
    message: message.trim(),
    threadId: threadId?.trim() || null,
    pageUrl: pageUrl?.trim() || null,
    createdAt: new Date(),
});

//test
router.post("/test", async(req, res) => {
    try {
        const thread = new Thread({
            threadId: "abc",
            title: "Testing New Thread2"
        });

        const response = await thread.save();
        res.send(response);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to save in DB"});
    }
});

router.get("/ai/capabilities", (req, res) => {
    return res.json({
        aiEnabled: Boolean(process.env.OPENAI_API_KEY),
        supportedModes: SUPPORTED_MODES,
        contextWindow: MODEL_CONTEXT_WINDOW,
    });
});

//Get all threads
router.get("/thread", async(req, res) => {
    if(!hasDbConnection()) {
        const threads = Array.from(inMemoryThreads.values())
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        return res.json(threads);
    }

    try {
        const threads = await Thread.find({}).sort({updatedAt: -1});
        //descending order of updatedAt...most recent data on top
        res.json(threads);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

router.get("/thread/:threadId", async(req, res) => {
    const {threadId} = req.params;
    if(!hasDbConnection()) {
        const thread = inMemoryThreads.get(threadId);
        if(!thread) {
            return res.status(404).json({error: "Thread not found"});
        }
        return res.json(thread.messages);
    }

    try {
        const thread = await Thread.findOne({threadId});

        if(!thread) {
            return res.status(404).json({error: "Thread not found"});
        }

        return res.json(thread.messages);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch chat"});
    }
});

router.delete("/thread/:threadId", async (req, res) => {
    const {threadId} = req.params;
    if(!hasDbConnection()) {
        const exists = inMemoryThreads.has(threadId);
        if(!exists) {
            return res.status(404).json({error: "Thread not found"});
        }

        inMemoryThreads.delete(threadId);
        return res.status(200).json({success : "Thread deleted successfully"});
    }

    try {
        const deletedThread = await Thread.findOneAndDelete({threadId});

        if(!deletedThread) {
            return res.status(404).json({error: "Thread not found"});
        }

        return res.status(200).json({success : "Thread deleted successfully"});

    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to delete thread"});
    }
});

router.post("/chat", async(req, res) => {
    const {threadId, message, mode} = req.body;
    const trimmedMessage = message?.trim();
    const resolvedMode = SUPPORTED_MODES.includes(mode) ? mode : "default";

    if(!threadId || !trimmedMessage) {
        return res.status(400).json({error: "missing required fields"});
    }

    try {
        const usingDb = hasDbConnection();
        let thread = null;
        if(usingDb) {
            thread = await Thread.findOne({threadId});
        } else {
            thread = inMemoryThreads.get(threadId) || null;
        }

        if(!thread) {
            if(usingDb) {
                thread = new Thread({
                    threadId,
                    title: trimmedMessage,
                    messages: []
                });
            } else {
                thread = createInMemoryThread(threadId, trimmedMessage);
                inMemoryThreads.set(threadId, thread);
            }
        }

        thread.messages.push({role: "user", content: trimmedMessage});
        if(!thread.title) {
            thread.title = trimmedMessage;
        }

        // Check for special queries (weather, math) and handle immediately
        let assistantReply = null;
        if(isWeatherQuery(trimmedMessage)) {
            assistantReply = await getWeatherResponse(trimmedMessage);
        } else if(isCalculatorQuery(trimmedMessage)) {
            assistantReply = getCalculatorResponse(trimmedMessage);
        } else {
            // Use OpenAI API for general queries
            assistantReply = await getOpenAIAPIResponse(trimmedMessage, getModelContext(thread.messages), resolvedMode);
        }

        if(!assistantReply) {
            return res.status(502).json({error: "Assistant did not return a valid response"});
        }

        thread.messages.push({role: "assistant", content: assistantReply});
        thread.updatedAt = new Date();

        if(thread.messages.length > MAX_THREAD_MESSAGES) {
            thread.messages = thread.messages.slice(-MAX_THREAD_MESSAGES);
        }

        if(usingDb) {
            await thread.save();
        }

        return res.json({reply: assistantReply});
    } catch(err) {
        console.log(err);
        const message = err?.message || "Unknown backend error";
        return res.status(500).json({error: `Backend chat failure: ${message}`});
    }
});

router.post("/feedback", async(req, res) => {
    const { name, message, threadId, pageUrl } = req.body;
    const trimmedMessage = message?.trim();

    if(!trimmedMessage) {
        return res.status(400).json({error: "message is required"});
    }

    try {
        const usingDb = hasDbConnection();
        const feedbackItem = buildFeedbackItem({ name, message: trimmedMessage, threadId, pageUrl });

        if(usingDb) {
            const savedFeedback = await Feedback.create(feedbackItem);
            return res.status(201).json({ success: "Feedback saved", feedback: savedFeedback });
        }

        inMemoryFeedback.unshift(feedbackItem);
        return res.status(201).json({ success: "Feedback saved", feedback: feedbackItem });
    } catch(err) {
        console.log(err);
        const message = err?.message || "Unknown backend error";
        return res.status(500).json({error: `Feedback failure: ${message}`});
    }
});

router.get("/feedback", async(req, res) => {
    if(!hasDbConnection()) {
        return res.json(inMemoryFeedback);
    }

    try {
        const feedback = await Feedback.find({}).sort({createdAt: -1}).limit(100);
        return res.json(feedback);
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: "Failed to fetch feedback"});
    }
});




export default router;