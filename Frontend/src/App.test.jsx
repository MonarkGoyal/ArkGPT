import { render, screen } from "@testing-library/react";
import { act } from "react";
import App from "./App.jsx";

describe("App", () => {
    it("renders chat shell", async () => {
        await act(async () => {
            render(<App />);
        });

        expect(screen.getByText("Start a New Chat!")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Ask anything")).toBeInTheDocument();
    });
});
