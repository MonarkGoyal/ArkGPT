import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import request from "supertest";
import chatRoutes from "../routes/chat.js";
import app from "../server.js";

const buildApp = () => {
    const app = express();
    app.use(express.json());
    app.use("/api", chatRoutes);
    return app;
};

test("GET /api/thread returns empty list without database", async () => {
    const app = buildApp();

    const response = await request(app).get("/api/thread");

    assert.equal(response.status, 200);
    assert.equal(Array.isArray(response.body), true);
});

test("GET /api/thread/:id returns 404 without database", async () => {
    const app = buildApp();

    const response = await request(app).get("/api/thread/demo-thread");

    assert.equal(response.status, 404);
    assert.equal(response.body.error, "Thread not found");
});

test("POST /api/chat returns a reply for general queries", async () => {
    const app = buildApp();
    const originalApiKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const response = await request(app)
        .post("/api/chat")
        .send({ threadId: "demo-thread", message: "give me 3 tips to learn javascript fast" });

    if(originalApiKey !== undefined) {
        process.env.OPENAI_API_KEY = originalApiKey;
    }

    assert.equal(response.status, 200);
    assert.equal(typeof response.body.reply, "string");
    assert.match(response.body.reply.toLowerCase(), /javascript|tips|learn/);
});

test("POST /api/chat returns merge sort Java code", async () => {
    const app = buildApp();
    const originalApiKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const response = await request(app)
        .post("/api/chat")
        .send({ threadId: "demo-thread", message: "write a code for merge sort in java" });

    if(originalApiKey !== undefined) {
        process.env.OPENAI_API_KEY = originalApiKey;
    }

    assert.equal(response.status, 200);
    assert.equal(typeof response.body.reply, "string");
    assert.match(response.body.reply, /class MergeSort/);
});

test("POST /api/chat uses thread context for short follow-up", async () => {
    const app = buildApp();
    const originalApiKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    const threadId = `followup-${Date.now()}`;

    await request(app)
        .post("/api/chat")
        .send({ threadId, message: "write a code for merge sort" });

    const response = await request(app)
        .post("/api/chat")
        .send({ threadId, message: "in java" });

    if(originalApiKey !== undefined) {
        process.env.OPENAI_API_KEY = originalApiKey;
    }

    assert.equal(response.status, 200);
    assert.equal(typeof response.body.reply, "string");
    assert.match(response.body.reply, /class MergeSort/);
});

test("POST /api/chat rejects missing fields", async () => {
    const app = buildApp();

    const response = await request(app).post("/api/chat").send({ message: "hello" });

    assert.equal(response.status, 400);
    assert.equal(response.body.error, "missing required fields");
});

test("POST /api/feedback saves anonymous feedback without database", async () => {
    const app = buildApp();

    const response = await request(app)
        .post("/api/feedback")
        .send({ message: "Great app", pageUrl: "https://example.com" });

    assert.equal(response.status, 201);
    assert.equal(response.body.success, "Feedback saved");
    assert.equal(response.body.feedback.message, "Great app");
    assert.equal(response.body.feedback.name, "Anonymous");
});

test("GET /api/feedback returns saved feedback entries without database", async () => {
    const app = buildApp();

    await request(app)
        .post("/api/feedback")
        .send({ name: "Tester", message: "Nice work" });

    const response = await request(app).get("/api/feedback");

    assert.equal(response.status, 200);
    assert.equal(Array.isArray(response.body), true);
    assert.ok(response.body.length >= 1);
});

test("GET /health returns ok status", async () => {
    const response = await request(app).get("/health");

    assert.equal(response.status, 200);
    assert.equal(response.body.status, "ok");
});

test("GET /api/ai/capabilities returns modes and ai state", async () => {
    const app = buildApp();

    const response = await request(app).get("/api/ai/capabilities");

    assert.equal(response.status, 200);
    assert.equal(Array.isArray(response.body.supportedModes), true);
    assert.equal(response.body.supportedModes.includes("deep"), true);
    assert.equal(typeof response.body.aiEnabled, "boolean");
});