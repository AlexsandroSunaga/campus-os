const BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8014";

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/api/v1${path}`, init);
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export function qrUrl(token: string) {
  return `${BASE}/api/v1/qr/${token}`;
}

const TOKEN_KEY = "campusos_token";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* storage unavailable */
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable */
  }
}

function authHeaders(auth?: boolean): Record<string, string> {
  const token = auth ? getToken() : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function apiGet<T>(path: string, auth = false): Promise<T> {
  return api<T>(path, { headers: authHeaders(auth) });
}

export function apiPost<T>(path: string, body: unknown, auth = false): Promise<T> {
  return api<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(auth) },
    body: JSON.stringify(body),
  });
}
