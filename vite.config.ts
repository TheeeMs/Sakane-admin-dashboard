import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

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
      "/v1": {
        target: BACKEND_URL,
        changeOrigin: true,
        secure: false,
        ws: true,
      },
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