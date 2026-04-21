const SESSION_KEY = "restaurant_user_session";

/** @returns {Record<string, string> | null} */
export function loadSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

/** Accepts Swagger `UserModel` shape or `{ user: {...} }`. */
export function normalizeLoginResponse(data) {
  if (!data || typeof data !== "object") return null;
  const user =
    "user" in data && data.user && typeof data.user === "object"
      ? data.user
      : data;
  if (!user || typeof user !== "object") return null;
  return {
    token: String(user.token ?? user.access_token ?? ""),
    refresh_token: String(user.refresh_token ?? ""),
    user_id: String(user.user_id ?? user.id ?? ""),
    email: String(user.email ?? ""),
    first_name: String(user.first_name ?? ""),
    last_name: String(user.last_name ?? user.Last_name ?? ""),
  };
}
