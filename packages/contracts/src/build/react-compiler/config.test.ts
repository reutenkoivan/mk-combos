import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { createReactTsdownConfig } from "@mk-combos/contracts/build/tsdown/config";
import { createViteConfig } from "@mk-combos/contracts/build/vite/config";
import { withStorybookViteConfig } from "@mk-combos/contracts/build/vite/storybook";
import { createUnitConfig } from "@mk-combos/contracts/test/unit/config";
import { describe, expect, it } from "vitest";
import {
  reactCompilerBabelPluginName,
  reactPluginBabelPluginName,
} from "#build/react-compiler/plugin";

const workspaceDirectories = ["packages", "mkxl", "mk1", "apps"] as const;

const hasPluginName = (value: unknown): value is { name: string } => {
  if (typeof value !== "object" || value === null || !("name" in value)) {
    return false;
  }

  return typeof value.name === "string";
};

const collectPluginNames = async (plugins: unknown): Promise<string[]> => {
  const names: string[] = [];

  const visit = async (plugin: unknown): Promise<void> => {
    const resolvedPlugin = await Promise.resolve(plugin);

    if (!resolvedPlugin) {
      return;
    }

    if (Array.isArray(resolvedPlugin)) {
      for (const nestedPlugin of resolvedPlugin) {
        await visit(nestedPlugin);
      }
      return;
    }

    if (hasPluginName(resolvedPlugin)) {
      names.push(resolvedPlugin.name);
    }
  };

  await visit(plugins);

  return names;
};

const expectReactCompilerAfterReactPlugin = async (plugins: unknown) => {
  const pluginNames = await collectPluginNames(plugins);
  const reactPluginIndex = pluginNames.indexOf(reactPluginBabelPluginName);
  const compilerPluginIndex = pluginNames.indexOf(reactCompilerBabelPluginName);

  expect(reactPluginIndex).toBeGreaterThanOrEqual(0);
  expect(compilerPluginIndex).toBeGreaterThan(reactPluginIndex);
};

const findWorkspaceRoot = () => {
  let currentDirectory = process.cwd();

  while (true) {
    if (
      existsSync(path.join(currentDirectory, "ARCHITECTURE.md")) &&
      existsSync(path.join(currentDirectory, "turbo.json"))
    ) {
      return currentDirectory;
    }

    const parentDirectory = path.dirname(currentDirectory);

    if (parentDirectory === currentDirectory) {
      throw new Error("Unable to resolve workspace root for React Compiler guard.");
    }

    currentDirectory = parentDirectory;
  }
};

const collectFiles = (directory: string): string[] => {
  if (!existsSync(directory)) {
    return [];
  }

  const files: string[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectFiles(entryPath));
      continue;
    }

    if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
};

const isReactLibrarySourceFile = (sourceFilePath: string) => {
  const normalizedPath = sourceFilePath.split(path.sep).join("/");

  return (
    /\.(jsx|tsx)$/u.test(normalizedPath) &&
    !/\.(test|stories)\.[jt]sx$/u.test(normalizedPath) &&
    !normalizedPath.includes("/stories/")
  );
};

const collectWorkspacePackageRoots = (workspaceRoot: string) => {
  const packageRoots: string[] = [];

  for (const workspaceDirectory of workspaceDirectories) {
    const workspaceDirectoryPath = path.join(workspaceRoot, workspaceDirectory);

    if (!existsSync(workspaceDirectoryPath)) {
      continue;
    }

    for (const entry of readdirSync(workspaceDirectoryPath, { withFileTypes: true })) {
      const packageRoot = path.join(workspaceDirectoryPath, entry.name);

      if (entry.isDirectory() && existsSync(path.join(packageRoot, "package.json"))) {
        packageRoots.push(packageRoot);
      }
    }
  }

  return packageRoots;
};

describe("React Compiler build configuration", () => {
  it("runs shared Vite and Vitest React transforms through the compiler after React", async () => {
    await expectReactCompilerAfterReactPlugin(createViteConfig().plugins);
    await expectReactCompilerAfterReactPlugin(createUnitConfig().plugins);
    await expectReactCompilerAfterReactPlugin(
      withStorybookViteConfig({
        plugins: [{ name: reactPluginBabelPluginName }],
      }).plugins,
    );
  });

  it("enables React Compiler for React tsdown library builds", async () => {
    const configExport = await createReactTsdownConfig({ entry: "src/index.ts" })(
      {},
      { ci: false },
    );
    const [reactTsdownConfig] = Array.isArray(configExport) ? configExport : [configExport];

    if (!reactTsdownConfig) {
      throw new Error("React tsdown config did not resolve to a config object.");
    }

    const pluginNames = await collectPluginNames(reactTsdownConfig.plugins);

    expect(pluginNames).toContain(reactCompilerBabelPluginName);
  });

  it("requires React library packages to use the React tsdown helper", () => {
    const workspaceRoot = findWorkspaceRoot();
    const violations = collectWorkspacePackageRoots(workspaceRoot).flatMap((packageRoot) => {
      const sourceFiles = collectFiles(path.join(packageRoot, "src"));
      const hasReactLibrarySource = sourceFiles.some(isReactLibrarySourceFile);

      if (!hasReactLibrarySource) {
        return [];
      }

      const tsdownConfigPath = path.join(packageRoot, "tsdown.config.ts");
      const packageName = path.relative(workspaceRoot, packageRoot);

      if (!existsSync(tsdownConfigPath)) {
        return [`${packageName} has React source but no tsdown.config.ts`];
      }

      const tsdownConfigSource = readFileSync(tsdownConfigPath, "utf8");

      if (!/\bcreateReactTsdownConfig\s*\(/u.test(tsdownConfigSource)) {
        return [`${packageName} has React source but does not use createReactTsdownConfig`];
      }

      return [];
    });

    expect(violations).toEqual([]);
  });
});
