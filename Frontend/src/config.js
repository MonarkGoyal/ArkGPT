const DEFAULT_API_BASE_URL = "http://localhost:8080";

const envBaseUrl = (import.meta.env.VITE_API_BASE_URL || "")
    .trim()
    .replace(/\/+$/, "");

const isHttpsPage = typeof window !== "undefined" && window.location.protocol === "https:";
const fallbackBaseUrl = isHttpsPage ? "" : DEFAULT_API_BASE_URL;
const candidateBaseUrl = envBaseUrl || fallbackBaseUrl;

const blocksMixedContent = isHttpsPage && /^http:\/\//i.test(candidateBaseUrl);

export const API_BASE_URL = blocksMixedContent ? "" : candidateBaseUrl;

export const apiUrl = (path) => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
};
