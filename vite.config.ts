import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/**
 * Sakany Admin Dashboard — Vite configuration
 *
 *  ┌──────────────────────────────────────────────────────────────────┐
 *  │  Path aliases:  "@/..."  →  "./src/..."                          │
 *  │  لازم يكون متطابق مع "paths" في tsconfig.app.json               │
 *  └──────────────────────────────────────────────────────────────────┘
 *
 *  ┌──────────────────────────────────────────────────────────────────┐
 *  │  Dev proxies (لتفادي CORS مع الـ Spring backend على :8080)       │
 *  │                                                                   │
 *  │  /v1/...  →  http://localhost:8080/v1/...                        │
 *  │      تستخدمه: features/auth, lib/authService.apiFetch,            │
 *  │              announcementService, notificationService,            │
 *  │              MissingFound API, إلخ.                               │
 *  │                                                                   │
 *  │  /api/... →  http://localhost:8080/...   (تشيل البادئة)           │
 *  │      تستخدمه: أي feature تستعمل البادئة /api كـ namespace.        │
 *  └──────────────────────────────────────────────────────────────────┘
 */

const BACKEND_URL = "http://localhost:8080";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      // ── الـ Spring backend مباشرة (مع البادئة /v1)
      "/v1": {
        target: BACKEND_URL,
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      // ── البادئة /api تتشال قبل الـ forward (للـ services اللي بتعمل /api/users إلخ)
      "/api": {
        target: BACKEND_URL,
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (pathName) => pathName.replace(/^\/api/, ""),
      },
    },
  },

  preview: {
    port: 4173,
    strictPort: false,
  },
});
