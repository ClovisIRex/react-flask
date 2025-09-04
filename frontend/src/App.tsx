import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./Login/Login";
import Dashboard from "./pages/Dashboard";
import { getToken } from "./Login/auth";
import "./App.css";

function PrivateRoute() {
  const token = getToken();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
