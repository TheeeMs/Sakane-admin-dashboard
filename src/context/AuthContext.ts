// src/context/authContext.ts
// ⚠️ This file only exports the context object (no components) to satisfy
//    eslint react-refresh/only-export-components rule.

import { createContext } from "react";
import type { LoginDTO } from "../lib/authService";
import type { CurrentUser } from "../lib/authService";

export interface AuthContextValue {
  /** undefined = still loading | null = not logged in | object = logged in */
  user: CurrentUser | null | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (dto: LoginDTO) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);