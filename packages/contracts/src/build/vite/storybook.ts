import tailwindcss from "@tailwindcss/vite";
import { mergeConfig, type PluginOption, type UserConfig } from "vite";

type PluginInput = PluginOption | PluginOption[] | undefined;

const toPluginArray = (plugins: PluginInput = []) => {
  return Array.isArray(plugins) ? plugins : [plugins];
};

export const withStorybookViteConfig = (viteConfig: UserConfig, options: UserConfig = {}) => {
  const { build, plugins, ...config } = options;

  return mergeConfig(viteConfig, {
    ...config,
    build: {
      chunkSizeWarningLimit: 1200,
      ...build,
    },
    plugins: [tailwindcss(), ...toPluginArray(plugins)],
  });
};
