import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "@/features/auth/domain/tokenStorage";
import type { AuthResponse } from "@/features/auth/domain/types";

/**
 * In dev mode we prefix every request with "/api" and let the Vite proxy
 * (configured in vite.config.ts) rewrite it to http://localhost:8080.
 * This avoids browser CORS preflights against the backend during local
 * development.
 *
 *   /api/v1/auth/login/email  ->  http://localhost:8080/v1/auth/login/email
 *
 * In production the value of VITE_API_BASE_URL is used directly.
 */
const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : ((import.meta.env.VITE_API_BASE_URL as string | undefined) ??
    "http://localhost:8080");

const RETRY_FLAG = "_retry";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  [RETRY_FLAG]?: boolean;
};

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use((config) => {
  const tokens = tokenStorage.getTokens();
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    if (!originalRequest || originalRequest[RETRY_FLAG]) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response?.status === 401;
    const isRefreshRequest = originalRequest.url?.includes("/v1/auth/refresh");
    if (!isUnauthorized || isRefreshRequest) {
      return Promise.reject(error);
    }

    const tokens = tokenStorage.getTokens();
    if (!tokens?.refreshToken) {
      tokenStorage.clearTokens();
      return Promise.reject(error);
    }

    try {
      const refreshResponse = await axios.post<AuthResponse>(
        `${API_BASE_URL}/v1/auth/refresh`,
        { refreshToken: tokens.refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const nextTokens = {
        accessToken: refreshResponse.data.accessToken,
        refreshToken: refreshResponse.data.refreshToken,
      };

      tokenStorage.setTokens(nextTokens);
      originalRequest[RETRY_FLAG] = true;
      originalRequest.headers.Authorization = `Bearer ${nextTokens.accessToken}`;

      return httpClient(originalRequest);
    } catch (refreshError) {
      tokenStorage.clearTokens();
      return Promise.reject(refreshError);
    }
  },
);
