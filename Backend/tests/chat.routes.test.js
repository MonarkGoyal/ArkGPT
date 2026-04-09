import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import request from "supertest";
import chatRoutes from "../routes/chat.js";

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