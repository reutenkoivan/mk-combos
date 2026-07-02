import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type PluginOption, type UserConfig } from "vite";

type PluginInput = PluginOption | PluginOption[] | undefined;

export type MkCombosViteConfig = UserConfig & {
  preReactPlugins?: PluginInput;
};

const toPluginArray = (plugins: PluginInput = []) => {
  return Array.isArray(plugins) ? plugins : [plugins];
};

export const createViteConfig = (options: MkCombosViteConfig = {}) => {
  const { plugins, preReactPlugins, ...config } = options;

  return defineConfig({
    ...config,
    plugins: [tailwindcss(), ...toPluginArray(preReactPlugins), react(), ...toPluginArray(plugins)],
  });
};
