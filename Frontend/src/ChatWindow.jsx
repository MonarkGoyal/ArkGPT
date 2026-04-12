import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState } from "react";
import { apiUrl } from "./config.js";
import getLocalAssistantReply from "./localAssistant.js";
import { appendLocalMessages } from "./localHistory.js";

function ChatWindow({ onToggleSidebar }) {
    const {prompt, setPrompt, setReply, currThreadId, setPrevChats, setNewChat, prevChats} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [feedbackName, setFeedbackName] = useState("");
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackStatus, setFeedbackStatus] = useState("");
    const [feedbackLoading, setFeedbackLoading] = useState(false);

    const getReply = async () => {
        if(loading) return;
        const userMessage = prompt.trim();
        if(!userMessage) return;

        setLoading(true);
        setNewChat(false);
        setPrompt("");
        setReply(null);
        const threadTitle = userMessage.slice(0, 48) || "New Chat";
        setPrevChats((prevChats) => [
            ...prevChats,
            { role: "user", content: userMessage }
        ]);
        appendLocalMessages(currThreadId, threadTitle, [{ role: "user", content: userMessage }]);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: userMessage,
                threadId: currThreadId,
                mode: "default"
            })
        };

        try {
            const response = await fetch(apiUrl("/api/chat"), options);
            if(!response.ok) {
                const errorPayload = await response.json().catch(() => ({}));
                const fallbackStatusError = response.status === 500
                    ? "Backend error. Please verify server configuration."
                    : `Request failed with status ${response.status}`;
                throw new Error(errorPayload.error || fallbackStatusError);
            }
            const res = await response.json();
            setPrevChats((prevChats) => [
                ...prevChats,
                { role: "assistant", content: res.reply }
            ]);
            setReply(res.reply);
            appendLocalMessages(currThreadId, threadTitle, [{ role: "assistant", content: res.reply }]);
        } catch(err) {
            console.log(err);
            const fallbackReply = await getLocalAssistantReply(userMessage, prevChats);
            setPrevChats((prevChats) => [
                ...prevChats,
                { role: "assistant", content: fallbackReply }
            ]);
            setReply(fallbackReply);
            appendLocalMessages(currThreadId, threadTitle, [{ role: "assistant", content: fallbackReply }]);
        }
        setLoading(false);
    }

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    const openFeedback = () => {
        setIsOpen(false);
        setFeedbackStatus("");
        setFeedbackOpen(true);
    }

    const closeFeedback = () => {
        setFeedbackOpen(false);
        setFeedbackStatus("");
    }

    const submitFeedback = async (e) => {
        e.preventDefault();

        const trimmedMessage = feedbackMessage.trim();
        if(!trimmedMessage || feedbackLoading) return;

        setFeedbackLoading(true);
        setFeedbackStatus("");

        try {
            const response = await fetch(apiUrl("/api/feedback"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: feedbackName.trim(),
                    message: trimmedMessage,
                    threadId: currThreadId,
                    pageUrl: `${window.location.origin}${window.location.pathname}`
                })
            });

            const payload = await response.json().catch(() => ({}));
            if(!response.ok) {
                throw new Error(payload.error || `Request failed with status ${response.status}`);
            }

            setFeedbackName("");
            setFeedbackMessage("");
            setFeedbackStatus("Thanks for your feedback.");
        } catch(err) {
            setFeedbackStatus(`Could not send feedback: ${err?.message || "Unknown error"}`);
        } finally {
            setFeedbackLoading(false);
        }
    }

    const handleSuggestion = (text) => {
        setPrompt(text);
    }

    return (
        <div className="chatWindow">
            <div className="navbar">
                <div className="navbarTitleGroup">
                    <button className="menuToggle" aria-label="Toggle menu" onClick={onToggleSidebar}>
                        <i className="fa-solid fa-bars"></i>
                    </button>
                    <span className="navTitle">ArkGPT</span>
                </div>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen && 
                <div className="dropDown">
                    <div className="dropDownItem" onClick={openFeedback}><i className="fa-regular fa-comment-dots"></i> Send feedback</div>
                    <div className="dropDownItem" onClick={() => window.open("https://github.com/MonarkGoyal/ArkGPT", "_blank")}><i className="fa-brands fa-github"></i> View on GitHub</div>
                </div>
            }
            <Chat onSuggestion={handleSuggestion} isLoading={loading}></Chat>
            
            <div className="chatInput">
                <div className="inputBox">
                    <textarea
                        className="chatPromptInput"
                        placeholder="Ask anything..."
                        rows={1}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if(e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                getReply();
                            }
                        }}
                    />
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-arrow-up"></i></div>
                </div>
                <p className="info">
                    ArkGPT can make mistakes. Check important info.
                </p>
                <div className="footer">
                    <a href="https://github.com/MonarkGoyal/ArkGPT/blob/main/Frontend/public/PRIVACY_POLICY.md" target="_blank" rel="noopener noreferrer">Privacy</a>
                    <span className="footer-separator">·</span>
                    <a href="https://github.com/MonarkGoyal/ArkGPT/blob/main/Frontend/public/TERMS_OF_SERVICE.md" target="_blank" rel="noopener noreferrer">Terms</a>
                    <span className="footer-separator">·</span>
                    <a href="https://github.com/MonarkGoyal/ArkGPT" target="_blank" rel="noopener noreferrer">GitHub</a>
                </div>
            </div>

            {feedbackOpen && (
                <div className="feedbackOverlay" onClick={closeFeedback}>
                    <form className="feedbackModal" onClick={(event) => event.stopPropagation()} onSubmit={submitFeedback}>
                        <div className="feedbackHeader">
                            <h3>Send feedback</h3>
                            <button type="button" className="feedbackClose" onClick={closeFeedback}>×</button>
                        </div>
                        <input
                            className="feedbackInput"
                            placeholder="Your name (optional)"
                            value={feedbackName}
                            onChange={(e) => setFeedbackName(e.target.value)}
                        />
                        <textarea
                            className="feedbackTextarea"
                            placeholder="Tell us what worked well or what should improve"
                            value={feedbackMessage}
                            onChange={(e) => setFeedbackMessage(e.target.value)}
                            rows={5}
                        />
                        <div className="feedbackActions">
                            <button type="button" className="feedbackSecondary" onClick={closeFeedback}>Cancel</button>
                            <button type="submit" className="feedbackPrimary" disabled={feedbackLoading}>
                                {feedbackLoading ? "Sending..." : "Submit"}
                            </button>
                        </div>
                        {feedbackStatus && <p className="feedbackStatus">{feedbackStatus}</p>}
                    </form>
                </div>
            )}
        </div>
    )
}

export default ChatWindow;