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

const ACCESS_TOKEN_KEY  = "sakane_access_token";
const REFRESH_TOKEN_KEY = "sakane_refresh_token";
const USER_ID_KEY       = "sakane_user_id";

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
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getUserId(): string | null {
  return localStorage.getItem(USER_ID_KEY);
}

function saveTokens(res: LoginResponse) {
  localStorage.setItem(ACCESS_TOKEN_KEY,  res.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);

  const userId = res.userId || extractUserIdFromToken(res.accessToken);
  if (userId) localStorage.setItem(USER_ID_KEY, userId);
}

export function clearTokens() {
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