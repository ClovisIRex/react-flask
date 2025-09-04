import { useMemo } from "react";

type StoredUser = { id?: number; username?: string };

/** Reads the user object once from localStorage and memoizes it. */
export function useUser() {
  const user: StoredUser = useMemo(
    () => {
      try {
        return JSON.parse(localStorage.getItem("user") || "{}");
      } catch {
        return {};
      }
    },
    [] // read once on mount
  );

  return {
    user,
    username: user?.username || "User",
    id: user?.id ?? null
  };
}
