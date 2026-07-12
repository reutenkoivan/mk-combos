import { mkCombosEnv } from "@mk-combos/contracts/env/value";
import { defineConfig, type UserConfig } from "tsdown";
import { createReactCompilerBabelPlugin } from "#build/react-compiler/plugin";

const toTsdownPluginArray = (plugins: UserConfig["plugins"] = []) => {
  return Array.isArray(plugins) ? plugins : [plugins];
};

const logConfiguration = (finalConfig: UserConfig, options: UserConfig) => {
  const configTable = [
    { Setting: "Build Mode", Value: mkCombosEnv.isProduction ? "production" : "development" },
    { Setting: "Minification", Value: finalConfig.minify ? "enabled" : "disabled" },
    { Setting: "Type Definitions", Value: finalConfig.dts ? "enabled" : "disabled" },
    { Setting: "Package Exports", Value: finalConfig.exports ? "enabled" : "disabled" },
    { Setting: "Output Dir", Value: finalConfig.outDir },
    {
      Setting: "Custom Options",
      Value: Object.keys(options).length > 0 ? Object.keys(options).join(", ") : "none",
    },
  ];

  console.log(`\n${"=".repeat(50)}`);
  console.log("TSDOWN CONFIGURATION");
  console.log("=".repeat(50));
  console.table(configTable);
  console.log(`${"=".repeat(50)}\n`);
};

export const createTsdownConfig = (options: UserConfig = {}) =>
  defineConfig((inlineConfig) => {
    const isWatchMode = Boolean(inlineConfig.watch ?? options.watch);
    const bareDependencyPattern = /^[^./]/u;

    const finalConfig: UserConfig = {
      deps: {
        skipNodeModulesBundle: true,
        ...options.deps,
        dts: {
          neverBundle: bareDependencyPattern,
          ...options.deps?.dts,
        },
      },
      dts: true,
      exports: {
        devExports: true,
      },
      format: ["esm"],
      minify: mkCombosEnv.isProduction,
      outDir: "dist",
      sourcemap: true,
      ...options,
      clean: options.clean ?? !isWatchMode,
      checks: {
        pluginTimings: false,
        ...options.checks,
      },
    };

    if (mkCombosEnv.isTsdownVerbose) {
      logConfiguration(finalConfig, options);
    }

    return finalConfig;
  });

export const createReactTsdownConfig = (options: UserConfig = {}) =>
  createTsdownConfig({
    ...options,
    plugins: [createReactCompilerBabelPlugin(), ...toTsdownPluginArray(options.plugins)],
  });
