import { defineConfig } from "vitest/config";
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    clearMocks: true,
    restoreMocks: true,
    globals: true,
    env: {
      VITE_API_URL: "http://localhost:5179"
    }
  }
});