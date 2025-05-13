import { defineConfig } from "vitest/config";
import preact from "@preact/preset-vite";

export default defineConfig({
  plugins: [preact()],
  test: {
    globals: true,
    include: ["src/**/*.test.ts?(x)"],
    environment: "happy-dom",
    setupFiles: "./test-setup.ts",
  },
});
