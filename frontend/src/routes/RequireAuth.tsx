import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/auth/auth";

export default function RequireAuth() {
  const authed = isAuthenticated();
  const location = useLocation();
  return authed ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}
