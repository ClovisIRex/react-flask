import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

export default function LoginPage() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password");
  const [err, setErr] = useState("");
  const { signin } = useAuth();
  const navigate = useNavigate();

  async function submit(e: FormEvent) {
    e.preventDefault();
    try {
      await signin(email, password);
      navigate("/");
    } catch (e: any) {
      setErr(e.message || "Login failed");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "2rem auto" }}>
      <h1>Login</h1>
      <form onSubmit={submit} className="card">
        <div style={{ marginBottom: 8 }}>
          <label>Email</label>
          <input className="input" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Password</label>
          <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        {err && <p style={{ color: "red" }}>{err}</p>}
        <button className="btn" type="submit">Sign in</button>
      </form>
    </div>
  );
}
