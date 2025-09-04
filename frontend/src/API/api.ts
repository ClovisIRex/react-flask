import { http } from "@/lib/http";
import type { Note } from "@/Types/note";

export type LoginResponse = { token: string; user: { id: number; username: string } };

export const api = {
  login(username: string, password: string) {
    return http.post<LoginResponse>("/api/login", { username, password }).then(r => r.data);
  },
  getNotes() {
    return http.get<Note[]>("/api/notes").then(r => r.data);
  },
  createNote(payload: { title: string; content: string }) {
    return http.post<Note>("/api/notes", payload).then(r => r.data);
  },
  updateNote(id: number, payload: Partial<Pick<Note, "title" | "content">>) {
    return http.put<Note>(`/api/notes/${id}`, payload).then(r => r.data);
  },
  deleteNote(id: number) {
    return http.delete<void>(`/api/notes/${id}`).then(() => undefined);
  }
};
