import { useNavigate } from "react-router-dom";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useLogin } from "@/hooks/useLogin";
import { LoginForm } from "@/components/auth/LoginForm";
import { ErrorDialog } from "@/components/common/ErrorDialog";

export default function LoginPage() {
  const navigate = useNavigate();
  useAuthRedirect("/dashboard");

  const {
    state: { username, password, loading, errMsg, canSubmit },
    actions: { setUsername, setPassword, submit, clearError },
  } = useLogin(() => navigate("/dashboard", { replace: true }));

  return (
    <>
      <LoginForm
        username={username}
        password={password}
        loading={loading}
        canSubmit={canSubmit}
        onUsername={setUsername}
        onPassword={setPassword}
        onSubmit={submit}
      />
      <ErrorDialog open={!!errMsg} message={errMsg} onClose={clearError} title="Login error" />
    </>
  );
}
