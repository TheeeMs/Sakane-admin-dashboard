// src/lib/authService.ts

const BASE_URL = "/v1/auth";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId?: string;
}

export interface CurrentUser {
  userId: string;
  email?: string;
  name?: string;
  role?: string;
  [key: string]: unknown;
}

// ─── localStorage keys ───────────────────────────────────────────────────────
//
// الـ login الجديد (features/auth) بيخزن في key واحد JSON:
//   "sakany_admin_auth_tokens" = { accessToken, refreshToken }
// الـ keys القديمة لسه موجودة كـ fallback عشان أي كود قديم يكمل شغّال.

const NEW_TOKENS_KEY    = "sakany_admin_auth_tokens";
const ACCESS_TOKEN_KEY  = "sakane_access_token";
const REFRESH_TOKEN_KEY = "sakane_refresh_token";
const USER_ID_KEY       = "sakane_user_id";

interface NewTokens {
  accessToken?: string;
  refreshToken?: string;
}

function readNewTokens(): NewTokens | null {
  try {
    const raw = localStorage.getItem(NEW_TOKENS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as NewTokens;
  } catch {
    return null;
  }
}

// ─── JWT decoder (no library needed) ─────────────────────────────────────────

function decodeJwt(token: string): Record<string, unknown> {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return {};
  }
}

function extractUserIdFromToken(token: string): string {
  const claims = decodeJwt(token);
  return (
    (claims["userId"] as string) ||
    (claims["sub"]    as string) ||
    (claims["id"]     as string) ||
    (claims["user_id"] as string) ||
    ""
  );
}

// ─── Token helpers ───────────────────────────────────────────────────────────

export function getAccessToken(): string | null {
  // 1) جرّب الـ key الجديد بتاع features/auth (الأولوية)
  const fromNew = readNewTokens()?.accessToken;
  if (fromNew) return fromNew;
  // 2) fallback للـ key القديم
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  const fromNew = readNewTokens()?.refreshToken;
  if (fromNew) return fromNew;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getUserId(): string | null {
  // محاولة من الـ key المخصص
  const direct = localStorage.getItem(USER_ID_KEY);
  if (direct) return direct;
  // fallback: استخرجه من الـ access token
  const token = getAccessToken();
  if (token) {
    const id = extractUserIdFromToken(token);
    if (id) return id;
  }
  return null;
}

function saveTokens(res: LoginResponse) {
  localStorage.setItem(ACCESS_TOKEN_KEY,  res.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);

  const userId = res.userId || extractUserIdFromToken(res.accessToken);
  if (userId) localStorage.setItem(USER_ID_KEY, userId);
}

export function clearTokens() {
  // امسح الـ key الجديد
  localStorage.removeItem(NEW_TOKENS_KEY);
  // وامسح الـ keys القديمة كمان
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
}

// ─── Authenticated fetch ──────────────────────────────────────────────────────

export async function apiFetch(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  const token = getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(input, { ...init, headers });

  if (res.status === 401) {
    clearTokens();
    window.location.href = "/login";
  }

  return res;
}

// ─── API calls ───────────────────────────────────────────────────────────────

export async function login(dto: LoginDTO): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/login/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "Login failed");
    throw new Error(msg || `Login failed (${res.status})`);
  }

  const data: LoginResponse = await res.json();
  saveTokens(data);
  return data;
}

export async function getMe(): Promise<CurrentUser> {
  const res = await apiFetch(`${BASE_URL}/me`);
  if (!res.ok) throw new Error(`Failed to fetch user (${res.status})`);
  const raw = await res.json();
  return { userId: getUserId() ?? "", ...raw };
}
