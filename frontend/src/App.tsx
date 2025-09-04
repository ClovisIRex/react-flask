import { NavLink, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./auth";
import LoginPage from "./pages/LoginPage";
import NotesPage from "./pages/NotesPage";
import EditNotePage from "./pages/EditNotePage";

function Protected({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { user, signout } = useAuth();
  return (
    <>
      <nav className="nav">
        <NavLink to="/">Notes</NavLink>
        <span style={{ flex: 1 }} />
        {user ? (
          <>
            <span>{user.email}</span>
            <button className="btn" onClick={signout}>Sign out</button>
          </>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<Protected><NotesPage /></Protected>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/notes/:id" element={<Protected><EditNotePage /></Protected>} />
        </Routes>
      </div>
    </>
  );
}
