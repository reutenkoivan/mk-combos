import { mkCombosEnv } from "@mk-combos/contracts/env/value";
import { defineConfig, devices, type PlaywrightTestConfig } from "@playwright/test";

export type CreateE2eConfigOptions = PlaywrightTestConfig & {
  baseURL: string;
};

export const createE2eConfig = ({
  baseURL,
  projects,
  retries,
  use,
  ...config
}: CreateE2eConfigOptions) =>
  defineConfig({
    ...config,
    expect: {
      timeout: 10_000,
      ...config.expect,
    },
    forbidOnly: config.forbidOnly ?? mkCombosEnv.isCi,
    fullyParallel: config.fullyParallel ?? true,
    outputDir: config.outputDir ?? "test-results",
    projects: projects ?? [
      {
        name: "chromium",
        use: {
          ...devices["Desktop Chrome"],
        },
      },
    ],
    reporter:
      config.reporter ?? (mkCombosEnv.isCi ? [["dot"], ["html", { open: "never" }]] : [["list"]]),
    retries: retries ?? (mkCombosEnv.isCi ? 2 : 0),
    use: {
      baseURL,
      screenshot: "only-on-failure",
      trace: "on-first-retry",
      video: "retain-on-failure",
      ...use,
    },
  });
