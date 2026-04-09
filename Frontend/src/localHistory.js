const STORAGE_KEY = "arkgpt_threads_v1";

const readThreads = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const writeThreads = (threads) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
};

export const getLocalThreadsSummary = () => {
    return readThreads()
        .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
        .map((thread) => ({
            threadId: thread.threadId,
            title: thread.title,
        }));
};

export const getLocalThreadMessages = (threadId) => {
    const thread = readThreads().find((item) => item.threadId === threadId);
    return thread?.messages || [];
};

export const appendLocalMessages = (threadId, title, messages) => {
    if(!threadId || !Array.isArray(messages) || messages.length === 0) return;

    const threads = readThreads();
    const index = threads.findIndex((item) => item.threadId === threadId);
    const now = new Date().toISOString();

    if(index === -1) {
        threads.unshift({
            threadId,
            title: title || "New Chat",
            messages: [...messages],
            updatedAt: now,
        });
    } else {
        threads[index].messages = [...(threads[index].messages || []), ...messages];
        if(!threads[index].title && title) {
            threads[index].title = title;
        }
        threads[index].updatedAt = now;
    }

    writeThreads(threads);
};

export const deleteLocalThread = (threadId) => {
    const next = readThreads().filter((thread) => thread.threadId !== threadId);
    writeThreads(next);
};
