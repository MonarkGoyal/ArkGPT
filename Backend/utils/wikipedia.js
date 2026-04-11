// Wikipedia REST API integration — no API key required

const WIKIPEDIA_SUMMARY_URL = "https://en.wikipedia.org/api/rest_v1/page/summary";

const WIKI_PATTERNS = [
    /^(?:what|who|where)\s+(?:is|are|was|were)\s+(?:a\s+|an\s+|the\s+)?(.+)/i,
    /^tell\s+me\s+about\s+(.+)/i,
    /^(?:explain|describe)\s+(?:what\s+)?(.+)/i,
    /^(?:info|information)\s+(?:on|about)\s+(.+)/i,
    /^(?:search|look\s*up|find)\s+(?:for\s+)?(.+)/i,
];

// Queries that should NOT be routed to Wikipedia
const SKIP_PATTERNS = [
    /weather/i,
    /\d+\s*[+\-*/]\s*\d+/,
    /^(?:calculate|solve|evaluate|compute)/i,
    /^(?:define|meaning\s+of|definition)/i,
    /^(?:hi|hello|hey|thanks|thank\s*you|how\s+are\s+you)\s*[!?.]*$/i,
];

export const isWikipediaQuery = (message = "") => {
    const trimmed = message.trim();
    if (trimmed.length < 4) return false;

    if (SKIP_PATTERNS.some((pattern) => pattern.test(trimmed))) {
        return false;
    }

    return WIKI_PATTERNS.some((pattern) => pattern.test(trimmed));
};

export const extractWikipediaTopic = (message = "") => {
    const trimmed = message.trim().replace(/[?.!]+$/g, "");

    for (const pattern of WIKI_PATTERNS) {
        const match = trimmed.match(pattern);
        if (match && match[1]) {
            return match[1].trim();
        }
    }

    return trimmed;
};

export const getWikipediaSummary = async (message = "") => {
    const topic = extractWikipediaTopic(message);
    if (!topic) return null;

    try {
        // First try direct page lookup
        const encoded = encodeURIComponent(topic.replace(/\s+/g, "_"));
        const response = await fetch(`${WIKIPEDIA_SUMMARY_URL}/${encoded}`, {
            headers: {
                "User-Agent": "ArkGPT/1.0 (https://github.com/MonarkGoyal/ArkGPT)",
            },
        });

        if (response.ok) {
            const data = await response.json();
            if (data.type === "standard" && data.extract) {
                return formatWikipediaReply(data);
            }
        }

        // Fallback: search Wikipedia and use the first result
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&srlimit=1&format=json&origin=*`;
        const searchResponse = await fetch(searchUrl, {
            headers: {
                "User-Agent": "ArkGPT/1.0 (https://github.com/MonarkGoyal/ArkGPT)",
            },
        });

        if (!searchResponse.ok) return null;

        const searchData = await searchResponse.json();
        const firstResult = searchData?.query?.search?.[0];
        if (!firstResult) return null;

        const pageTitle = encodeURIComponent(firstResult.title.replace(/\s+/g, "_"));
        const summaryResponse = await fetch(`${WIKIPEDIA_SUMMARY_URL}/${pageTitle}`, {
            headers: {
                "User-Agent": "ArkGPT/1.0 (https://github.com/MonarkGoyal/ArkGPT)",
            },
        });

        if (!summaryResponse.ok) return null;

        const summaryData = await summaryResponse.json();
        if (summaryData.type === "standard" && summaryData.extract) {
            return formatWikipediaReply(summaryData);
        }

        return null;
    } catch (err) {
        console.log("Wikipedia API error:", err?.message);
        return null;
    }
};

const formatWikipediaReply = (data) => {
    const title = data.title || "Unknown";
    const extract = data.extract || "";
    const url = data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;

    return `**${title}**

${extract}

[Read more on Wikipedia](${url})`;
};
