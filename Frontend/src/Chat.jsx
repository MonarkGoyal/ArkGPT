import "./Chat.css";
import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const SUGGESTIONS = [
    "Explain quantum computing",
    "Write a Python sorting algorithm",
    "What is machine learning?",
    "Define recursion",
    "Tips to learn JavaScript",
];

function Chat({ onSuggestion, isLoading }) {
    const {newChat, prevChats, reply} = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    useEffect(() => {
        if(reply === null) {
            setLatestReply(null);
            return;
        }

        if(!prevChats?.length) return;

        const content = reply.split(" ");

        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx+1).join(" "));

            idx++;
            if(idx >= content.length) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);

    }, [prevChats, reply])

    return (
        <>
            {newChat && (
                <div className="welcomeContainer">
                    <div className="welcomeIcon">
                        <i className="fa-solid fa-bolt"></i>
                    </div>
                    <h1 className="welcomeTitle">What can I help you with?</h1>
                    <p className="welcomeSubtitle">
                        Ask me anything — code, math, definitions, general knowledge, and more.
                    </p>
                    <div className="welcomeSuggestions">
                        {SUGGESTIONS.map((text, i) => (
                            <button
                                key={i}
                                className="suggestionChip"
                                onClick={() => onSuggestion?.(text)}
                            >
                                {text}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            <div className="chats">
                {
                    prevChats?.map((chat, idx) => {
                        const isLast = idx === prevChats.length - 1;
                        
                        if (isLast && latestReply !== null && chat.role === "assistant") {
                            return (
                                <div className="gptDiv" key={"typing"}>
                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                                </div>
                            );
                        }

                        return (
                            <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={idx}>
                                {
                                    chat.role === "user" ? 
                                    <p className="userMessage">{chat.content}</p> : 
                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                                }
                            </div>
                        );
                    })
                }

                {isLoading && (
                    <div className="gptDiv thinking-container">
                        <div className="thinking-text">
                            <i className="fa-solid fa-bolt"></i> ArkGPT is thinking<span>.</span><span>.</span><span>.</span>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Chat;