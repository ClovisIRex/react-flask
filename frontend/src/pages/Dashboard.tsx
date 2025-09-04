import { useNavigate } from "react-router-dom";
import { clearAuth } from "../Login/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  function logout() {
    clearAuth();
    navigate("/login", { replace: true });
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-slate-600">You are logged in. Build your app here.</p>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-50"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
