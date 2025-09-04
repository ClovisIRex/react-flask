import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";

export const http = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" }
});

// Attach token automatically
http.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize errors to a readable message
export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    if (typeof data === "string") return data;
    if (data && typeof data === "object") {
      return data.message || data.detail || err.response?.statusText || "Request failed";
    }
    return err.message || "Request failed";
  }
  return String(err || "Request failed");
}
