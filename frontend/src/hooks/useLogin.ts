import { useCallback, useState } from "react";
import type { AxiosError } from "axios";
import { api } from "@/API/api";
import { saveAuth } from "@/auth/auth";

function parseAxiosError(err: unknown): string {
  const ax = err as AxiosError<any>;
  const msg =
    ax?.response?.data?.message ||
    ax?.response?.data ||
    ax?.message ||
    "Login failed. Please try again.";
  return String(msg).toLowerCase().includes("invalid")
    ? "Incorrect username or password."
    : String(msg);
}

export function useLogin(onSuccess?: () => void) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const canSubmit = username.trim().length > 0 && password.length > 0 && !loading;

  const submit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setErrMsg(null);
    try {
      const res = await api.login(username.trim(), password);
      saveAuth(res.token, res.user);
      onSuccess?.();
    } catch (err) {
      setErrMsg(parseAxiosError(err));
    } finally {
      setLoading(false);
    }
  }, [canSubmit, username, password, onSuccess]);

  return {
    state: { username, password, loading, errMsg, canSubmit },
    actions: {
      setUsername,
      setPassword,
      clearError: () => setErrMsg(null),
      submit,
    },
  };
}
