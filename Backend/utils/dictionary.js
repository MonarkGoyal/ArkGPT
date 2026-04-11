// Free Dictionary API integration — no API key required
// https://dictionaryapi.dev/

const DICTIONARY_API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

const DEFINE_PATTERNS = [
    /^(?:define|definition\s+of)\s+(.+)/i,
    /^(?:what\s+does)\s+(.+?)\s+mean\??$/i,
    /^(?:meaning\s+of)\s+(.+)/i,
    /^(?:what\s+is\s+the\s+meaning\s+of)\s+(.+)/i,
    /^(?:what\s+is\s+the\s+definition\s+of)\s+(.+)/i,
];

export const isDictionaryQuery = (message = "") => {
    const trimmed = message.trim();
    if (trimmed.length < 4) return false;
    return DEFINE_PATTERNS.some((pattern) => pattern.test(trimmed));
};

export const extractWord = (message = "") => {
    const trimmed = message.trim().replace(/[?.!]+$/g, "");

    for (const pattern of DEFINE_PATTERNS) {
        const match = trimmed.match(pattern);
        if (match && match[1]) {
            // Take just the first word or short phrase
            return match[1].trim().toLowerCase().replace(/[^a-z\s-]/g, "").split(/\s+/).slice(0, 3).join(" ");
        }
    }

    return null;
};

export const getDictionaryResponse = async (message = "") => {
    const word = extractWord(message);
    if (!word) return null;

    try {
        const encoded = encodeURIComponent(word);
        const response = await fetch(`${DICTIONARY_API_URL}/${encoded}`);

        if (!response.ok) {
            if (response.status === 404) {
                return `I couldn't find a dictionary entry for "${word}". Check the spelling or try a different word.`;
            }
            return null;
        }

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) return null;

        return formatDictionaryReply(data[0]);
    } catch (err) {
        console.log("Dictionary API error:", err?.message);
        return null;
    }
};

const formatDictionaryReply = (entry) => {
    const word = entry.word || "Unknown";
    const phonetic = entry.phonetic || entry.phonetics?.find((p) => p.text)?.text || "";

    let reply = `**${word}**`;
    if (phonetic) {
        reply += ` ${phonetic}`;
    }
    reply += "\n";

    const meanings = entry.meanings || [];
    for (const meaning of meanings.slice(0, 3)) {
        const partOfSpeech = meaning.partOfSpeech || "";
        reply += `\n*${partOfSpeech}*\n`;

        const definitions = meaning.definitions || [];
        for (const def of definitions.slice(0, 2)) {
            reply += `- ${def.definition}\n`;
            if (def.example) {
                reply += `  *Example: "${def.example}"*\n`;
            }
        }

        const synonyms = meaning.synonyms || [];
        if (synonyms.length > 0) {
            reply += `  Synonyms: ${synonyms.slice(0, 5).join(", ")}\n`;
        }
    }

    return reply.trim();
};
