import type { LoginResponse, Note } from "./types";

const BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...authHeaders(), ...(options.headers || {}) },
    ...options
  });
  if (!res.ok) {
    let msg = res.statusText;
    try { msg = await res.text(); } catch {}
    throw new Error(msg || "Request failed");
  }
  return res.status === 204 ? (null as T) : await res.json();
}

export const api = {
  login: (email: string, password: string) =>
    request<LoginResponse>("/api/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  getNotes: () => request<Note[]>("/api/notes"),
  createNote: (note: Pick<Note, "title" | "content">) =>
    request<Note>("/api/notes", { method: "POST", body: JSON.stringify(note) }),
  updateNote: (id: number, note: Partial<Pick<Note, "title" | "content">>) =>
    request<Note>(`/api/notes/${id}`, { method: "PUT", body: JSON.stringify(note) }),
  deleteNote: (id: number) => request<void>(`/api/notes/${id}`, { method: "DELETE" })
};
