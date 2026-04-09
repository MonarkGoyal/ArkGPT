import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState } from "react";
import {ScaleLoader} from "react-spinners";
import { apiUrl } from "./config.js";
import getLocalAssistantReply from "./localAssistant.js";

function ChatWindow() {
    const {prompt, setPrompt, setReply, currThreadId, setPrevChats, setNewChat, prevChats} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const getReply = async () => {
        if(loading) return;
        const userMessage = prompt.trim();
        if(!userMessage) return;

        setLoading(true);
        setNewChat(false);
        setPrompt("");
        setPrevChats((prevChats) => [
            ...prevChats,
            { role: "user", content: userMessage }
        ]);

        console.log("message ", userMessage, " threadId ", currThreadId);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: userMessage,
                threadId: currThreadId
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
            console.log(res);
            setPrevChats((prevChats) => [
                ...prevChats,
                { role: "assistant", content: res.reply }
            ]);
            setReply(res.reply);
        } catch(err) {
            console.log(err);
            const fallbackReply = getLocalAssistantReply(userMessage, prevChats);
            setPrevChats((prevChats) => [
                ...prevChats,
                { role: "assistant", content: fallbackReply }
            ]);
            setReply(fallbackReply);
        }
        setLoading(false);
    }


    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>ArkGPT <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen && 
                <div className="dropDown">
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem"><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            }
            <Chat></Chat>

            <ScaleLoader color="#fff" loading={loading}>
            </ScaleLoader>
            
            <div className="chatInput">
                <div className="inputBox">
                    <textarea
                        className="chatPromptInput"
                        placeholder="Ask anything"
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
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">
                    ArkGPT can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;