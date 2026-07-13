import { describe, expect, it } from "vitest";
import { webBasePath } from "./config/web-path";
import { getRouter } from "./router";

describe("getRouter", () => {
  it("owns the deployment base path and navigation defaults", () => {
    const router = getRouter();

    expect(router.basepath).toBe(webBasePath);
    expect(router.options.defaultPreload).toBe("intent");
    expect(router.options.scrollRestoration).toBe(true);
    expect(webBasePath).toBe("/mk-combos/");
  });
});
