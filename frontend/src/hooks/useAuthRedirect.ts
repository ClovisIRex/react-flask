import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/auth/auth";

export function useAuthRedirect(to: string = "/dashboard") {
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated()) navigate(to, { replace: true });
  }, [navigate, to]);
}
