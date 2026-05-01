import axios, { AxiosError } from "axios";

/**
 * Base URL for the Sakane Admin API.
 *
 * Development: نسيب الـ baseURL فاضي عشان الـ requests تبقى relative
 * (مثلاً "/v1/...") ودي بتعدّي على الـ Vite proxy المُعرَّف في vite.config.ts،
 * فبكده نتجنب أي مشكلة CORS تماماً.
 *
 * Production: استخدم متغير البيئة VITE_API_BASE_URL في ملف .env
 * مثال: VITE_API_BASE_URL=https://api.sakane.com
 */
const API_BASE_URL = import.meta.env.DEV
  ? ""
  : (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* ── Request interceptor: attach auth token if present ── */
const AUTH_TOKENS_KEY = "sakany_admin_auth_tokens";

function readAccessToken(): string | null {
  try {
    const raw = localStorage.getItem(AUTH_TOKENS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { accessToken?: string };
    return parsed?.accessToken ?? null;
  } catch {
    return null;
  }
}

axiosInstance.interceptors.request.use(
  (config) => {
    const token = readAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RFC 7807 (application/problem+json) shape:
 *   { type, title, status, detail, instance, ... }
 * Spring/Spring Boot شائع: { message, error, status, path, errors[] }
 */
interface ApiErrorBody {
  message?: string;
  error?: string;
  detail?: string;
  title?: string;
  errors?: Array<{ message?: string; field?: string; defaultMessage?: string }>;
  fieldErrors?: Array<{ message?: string; field?: string }>;
  violations?: Array<{ message?: string; field?: string }>;
}

function extractApiErrorMessage(body: ApiErrorBody | undefined): string | null {
  if (!body || typeof body !== "object") return null;

  if (body.detail) return body.detail;

  const fieldErrors = body.errors ?? body.fieldErrors ?? body.violations;
  if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
    const msgs = fieldErrors
      .map((e) => {
        const field = e.field ? `${e.field}: ` : "";
        const msg = e.message ?? e.defaultMessage ?? "";
        return `${field}${msg}`.trim();
      })
      .filter(Boolean);
    if (msgs.length > 0) return msgs.join(" • ");
  }

  return body.message ?? body.error ?? body.title ?? null;
}

/* ── Response interceptor: normalize error messages ── */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const status = error.response?.status;
    const apiMessage = extractApiErrorMessage(error.response?.data);
    const message =
      apiMessage ||
      error.message ||
      (status ? `Request failed with status ${status}` : "Something went wrong");

    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
