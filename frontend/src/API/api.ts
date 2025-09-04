const BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";

type LoginResponse = { token: string; user: { id: number; username: string } };

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    ...init
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(msg || "Request failed");
  }
  return res.status === 204 ? (null as T) : await res.json();
}

export const api = {
  login(username: string, password: string) {
    return request<LoginResponse>("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
  }
};
