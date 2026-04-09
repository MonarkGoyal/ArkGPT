const DEFAULT_API_BASE_URL = "http://localhost:8080";

const normalizedBaseUrl = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL)
    .trim()
    .replace(/\/+$/, "");

export const API_BASE_URL = normalizedBaseUrl;

export const apiUrl = (path) => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE_URL}${normalizedPath}`;
};
