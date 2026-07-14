import { createMemoryHistory, type RouterHistory } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { getRouter } from "./router";
import { SettingsSearchSchema } from "./routing/settings-search/schema";

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
    ["/settings", "/settings"],
    ["/mkxl/catalog", "/$gameId/catalog"],
    ["/mkxl/lists", "/$gameId/lists"],
    ["/mkxl/builder", "/$gameId/builder"],
    ["/mk1/catalog", "/$gameId/catalog"],
    ["/mk1/lists", "/$gameId/lists"],
    ["/mk1/builder", "/$gameId/builder"],
    ["/mkxl/combos/seeded/scorpion-bnb-001", "/$gameId/combos/$source/$comboId"],
    ["/mkxl/combos/custom/local-1729", "/$gameId/combos/$source/$comboId"],
    ["/mk1/combos/seeded/li-mei-bnb-001", "/$gameId/combos/$source/$comboId"],
    ["/mk1/combos/custom/local-2048", "/$gameId/combos/$source/$comboId"],
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
    expect(router.state.matches.at(-1)?.fullPath).toBe("/$gameId/catalog");
    expect(router.state.matches.at(-1)?.params).toMatchObject({ gameId });
    expectReplace(history);
  });

  it("replace-redirects the deprecated backup URL to its settings section", async () => {
    const { history, router } = await loadRoute("/backup");

    expect(router.state.location.pathname).toBe("/settings");
    expect(router.state.location.search).toEqual({ section: "backup" });
    expect(router.state.matches.at(-1)?.fullPath).toBe("/settings");
    expectReplace(history);
  });

  it("strips unrelated settings keys after validating the known optional section", async () => {
    const { router } = await loadRoute("/settings?section=backup&future=value");
    const settingsMatch = router.state.matches.at(-1);

    expect(settingsMatch?.status).toBe("success");
    expect(SettingsSearchSchema.parse(settingsMatch?.search)).toEqual({ section: "backup" });
  });

  it.each([
    ["an uninstalled game", "/future-game/catalog"],
    ["an unsupported combo source", "/mkxl/combos/shared/scorpion-bnb-001"],
  ])("keeps %s inside the shell recovery boundary", async (_case, path) => {
    const { router } = await loadRoute(path);

    expect(router.state.matches.at(-1)?.fullPath).toBe("/$");
    expect(router.state.matches.at(-1)?.status).toBe("success");
    expect(router.state.matches.some((match) => match.routeId === "/_app")).toBe(true);
  });

  it("rejects an unknown settings section inside the shell boundary", async () => {
    const { router } = await loadRoute("/settings?section=unknown");

    expect(router.state.matches.at(-1)?.fullPath).toBe("/settings");
    expect(router.state.matches.at(-1)?.status).toBe("error");
    expect(router.state.matches.some((match) => match.routeId === "/_app")).toBe(true);
  });

  it("matches unknown paths with the shell-contained catch-all", async () => {
    const { router } = await loadRoute("/not/a/real/route");

    expect(router.state.matches.at(-1)?.fullPath).toBe("/$");
    expect(router.state.matches.at(-1)?.status).toBe("success");
  });
});
