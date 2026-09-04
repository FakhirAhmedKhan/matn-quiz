import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },

  test: {
    globals: true,
    environment: "jsdom",

    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],

    pool: "vmThreads",
    maxWorkers: "85%",
    fileParallelism: true,
    isolate: true,

    css: false,

    testTimeout: 20_000,
    hookTimeout: 20_000,
  },
});