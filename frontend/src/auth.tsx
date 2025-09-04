import React, { createContext, useContext, useState } from "react";
import type { User } from "./types";
import { api } from "./api";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  signin: (email: string, password: string) => Promise<void>;
  signout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) as User : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  async function signin(email: string, password: string) {
    const res = await api.login(email, password);
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
  }

  function signout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
