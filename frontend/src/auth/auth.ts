export function saveAuth(token: string, user: unknown) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function isTokenValid(token: string | null): boolean {
  if (!token) return false;

  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return false;

    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);

    // `exp` is in seconds since epoch
    if (!payload.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch (err) {
    console.error("Invalid token:", err);
    return false;
  }
}

export function isAuthenticated(): boolean {
  const t = getToken();
  return isTokenValid ? isTokenValid(t) : Boolean(t); // fall back to presence if you prefer
}
