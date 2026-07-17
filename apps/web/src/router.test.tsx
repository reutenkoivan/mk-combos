import { afterEach, describe, expect, it } from "vitest";
import { getRouter } from "./router";
import { webBasePath, webRouterBasePath } from "./routing/web-path/value";

afterEach(() => {
  globalThis.window.history.replaceState({}, "", "/");
});

describe("getRouter", () => {
  it("separates the GitHub Pages asset base from hash route paths", async () => {
    globalThis.window.history.replaceState({}, "", `${webBasePath}#/mkxl/catalog`);
    const router = getRouter();

    try {
      await router.load();

      expect(router.basepath).toBe(webRouterBasePath);
      expect(router.history.location.pathname).toBe("/mkxl/catalog");
      expect(router.history.createHref("/mk1/catalog")).toBe("/mk-combos/#/mk1/catalog");
      expect(router.options.defaultPreload).toBe("intent");
      expect(router.options.scrollRestoration).toBe(true);
      expect(webBasePath).toBe("/mk-combos/");
      expect(router.options.rewrite).toBeUndefined();
    } finally {
      router.history.destroy();
    }
  });

  it("does not treat a matching hash segment as the outer document base", async () => {
    globalThis.window.history.replaceState({}, "", `${webBasePath}#/mk-combos/catalog`);
    const router = getRouter();

    try {
      await router.load();

      expect(router.state.location.pathname).toBe("/mk-combos/catalog");
    } finally {
      router.history.destroy();
    }
  });

  it("loads the trailing-slash catalog index from hash history", async () => {
    globalThis.window.history.replaceState({}, "", `${webBasePath}#/mk1/catalog/`);
    const router = getRouter();

    try {
      await router.load();

      expect(router.state.location.pathname).toBe("/mk1/catalog/");
      expect(router.state.matches.at(-1)).toMatchObject({
        fullPath: "/$gameId/catalog/",
        status: "success",
      });
    } finally {
      router.history.destroy();
    }
  });

  it("keeps the removed backup hash URL on the recovery route without compatibility redirect", async () => {
    globalThis.window.history.replaceState({}, "", `${webBasePath}#/backup`);
    const router = getRouter();

    try {
      await router.load();
      router.history.flush();

      expect(router.state.location.pathname).toBe("/backup");
      expect(router.state.location.search).toEqual({});
      expect(router.state.matches.at(-1)?.fullPath).toBe("/$");
      expect(globalThis.window.location.pathname).toBe("/mk-combos/");
      expect(globalThis.window.location.hash).toBe("#/backup");
    } finally {
      router.history.destroy();
    }
  });
});
