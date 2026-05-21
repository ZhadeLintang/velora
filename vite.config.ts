import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite configuration keeps Lumora fast in development and optimized for production builds.
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
