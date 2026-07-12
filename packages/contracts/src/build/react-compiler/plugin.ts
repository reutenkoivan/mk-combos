import type { PluginItem } from "@babel/core";
import babel from "@rolldown/plugin-babel";
import { reactCompilerPreset } from "@vitejs/plugin-react";
import reactCompiler from "babel-plugin-react-compiler";

export const reactCompilerBabelPluginName = "@rolldown/plugin-babel";
export const reactPluginBabelPluginName = "vite:react-babel";

type ReactCompilerOptions = Parameters<typeof reactCompilerPreset>[0];

const createReactCompilerPluginItem = (options?: ReactCompilerOptions): PluginItem => {
  if (options === undefined) {
    return reactCompiler;
  }

  return [reactCompiler, options];
};

const createReactCompilerPreset = (options?: ReactCompilerOptions) => {
  const preset = reactCompilerPreset(options);

  return {
    ...preset,
    preset: () => ({
      plugins: [createReactCompilerPluginItem(options)],
    }),
  };
};

export const createReactCompilerBabelPlugin = () =>
  babel({
    presets: [createReactCompilerPreset()],
  });
