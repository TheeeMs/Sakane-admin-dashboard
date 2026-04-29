// src/hooks/useAuth.ts

import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "../context/AuthContext";

/**
 * Access auth state anywhere inside <AuthProvider>.
 *
 * @example
 * const { user, login, logout, isAuthenticated } = useAuth();
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}