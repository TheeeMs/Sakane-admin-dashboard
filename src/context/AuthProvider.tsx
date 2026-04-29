// src/context/AuthProvider.tsx
// Only exports a React component → satisfies react-refresh/only-export-components

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import {
  login as apiLogin,
  getMe,
  clearTokens,
  getAccessToken,
  type LoginDTO,
  type CurrentUser,
} from "../lib/authService";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]         = useState<CurrentUser | null | undefined>(undefined);
  const [isLoading, setLoading] = useState(true);

  // ── Restore session on mount ─────────────────────────────────────────────
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const me = await getMe();
        if (!cancelled) setUser(me);
      } catch {
        clearTokens();
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(async (dto: LoginDTO) => {
    setLoading(true);
    try {
      await apiLogin(dto);
      const me = await getMe();
      setUser(me);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}