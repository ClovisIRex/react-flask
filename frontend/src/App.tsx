import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "@/routes/RequireAuth";
import RequireGuest from "@/routes/RequireGuest";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Guests only - if logged in, redirect to /dashboard */}
        <Route
          path="/login"
          element={
            <RequireGuest>
              <Login />
            </RequireGuest>
          }
        />

        {/* Auth only */}
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
