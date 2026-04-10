import "./Sidebar.css";
import { useContext, useEffect, useCallback } from "react";
import { MyContext } from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";
import { apiUrl } from "./config.js";
import { deleteLocalThread, getLocalThreadMessages, getLocalThreadsSummary } from "./localHistory.js";

function Sidebar({ isSidebarOpen, onCloseSidebar }) {
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);

    const getAllThreads = useCallback(async () => {
        try {
            const response = await fetch(apiUrl("/api/thread"));
            if(!response.ok) throw new Error(`Request failed with status ${response.status}`);
            const res = await response.json();
            const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            //console.log(filteredData);
            setAllThreads(filteredData);
        } catch(err) {
            console.log(err);
            setAllThreads(getLocalThreadsSummary());
        }
    }, [setAllThreads]);

    useEffect(() => {
        getAllThreads();
    }, [currThreadId, getAllThreads])


    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
        if(window.innerWidth <= 720) onCloseSidebar();
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(apiUrl(`/api/thread/${newThreadId}`));
            if(!response.ok) throw new Error(`Request failed with status ${response.status}`);
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
            if(window.innerWidth <= 720) onCloseSidebar();
        } catch(err) {
            console.log(err);
            const localMessages = getLocalThreadMessages(newThreadId);
            setPrevChats(localMessages);
            setNewChat(false);
            setReply(null);
            if(window.innerWidth <= 720) onCloseSidebar();
        }
    }   

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(apiUrl(`/api/thread/${threadId}`), {method: "DELETE"});
            if(response.ok) {
                const res = await response.json();
                console.log(res);
            }

            //updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            deleteLocalThread(threadId);

            if(threadId === currThreadId) {
                createNewChat();
            }

        } catch(err) {
            console.log(err);
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            deleteLocalThread(threadId);

            if(threadId === currThreadId) {
                createNewChat();
            }
        }
    }

    return (
        <section className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
            <button className="newChatBtn" onClick={createNewChat}>
                <span className="logoWrap">
                    <span className="logoIcon">
                        <span className="logoGlyph" aria-hidden="true">A</span>
                    </span>
                    <span className="logoText">ArkGPT</span>
                </span>
                <span className="newChatIcon"><i className="fa-solid fa-pen-to-square"></i></span>
            </button>


            <ul className="history">
                {
                    allThreads?.map((thread) => (
                        <li key={thread.threadId}
                            onClick={() => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted": ""}
                        >
                            <span className="threadTitle">{thread.title}</span>
                            <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation(); //stop event bubbling
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))
                }
            </ul>
 
            <div className="sign">
                <p>By Monark Goyal &hearts;</p>
            </div>
        </section>
    )
}

export default Sidebar;