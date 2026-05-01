import axios from "axios";
import { create } from "zustand";
import { authApi } from "../data/authApi";
import { tokenStorage } from "../domain/tokenStorage";
import type {
  AuthTokens,
  AuthUser,
  LoginEmailRequest,
  LoginPhoneRequest,
  RegisterRequest,
  SendOtpRequest,
} from "../domain/types";

type AuthStore = {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  sendOtp: (payload: SendOtpRequest) => Promise<string>;
  loginWithEmail: (payload: LoginEmailRequest) => Promise<void>;
  loginWithPhone: (payload: LoginPhoneRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  refreshSession: () => Promise<void>;
  fetchMe: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
};

const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as
      | { message?: string; detail?: string; title?: string }
      | undefined;

    const responseMessage =
      responseData?.message ??
      responseData?.detail ??
      responseData?.title ??
      error.response?.statusText;

    if (responseMessage) {
      return responseMessage;
    }
  }

  return error instanceof Error ? error.message : "Something went wrong";
};

const ADMIN_ROLE = "ADMIN";

const isAdminUser = (user: AuthUser): boolean => user.role === ADMIN_ROLE;

/**
 * Fallback: لو الـ backend ما عندوش endpoint /v1/auth/me أو فشل،
 * نستخرج بيانات المستخدم من الـ JWT access token مباشرة.
 */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const decoded = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function buildUserFromJwt(accessToken: string): AuthUser | null {
  const claims = decodeJwtPayload(accessToken);
  if (!claims) return null;

  const id =
    (claims.userId as string) ??
    (claims.sub as string) ??
    (claims.id as string) ??
    "";
  if (!id) return null;

  let role = "";
  if (typeof claims.role === "string") {
    role = claims.role;
  } else if (Array.isArray(claims.authorities) && claims.authorities[0]) {
    role = String(claims.authorities[0]).replace(/^ROLE_/, "");
  } else if (typeof claims.authorities === "string") {
    role = claims.authorities.replace(/^ROLE_/, "");
  }

  const fullName = (claims.name as string) ?? "";
  const [first = "", ...rest] = fullName.split(" ");
  const last = rest.join(" ");

  return {
    id,
    firstName: (claims.firstName as string) ?? first,
    lastName: (claims.lastName as string) ?? last,
    phoneNumber: (claims.phoneNumber as string) ?? "",
    email: (claims.email as string) ?? null,
    role,
    isActive: true,
    isPhoneVerified: false,
    loginMethod: "EMAIL",
  };
}

const applyTokens = (
  tokens: AuthTokens | null,
  set: (partial: Partial<AuthStore>) => void,
): void => {
  if (tokens) {
    tokenStorage.setTokens(tokens);
    set({ tokens, isAuthenticated: true });
    return;
  }

  tokenStorage.clearTokens();
  set({ tokens: null, user: null, isAuthenticated: false });
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  tokens: tokenStorage.getTokens(),
  isAuthenticated: Boolean(tokenStorage.getTokens()?.accessToken),
  isLoading: false,
  isHydrated: false,
  error: null,

  hydrate: async () => {
    const tokens = tokenStorage.getTokens();
    if (!tokens) {
      set({
        isHydrated: true,
        isAuthenticated: false,
        tokens: null,
        user: null,
      });
      return;
    }

    set({ tokens, isAuthenticated: true });

    try {
      await get().fetchMe();
    } catch {
      applyTokens(null, set);
    } finally {
      set({ isHydrated: true });
    }
  },

  sendOtp: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authApi.sendOtp(payload);
      return data.message;
    } catch (error) {
      const message = getApiErrorMessage(error);
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  loginWithEmail: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authApi.loginWithEmail(payload);
      applyTokens(
        { accessToken: data.accessToken, refreshToken: data.refreshToken },
        set,
      );
      await get().fetchMe();
    } catch (error) {
      applyTokens(null, set);
      const message = getApiErrorMessage(error);
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  loginWithPhone: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authApi.loginWithPhone(payload);
      applyTokens(
        { accessToken: data.accessToken, refreshToken: data.refreshToken },
        set,
      );
      await get().fetchMe();
    } catch (error) {
      applyTokens(null, set);
      const message = getApiErrorMessage(error);
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authApi.register(payload);
      applyTokens(
        { accessToken: data.accessToken, refreshToken: data.refreshToken },
        set,
      );
      await get().fetchMe();
    } catch (error) {
      applyTokens(null, set);
      const message = getApiErrorMessage(error);
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  refreshSession: async () => {
    const refreshToken =
      get().tokens?.refreshToken ?? tokenStorage.getTokens()?.refreshToken;
    if (!refreshToken) {
      applyTokens(null, set);
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const { data } = await authApi.refresh({ refreshToken });
      applyTokens(
        { accessToken: data.accessToken, refreshToken: data.refreshToken },
        set,
      );
      await get().fetchMe();
    } catch (error) {
      applyTokens(null, set);
      const message = getApiErrorMessage(error);
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMe: async () => {
    // 1) جرّب /v1/auth/me الأول
    try {
      const { data } = await authApi.me();
      if (!isAdminUser(data)) {
        applyTokens(null, set);
        const message = "Admin access only";
        set({ error: message });
        throw new Error(message);
      }
      set({ user: data, isAuthenticated: true });
      return;
    } catch (meError) {
      // 2) Fallback: لو /me فشل (مثلاً 404)، نفك الـ JWT.
      const accessToken =
        get().tokens?.accessToken ?? tokenStorage.getTokens()?.accessToken;

      if (accessToken) {
        const fallbackUser = buildUserFromJwt(accessToken);
        if (fallbackUser && isAdminUser(fallbackUser)) {
          set({ user: fallbackUser, isAuthenticated: true, error: null });
          return;
        }
        if (fallbackUser && !isAdminUser(fallbackUser)) {
          applyTokens(null, set);
          const message = "Admin access only";
          set({ error: message });
          throw new Error(message);
        }
      }

      const message = getApiErrorMessage(meError);
      set({ error: message });
      throw meError;
    }
  },

  logout: () => {
    applyTokens(null, set);
    set({ isLoading: false, error: null, isHydrated: true });
  },

  clearError: () => {
    set({ error: null });
  },
}));
