import { Navigate } from "react-router-dom";
import { isAuthenticated } from "@/auth/auth";

export default function RequireGuest({ children }: { children: JSX.Element }) {
  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : children;
}
