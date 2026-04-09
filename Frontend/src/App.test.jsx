import { render, screen } from "@testing-library/react";
import App from "./App.jsx";

describe("App", () => {
    it("renders chat shell", () => {
        render(<App />);

        expect(screen.getByText("Start a New Chat!")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Ask anything")).toBeInTheDocument();
    });
});
