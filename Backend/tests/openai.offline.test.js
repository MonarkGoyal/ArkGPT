import test from "node:test";
import assert from "node:assert/strict";
import getOpenAIAPIResponse from "../utils/openai.js";

test("returns offline answer without OPENAI_API_KEY", async () => {
    const originalApiKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const reply = await getOpenAIAPIResponse("explain classes in javascript");

    if(originalApiKey !== undefined) {
        process.env.OPENAI_API_KEY = originalApiKey;
    }

    assert.equal(typeof reply, "string");
    assert.ok(reply.length > 0);
    assert.match(reply.toLowerCase(), /class|javascript/);
});

test("returns direct merge sort java code", async () => {
    const originalApiKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const reply = await getOpenAIAPIResponse("write a code for merge sort in java");

    if(originalApiKey !== undefined) {
        process.env.OPENAI_API_KEY = originalApiKey;
    }

    assert.equal(typeof reply, "string");
    assert.match(reply.toLowerCase(), /merge sort/);
    assert.match(reply.toLowerCase(), /java/);
    assert.match(reply, /class MergeSort/);
});

test("returns natural small-talk reply", async () => {
    const originalApiKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const reply = await getOpenAIAPIResponse("how are you");

    if(originalApiKey !== undefined) {
        process.env.OPENAI_API_KEY = originalApiKey;
    }

    assert.equal(typeof reply, "string");
    assert.match(reply.toLowerCase(), /i am good|thanks for asking/);
});

test("returns closure explanation with example", async () => {
    const originalApiKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const reply = await getOpenAIAPIResponse("Explain closures in JavaScript with a simple example.");

    if(originalApiKey !== undefined) {
        process.env.OPENAI_API_KEY = originalApiKey;
    }

    assert.equal(typeof reply, "string");
    assert.match(reply.toLowerCase(), /closure/);
    assert.match(reply.toLowerCase(), /createcounter|counter/);
});

test("uses history for short coding follow-up", async () => {
    const originalApiKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const history = [{ role: "user", content: "write a code for merge sort" }];
    const reply = await getOpenAIAPIResponse("java", history);

    if(originalApiKey !== undefined) {
        process.env.OPENAI_API_KEY = originalApiKey;
    }

    assert.equal(typeof reply, "string");
    assert.match(reply, /class MergeSort/);
});
