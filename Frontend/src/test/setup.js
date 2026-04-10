import "@testing-library/jest-dom";
import { afterAll, beforeAll, vi } from "vitest";

beforeAll(() => {
	vi.stubGlobal("fetch", vi.fn(async () => ({
		ok: true,
		json: async () => ([]),
	})));
});

afterAll(() => {
	vi.unstubAllGlobals();
});
