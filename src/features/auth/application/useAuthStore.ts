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
    try {
      const { data } = await authApi.me();
      if (!isAdminUser(data)) {
        applyTokens(null, set);
        const message = "Admin access only";
        set({ error: message });
        throw new Error(message);
      }

      set({ user: data, isAuthenticated: true });
    } catch (error) {
      const message = getApiErrorMessage(error);
      set({ error: message });
      throw error;
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
