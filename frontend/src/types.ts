export type User = { id: number; email: string };
export type LoginResponse = { token: string; user: User };
export type Note = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};
