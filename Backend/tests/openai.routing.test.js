import test from "node:test";
import assert from "node:assert/strict";
import getOpenAIAPIResponse, { __testUtils } from "../utils/openai.js";

test("selectModelForRequest chooses complex model for deep mode", () => {
    const selected = __testUtils.selectModelForRequest("brief prompt", [], "deep");
    assert.equal(typeof selected, "string");
    assert.ok(selected.length > 0);
});

test("normalizeHistory keeps only user and assistant roles", () => {
    const normalized = __testUtils.normalizeHistory([
        { role: "system", content: "ignore" },
        { role: "user", content: "hello" },
        { role: "assistant", content: "hi" },
        { role: "tool", content: "ignore2" },
    ]);

    assert.equal(normalized.length, 2);
    assert.equal(normalized[0].role, "user");
    assert.equal(normalized[1].role, "assistant");
});

test("falls back to offline assistant when retries fail", async () => {
    const originalApiKey = process.env.OPENAI_API_KEY;
    const originalFetch = global.fetch;
    const originalConsoleLog = console.log;

    process.env.OPENAI_API_KEY = "test-key";
    console.log = () => {};
    global.fetch = async () => ({
        ok: false,
        status: 503,
        text: async () => "temporary outage",
    });

    const reply = await getOpenAIAPIResponse("explain closures in javascript", [], "default");

    if(originalApiKey === undefined) {
        delete process.env.OPENAI_API_KEY;
    } else {
        process.env.OPENAI_API_KEY = originalApiKey;
    }
    global.fetch = originalFetch;
    console.log = originalConsoleLog;

    assert.equal(typeof reply, "string");
    assert.ok(reply.length > 0);
    assert.match(reply.toLowerCase(), /closure|javascript/);
});

test("returns OpenAI response when fetch succeeds", async () => {
    const originalApiKey = process.env.OPENAI_API_KEY;
    const originalFetch = global.fetch;

    process.env.OPENAI_API_KEY = "test-key";
    global.fetch = async () => ({
        ok: true,
        json: async () => ({
            choices: [{ message: { content: "Mocked live answer" } }],
        }),
    });

    const reply = await getOpenAIAPIResponse("hello", [], "concise");

    if(originalApiKey === undefined) {
        delete process.env.OPENAI_API_KEY;
    } else {
        process.env.OPENAI_API_KEY = originalApiKey;
    }
    global.fetch = originalFetch;

    assert.equal(reply, "Mocked live answer");
});
