const FALLBACK_API = "http://localhost:8000/api";

export const API_BASE_URL = ((): string => {
  const meta = (import.meta as any) || {};
  const envValue = meta.env?.VITE_API_BASE_URL;
  if (typeof envValue === "string" && envValue.trim().length > 0) {
    return envValue.trim();
  }
  return FALLBACK_API;
})();
