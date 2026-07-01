import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["tools/**/*.test.{ts,tsx}", "*.test.{ts,tsx}"],
    passWithNoTests: true,
  },
});
