import { describe, expect, it } from "vitest";

import { webBasePath, webRouterBasePath } from "./value";

describe("web deployment path", () => {
  it("keeps the GitHub Pages application base stable", () => {
    expect(webBasePath).toBe("/mk-combos/");
    expect(webRouterBasePath).toBe("/");
  });
});
