import { afterEach, describe, expect, it } from "vitest";
import { webBasePath, webRouterBasePath } from "./config/web-path";
import { getRouter } from "./router";

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

  it("replace-redirects the deprecated hash URL to backup settings", async () => {
    globalThis.window.history.replaceState({}, "", `${webBasePath}#/backup`);
    const router = getRouter();

    try {
      await router.load();
      router.history.flush();

      expect(router.state.location.pathname).toBe("/settings");
      expect(router.state.location.search).toEqual({ section: "backup" });
      expect(globalThis.window.location.pathname).toBe("/mk-combos/");
      expect(globalThis.window.location.hash).toBe("#/settings?section=backup");
    } finally {
      router.history.destroy();
    }
  });
});
