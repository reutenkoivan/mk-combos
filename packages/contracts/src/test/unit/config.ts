import react from "@vitejs/plugin-react";
import { defineConfig, type ViteUserConfig } from "vitest/config";
import { createReactCompilerBabelPlugin } from "#build/react-compiler/plugin";

const toPluginArray = (plugins: ViteUserConfig["plugins"] = []) => {
  return Array.isArray(plugins) ? plugins : [plugins];
};

export const createUnitConfig = (options: ViteUserConfig = {}) => {
  const { plugins, test, ...config } = options;

  return defineConfig({
    ...config,
    plugins: [react(), createReactCompilerBabelPlugin(), ...toPluginArray(plugins)],
    test: {
      environment: "jsdom",
      globals: true,
      include: ["src/**/*.test.{ts,tsx}"],
      setupFiles: ["@mk-combos/contracts/test/unit/setup"],
      ...test,
    },
  });
};
