import { useEffect, useRef } from "react";
import { toast } from "sonner";

/**
 * Shows a welcome toast exactly once for a given username.
 * Uses a ref guard so StrictMode double-effects won't duplicate it.
 */
export function useWelcomeToast(username?: string, duration = 2000) {
  const shownRef = useRef(false);

  useEffect(() => {
    if (!username || shownRef.current) return;
    shownRef.current = true;
    toast.success(`Welcome ${username}!`, { duration, id: "welcome" });
  }, [username, duration]);
}
