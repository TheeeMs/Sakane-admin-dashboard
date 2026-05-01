import type { AuthTokens } from "./types";

const AUTH_TOKENS_STORAGE_KEY = "sakany_admin_auth_tokens";

const isBrowser = typeof window !== "undefined";

const parseTokens = (raw: string | null): AuthTokens | null => {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AuthTokens>;
    if (!parsed.accessToken || !parsed.refreshToken) {
      return null;
    }

    return {
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken,
    };
  } catch {
    return null;
  }
};

export const tokenStorage = {
  getTokens(): AuthTokens | null {
    if (!isBrowser) {
      return null;
    }

    return parseTokens(window.localStorage.getItem(AUTH_TOKENS_STORAGE_KEY));
  },

  setTokens(tokens: AuthTokens): void {
    if (!isBrowser) {
      return;
    }

    window.localStorage.setItem(AUTH_TOKENS_STORAGE_KEY, JSON.stringify(tokens));
  },

  clearTokens(): void {
    if (!isBrowser) {
      return;
    }

    window.localStorage.removeItem(AUTH_TOKENS_STORAGE_KEY);
  },
};
