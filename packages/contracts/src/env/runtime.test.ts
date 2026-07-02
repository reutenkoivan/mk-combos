import { getMkCombosEnv } from "@mk-combos/contracts/env/runtime";
import { afterEach, describe, expect, it } from "vitest";

const nodeProcess = process;
const originalEnv = nodeProcess.env;

const setProcessEnv = (env: NodeJS.ProcessEnv) => {
  nodeProcess.env = { ...env };
};

describe("getMkCombosEnv", () => {
  afterEach(() => {
    nodeProcess.env = originalEnv;
  });

  it("detects production only from the production node environment", () => {
    setProcessEnv({ EXTRA_ENV: "allowed", NODE_ENV: "production" });
    expect(getMkCombosEnv()).toEqual({
      nodeEnv: "production",
      isProduction: true,
      isCi: false,
      isTsdownVerbose: false,
    });

    setProcessEnv({ NODE_ENV: "development" });
    expect(getMkCombosEnv().isProduction).toBe(false);

    setProcessEnv({});
    expect(getMkCombosEnv().nodeEnv).toBeUndefined();
  });

  it("enables tsdown verbose mode for the supported truthy values", () => {
    setProcessEnv({ TSDOWN_VERBOSE: "1" });
    expect(getMkCombosEnv().isTsdownVerbose).toBe(true);

    setProcessEnv({ TSDOWN_VERBOSE: "true" });
    expect(getMkCombosEnv().isTsdownVerbose).toBe(true);

    setProcessEnv({ TSDOWN_VERBOSE: "yes" });
    expect(getMkCombosEnv().isTsdownVerbose).toBe(true);
  });

  it("keeps tsdown verbose mode disabled for absent or unsupported values", () => {
    setProcessEnv({});
    expect(getMkCombosEnv().isTsdownVerbose).toBe(false);

    setProcessEnv({ TSDOWN_VERBOSE: "0" });
    expect(getMkCombosEnv().isTsdownVerbose).toBe(false);

    setProcessEnv({ TSDOWN_VERBOSE: "TRUE" });
    expect(getMkCombosEnv().isTsdownVerbose).toBe(false);
  });

  it("keeps the existing ci truthiness semantics", () => {
    setProcessEnv({ CI: "1" });
    expect(getMkCombosEnv().isCi).toBe(true);

    setProcessEnv({ CI: "false" });
    expect(getMkCombosEnv().isCi).toBe(true);

    setProcessEnv({ CI: "" });
    expect(getMkCombosEnv().isCi).toBe(false);

    setProcessEnv({});
    expect(getMkCombosEnv().isCi).toBe(false);
  });
});
