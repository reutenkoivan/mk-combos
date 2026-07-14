// @vitest-environment node

import { createMemoryHistory } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { getRouter, webDocumentRewrite } from "./router";

function rewriteInput(path: string) {
  const url = new URL(path, "http://localhost");
  const rewrittenUrl = webDocumentRewrite.input({ url });

  return rewrittenUrl instanceof URL ? rewrittenUrl : url;
}

function rewriteOutput(path: string) {
  const url = new URL(path, "http://localhost");
  const rewrittenUrl = webDocumentRewrite.output({ url });

  return rewrittenUrl instanceof URL ? rewrittenUrl : url;
}

describe("getRouter on the Start server", () => {
  it.each([
    ["/mk-combos", "/"],
    ["/mk-combos/", "/"],
    ["/mk-combos/mkxl/catalog?source=pages", "/mkxl/catalog"],
    ["/mk-combos-extra/mkxl/catalog", "/mk-combos-extra/mkxl/catalog"],
  ])("maps the public document path %s to the logical route %s", (publicPath, routePath) => {
    const rewrittenUrl = rewriteInput(publicPath);

    expect(rewrittenUrl.pathname).toBe(routePath);
    expect(rewrittenUrl.search).toBe(publicPath.includes("source=pages") ? "?source=pages" : "");
  });

  it("re-adds the public document base to server-generated locations", () => {
    expect(rewriteOutput("/mk1/catalog").pathname).toBe("/mk-combos/mk1/catalog");
    expect(rewriteOutput("/").pathname).toBe("/mk-combos/");
  });

  it("keeps the rewrite disabled for the local root base", () => {
    const router = getRouter({ history: createMemoryHistory({ initialEntries: ["/"] }) });

    expect(import.meta.env.BASE_URL).toBe("/");
    expect(router.options.rewrite).toBeUndefined();
  });
});
