import { createMemoryHistory, type RouterHistory } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { SettingsModalSearchSchema } from "./pages/app-shell/settings-modal/search/schema";
import { getRouter } from "./router";

async function loadRoute(path: string) {
  const history = createMemoryHistory({ initialEntries: [path] });
  const router = getRouter({ history });

  await router.load();

  return { history, router };
}

function expectReplace(history: RouterHistory) {
  expect(history.length).toBe(1);
  expect(history.canGoBack()).toBe(false);
}

describe("application routes", () => {
  it.each([
    ["/", "/"],
    ["/mkxl/catalog", "/$gameId/catalog/"],
    ["/mkxl/lists", "/$gameId/lists"],
    ["/mkxl/builder", "/$gameId/builder"],
    ["/mk1/catalog", "/$gameId/catalog/"],
    ["/mk1/lists", "/$gameId/lists"],
    ["/mk1/builder", "/$gameId/builder"],
    [
      "/mkxl/catalog/kotal-kahn/war-god/kotal-kahn-war-god-starter-001",
      "/$gameId/catalog/$character/$specification/$comboId",
    ],
    [
      "/mk1/catalog/scorpion/cyrax/scorpion-cyrax-seed-001",
      "/$gameId/catalog/$character/$specification/$comboId",
    ],
  ])("loads %s under the deployment base path", async (path, expectedFullPath) => {
    const { history, router } = await loadRoute(path);
    const leafMatch = router.state.matches.at(-1);

    expect(history.location.pathname).toBe(path);
    expect(router.state.location.pathname).toBe(path);
    expect(leafMatch?.fullPath).toBe(expectedFullPath);
    expect(leafMatch?.status).toBe("success");
  });

  it.each(["mkxl", "mk1"])("replace-redirects bare /%s to its catalog", async (gameId) => {
    const { history, router } = await loadRoute(`/${gameId}`);

    expect(router.state.location.pathname).toBe(`/${gameId}/catalog`);
    expect(router.state.matches.at(-1)?.fullPath).toBe("/$gameId/catalog/");
    expect(router.state.matches.at(-1)?.params).toMatchObject({ gameId });
    expectReplace(history);
  });

  it.each([
    "interface",
    "backup",
  ])("opens the %s settings modal over the current route without replacing it", async (settings) => {
    const path = `/mk1/lists?settings=${settings}`;
    const { history, router } = await loadRoute(path);

    expect(history.location.pathname).toBe("/mk1/lists");
    expect(router.state.location.pathname).toBe("/mk1/lists");
    expect(router.state.location.search).toEqual({ settings });
    expect(router.state.matches.at(-1)?.fullPath).toBe("/$gameId/lists");
    expect(router.state.matches.at(-1)?.status).toBe("success");
  });

  it("preserves validated catalog search beside the settings modal state", async () => {
    const { router } = await loadRoute(
      "/mkxl/catalog/scorpion/ninjutsu?position=%5B%22midscreen%22%5D&settings=backup",
    );

    expect(router.state.location.pathname).toBe("/mkxl/catalog/scorpion/ninjutsu");
    expect(router.state.location.search).toEqual({
      position: ["midscreen"],
      settings: "backup",
    });
    expect(router.state.matches.at(-1)?.fullPath).toBe(
      "/$gameId/catalog/$character/$specification/",
    );
  });

  it("validates the settings modal state independently from foreign search keys", async () => {
    const { router } = await loadRoute("/mk1/lists?settings=interface&future=value");
    const appMatch = router.state.matches.find((match) => match.routeId === "/_app");

    expect(router.state.matches.at(-1)?.status).toBe("success");
    expect(SettingsModalSearchSchema.parse(appMatch?.search)).toEqual({
      settings: "interface",
    });
    expect(router.state.location.search).toEqual({
      future: "value",
      settings: "interface",
    });
  });

  it.each([
    ["an uninstalled game", "/future-game/catalog"],
    ["a removed legacy combo route", "/mkxl/combos/seeded/scorpion-bnb-001"],
    ["the removed settings page", "/settings"],
    ["the removed settings section query", "/settings?section=backup"],
    ["the removed backup page", "/backup"],
    ["the removed game backup page", "/mkxl/backup"],
  ])("keeps %s inside the shell recovery boundary", async (_case, path) => {
    const { router } = await loadRoute(path);

    expect(router.state.matches.at(-1)?.fullPath).toBe("/$");
    expect(router.state.matches.at(-1)?.status).toBe("success");
    expect(router.state.matches.some((match) => match.routeId === "/_app")).toBe(true);
  });

  it("rejects an unknown settings modal value inside the shell boundary", async () => {
    const { router } = await loadRoute("/mkxl/catalog?settings=unknown");

    expect(router.state.location.pathname).toBe("/mkxl/catalog");
    expect(router.state.matches.some((match) => match.status === "error")).toBe(true);
    expect(router.state.matches.some((match) => match.routeId === "/_app")).toBe(true);
  });

  it("matches unknown paths with the shell-contained catch-all", async () => {
    const { router } = await loadRoute("/not/a/real/route");

    expect(router.state.matches.at(-1)?.fullPath).toBe("/$");
    expect(router.state.matches.at(-1)?.status).toBe("success");
  });
});
