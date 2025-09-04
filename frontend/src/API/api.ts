import { http } from "@/lib/http";

export type LoginResponse = { token: string; user: { id: number; username: string } };

export const api = {
  login(username: string, password: string) {
    return http.post<LoginResponse>("/api/login", { username, password }).then(r => r.data);
  }
};
