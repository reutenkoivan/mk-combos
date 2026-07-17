import type { AppSettings } from "@mk-combos/contracts/settings/type";
import {
  languageCodes,
  notationDisplayModes,
  themePreferences,
} from "@mk-combos/contracts/settings/value";
import {
  act,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from "@mk-combos/contracts/test/unit/react";
import { uiResponsiveModes } from "@mk-combos/ui/components/value";
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PersistedLocalStateSchema } from "./app/local-state/schema";
import { localStateStorageKey, localStateStorageVersion } from "./app/local-state/value";
import { installedGames } from "./game-business/installed-games/value";
import { getRouter } from "./router";

vi.mock("./styles.css?url", () => ({ default: "/styles.css" }));

const originalMatchMedia = globalThis.window.matchMedia;
const originalScrollIntoView = globalThis.HTMLElement.prototype.scrollIntoView;
const originalGetGamepadsDescriptor = Object.getOwnPropertyDescriptor(
  globalThis.window.navigator,
  "getGamepads",
);
const originalRequestAnimationFrameDescriptor = Object.getOwnPropertyDescriptor(
  globalThis.window,
  "requestAnimationFrame",
);
const originalCancelAnimationFrameDescriptor = Object.getOwnPropertyDescriptor(
  globalThis.window,
  "cancelAnimationFrame",
);

const neutralGamepad = {
  axes: [0, 0, 0, 0],
  buttons: Array.from({ length: 17 }, () => ({ pressed: false, touched: false, value: 0 })),
  connected: true,
  id: "Standard Controller",
  index: 0,
  mapping: "standard",
  timestamp: 0,
};
const gesturingGamepad = {
  ...neutralGamepad,
  buttons: neutralGamepad.buttons.map((button, index) =>
    index === 0 ? { ...button, pressed: true, touched: true, value: 1 } : button,
  ),
};

function gamepadWithPressedButton(buttonIndex: number) {
  return {
    ...neutralGamepad,
    buttons: neutralGamepad.buttons.map((button, index) =>
      index === buttonIndex ? { ...button, pressed: true, touched: true, value: 1 } : button,
    ),
  };
}

function installControllerPolling(initialGamepads: readonly (typeof neutralGamepad)[] = []) {
  let gamepads = initialGamepads;
  let nextHandle = 0;
  const callbacks = new Map<number, FrameRequestCallback>();

  Object.defineProperty(globalThis.window.navigator, "getGamepads", {
    configurable: true,
    value: () => gamepads,
  });
  Object.defineProperty(globalThis.window, "requestAnimationFrame", {
    configurable: true,
    value: (callback: FrameRequestCallback) => {
      nextHandle += 1;
      callbacks.set(nextHandle, callback);
      return nextHandle;
    },
  });
  Object.defineProperty(globalThis.window, "cancelAnimationFrame", {
    configurable: true,
    value: (handle: number) => callbacks.delete(handle),
  });

  return {
    flush(timestamp: number) {
      const pending = Array.from(callbacks.values());
      callbacks.clear();
      act(() => {
        for (const callback of pending) {
          callback(timestamp);
        }
      });
    },
    setGamepads(nextGamepads: readonly (typeof neutralGamepad)[]) {
      gamepads = nextGamepads;
    },
  };
}

function pressControllerButton(
  controller: ReturnType<typeof installControllerPolling>,
  buttonIndex: number,
  timestamp: number,
) {
  controller.setGamepads([gamepadWithPressedButton(buttonIndex)]);
  controller.flush(timestamp);
  controller.setGamepads([neutralGamepad]);
  controller.flush(timestamp + 1);
}

function installResponsiveMode(mode: "desktop" | "mobile" | "tablet") {
  Object.defineProperty(globalThis.window, "matchMedia", {
    configurable: true,
    value: vi.fn((query: string) => ({
      addEventListener: vi.fn(),
      matches:
        query === "(min-width: 70rem)"
          ? mode === uiResponsiveModes.desktop
          : mode === uiResponsiveModes.desktop || mode === uiResponsiveModes.tablet,
      media: query,
      removeEventListener: vi.fn(),
    })),
  });
}

async function renderRoute(
  path: string,
  mode: "desktop" | "mobile" | "tablet" = "desktop",
  completed = true,
  settingsOverride: Partial<AppSettings> = {},
  gameSlicesOverride: Readonly<Record<string, unknown>> = {},
) {
  globalThis.window.localStorage.clear();

  if (completed) {
    const games = Object.fromEntries(
      installedGames.map((business) => [
        business.id,
        gameSlicesOverride[business.id] ?? business.backup.createEmptySlice(),
      ]),
    );

    globalThis.window.localStorage.setItem(
      localStateStorageKey,
      JSON.stringify(
        PersistedLocalStateSchema.parse({
          firstLaunchCompleted: true,
          state: {
            games,
            settings: {
              defaultGameId: installedGames[0].id,
              language: languageCodes.EN,
              lastActiveGameId: installedGames[0].id,
              notationDisplayMode: notationDisplayModes.FGC,
              themePreference: themePreferences.system,
              ...settingsOverride,
            },
          },
          version: localStateStorageVersion,
        }),
      ),
    );
  }
  installResponsiveMode(mode);
  const history = createMemoryHistory({
    initialEntries: [path],
  });
  const router = getRouter({ history });

  await router.load();
  const view = render(<RouterProvider router={router} />, {
    baseElement: document,
    container: document,
  });
  await act(async () => {
    await router.load();
  });

  return { history, router, ...view };
}

async function selectGame(label: "MK1" | "MKXL") {
  fireEvent.click(screen.getByRole("button", { name: "Choose game" }));
  fireEvent.click(await screen.findByRole("menuitem", { name: label }));
}

function readPersistedLocalState() {
  const stored = globalThis.window.localStorage.getItem(localStateStorageKey);

  if (stored === null) {
    throw new Error("Expected persisted local state.");
  }

  return PersistedLocalStateSchema.parse(JSON.parse(stored));
}

function expectCatalogGameLabel(label: "MK1" | "MKXL") {
  const page = document.querySelector('[data-ui-page="UI-PAGE-003"]');

  expect(page?.textContent).toContain(label);
}

function expectActiveGame(gameId: "mk1" | "mkxl") {
  expect(
    document.querySelector('[data-ui-page="UI-PAGE-001"]')?.getAttribute("data-active-game"),
  ).toBe(gameId);
}

afterEach(() => {
  globalThis.window.localStorage.clear();
  Object.defineProperty(globalThis.window, "matchMedia", {
    configurable: true,
    value: originalMatchMedia,
  });

  if (originalScrollIntoView) {
    Object.defineProperty(globalThis.HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: originalScrollIntoView,
      writable: true,
    });
  } else {
    Reflect.deleteProperty(globalThis.HTMLElement.prototype, "scrollIntoView");
  }

  if (originalGetGamepadsDescriptor) {
    Object.defineProperty(
      globalThis.window.navigator,
      "getGamepads",
      originalGetGamepadsDescriptor,
    );
  } else {
    Reflect.deleteProperty(globalThis.window.navigator, "getGamepads");
  }

  if (originalRequestAnimationFrameDescriptor) {
    Object.defineProperty(
      globalThis.window,
      "requestAnimationFrame",
      originalRequestAnimationFrameDescriptor,
    );
  } else {
    Reflect.deleteProperty(globalThis.window, "requestAnimationFrame");
  }

  if (originalCancelAnimationFrameDescriptor) {
    Object.defineProperty(
      globalThis.window,
      "cancelAnimationFrame",
      originalCancelAnimationFrameDescriptor,
    );
  } else {
    Reflect.deleteProperty(globalThis.window, "cancelAnimationFrame");
  }
});

describe("AppShell route integration", () => {
  it("keeps a fresh root on explicit first launch with shell navigation disabled", async () => {
    const { router } = await renderRoute("/", "desktop", false);

    expect(router.state.location.pathname).toBe("/");
    expect(await screen.findByRole("heading", { name: "Set up MK Combos" })).toBeTruthy();
    expect(
      (screen.getByRole("button", { name: "Choose game" }) as HTMLButtonElement).disabled,
    ).toBe(true);
    expect(
      (screen.getByRole("button", { name: "Open global menu" }) as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it("completes First Launch by controller and previews draft notation in the shell ribbon", async () => {
    const controller = installControllerPolling([gesturingGamepad]);
    const { container, router } = await renderRoute("/", "desktop", false);

    controller.setGamepads([neutralGamepad]);
    controller.flush(0);
    await waitFor(() =>
      expect(container.querySelector("[data-app-shell-controller-ribbon]")).toBeTruthy(),
    );
    expect(container.querySelector('[data-ui-notation-icon="notation-fgc-3"]')).toBeTruthy();
    expect(
      container.querySelector("[data-app-shell-controller-ribbon]")?.textContent,
    ).not.toContain("Open global menu");

    pressControllerButton(controller, 13, 10);
    pressControllerButton(controller, 13, 20);
    pressControllerButton(controller, 15, 30);
    pressControllerButton(controller, 0, 40);
    await waitFor(() =>
      expect(
        container.querySelector('[data-ui-notation-icon="notation-playstation-cross"]'),
      ).toBeTruthy(),
    );
    expect(container.querySelector('[data-ui-notation-icon="notation-fgc-3"]')).toBeNull();

    pressControllerButton(controller, 13, 50);
    pressControllerButton(controller, 0, 60);
    await waitFor(() => expect(router.state.location.pathname).toBe("/mkxl/catalog"));
  });

  it("bypasses first launch for a valid game deep link and persists URL-derived defaults", async () => {
    const { router } = await renderRoute("/mk1/catalog", "desktop", false);

    await waitFor(() => expect(router.state.location.pathname).toBe("/mk1/catalog"));
    expect(await screen.findByRole("heading", { name: "Choose a fighter" })).toBeTruthy();
    await waitFor(() => {
      const persisted = readPersistedLocalState();

      expect(persisted.firstLaunchCompleted).toBe(true);
      expect(persisted.state.settings.defaultGameId).toBe("mk1");
      expect(persisted.state.settings.lastActiveGameId).toBe("mk1");
    });
  });

  it.each([
    "/settings",
    "/backup",
  ])("does not let the removed %s route bypass first launch", async (path) => {
    const { router } = await renderRoute(path, "desktop", false);

    await waitFor(() => expect(router.state.location.pathname).toBe("/"));
    expect(await screen.findByRole("heading", { name: "Set up MK Combos" })).toBeTruthy();
  });

  it("redirects a completed root to the resolved game catalog", async () => {
    const { router } = await renderRoute("/");

    await waitFor(() => expect(router.state.location.pathname).toBe("/mkxl/catalog"));
    expect(await screen.findByRole("heading", { name: "Choose a fighter" })).toBeTruthy();
  });

  it("prefers a valid last-active game over a different configured default", async () => {
    const { router } = await renderRoute("/", "desktop", true, {
      defaultGameId: "mkxl",
      lastActiveGameId: "mk1",
    });

    await waitFor(() => expect(router.state.location.pathname).toBe("/mk1/catalog"));
    await screen.findByRole("heading", { name: "Choose a fighter" });
    expectCatalogGameLabel("MK1");
    expect(readPersistedLocalState().state.settings.defaultGameId).toBe("mkxl");
  });

  it("lets the route game win while preserving the configured default game", async () => {
    await renderRoute("/mk1/catalog");

    await waitFor(() => {
      const settings = readPersistedLocalState().state.settings;

      expect(settings.defaultGameId).toBe("mkxl");
      expect(settings.lastActiveGameId).toBe("mk1");
    });
  });

  it("opens, switches, and closes Settings without replacing the working route or its search", async () => {
    const workingPath = "/mkxl/catalog/scorpion/ninjutsu";
    const { history, router } = await renderRoute(`${workingPath}?position=%5B%22midscreen%22%5D`);

    fireEvent.click(screen.getByRole("button", { name: "Open global menu" }));
    fireEvent.click(await screen.findByRole("menuitem", { name: "Settings" }));
    expect(await screen.findByRole("dialog", { name: "Settings" })).toBeTruthy();
    await waitFor(() =>
      expect(router.state.location.search).toEqual({
        position: ["midscreen"],
        settings: "interface",
      }),
    );
    expect(router.state.location.pathname).toBe(workingPath);
    expect(history.length).toBe(2);
    expect(screen.getByRole("tab", { name: "Interface" }).getAttribute("aria-selected")).toBe(
      "true",
    );

    fireEvent.click(screen.getByRole("tab", { name: "Game backups" }));
    await waitFor(() =>
      expect(router.state.location.search).toEqual({
        position: ["midscreen"],
        settings: "backup",
      }),
    );
    expect(router.state.location.pathname).toBe(workingPath);
    expect(history.length).toBe(2);
    expect(screen.getByRole("tab", { name: "Game backups" }).getAttribute("aria-selected")).toBe(
      "true",
    );

    fireEvent.click(screen.getByRole("button", { name: "Close settings" }));
    await waitFor(() => expect(router.state.location.search).toEqual({ position: ["midscreen"] }));
    expect(router.state.location.pathname).toBe(workingPath);
    expect(history.canGoBack()).toBe(false);
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Settings" })).toBeNull());
  });

  it("uses browser history to dismiss and restore Settings over a nested working route", async () => {
    const detailPath = "/mkxl/catalog/kotal-kahn/war-god/kotal-kahn-war-god-starter-001";
    const { history, router } = await renderRoute(detailPath);

    fireEvent.click(screen.getByRole("button", { name: "Open global menu" }));
    fireEvent.click(await screen.findByRole("menuitem", { name: "Settings" }));
    expect(await screen.findByRole("dialog", { name: "Settings" })).toBeTruthy();
    await waitFor(() => expect(router.state.location.search).toEqual({ settings: "interface" }));
    expect(router.state.location.pathname).toBe(detailPath);

    await act(async () => history.back());
    await waitFor(() => expect(router.state.location.search).toEqual({}));
    expect(router.state.location.pathname).toBe(detailPath);
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Settings" })).toBeNull());

    await act(async () => history.forward());
    await waitFor(() => expect(router.state.location.search).toEqual({ settings: "interface" }));
    expect(router.state.location.pathname).toBe(detailPath);
    expect(await screen.findByRole("dialog", { name: "Settings" })).toBeTruthy();
  });

  it.each([
    ["/mkxl/catalog", "MKXL", "mkxl"],
    ["/mkxl/catalog/", "MKXL", "mkxl"],
    ["/mk1/catalog", "MK1", "mk1"],
    ["/mk1/catalog/", "MK1", "mk1"],
  ])("provides the exact active business for %s", async (path, label, gameId) => {
    const view = await renderRoute(path);

    expect(screen.getByRole("heading", { name: "Choose a fighter" })).toBeTruthy();
    expect(screen.getByText("Catalog")).toBeTruthy();
    expectCatalogGameLabel(label as "MK1" | "MKXL");
    expect(
      view.container
        .querySelector('[data-ui-page="UI-PAGE-001"]')
        ?.getAttribute("data-active-game"),
    ).toBe(gameId);
  });

  it.each([
    ["/mkxl/catalog", "character-selector", "Choose a fighter"],
    ["/mkxl/catalog/scorpion", "specification-selector", "Choose a variation or kameo"],
    ["/mkxl/catalog/scorpion/ninjutsu", "result", "Combos"],
  ])("renders direct pathname catalog context for %s", async (path, routeKind, heading) => {
    const view = await renderRoute(path);
    const route = view.container.querySelector(`[data-catalog-route="${routeKind}"]`);
    const catalogCanvas =
      routeKind === "result" ? view.container.querySelector("[data-catalog-result-layout]") : route;

    expect(route).toBeTruthy();
    expect(catalogCanvas?.classList.contains("p-2")).toBe(true);
    expect(catalogCanvas?.classList.contains("min-[40rem]:p-3")).toBe(true);
    expect(catalogCanvas?.classList.contains("sm:p-4")).toBe(false);
    expect(screen.getByRole("heading", { name: heading })).toBeTruthy();
  });

  it("keeps shell and catalog chrome in flow while the result list owns scrolling", async () => {
    const view = await renderRoute("/mkxl/catalog/scorpion/ninjutsu");
    const shell = view.container.querySelector('[data-ui-page="UI-PAGE-001"]');
    const outlet = view.container.querySelector("[data-app-shell-outlet]");
    const topBar = view.container.querySelector('[data-ui-component="UI-CMP-001"]');
    const catalogResult = view.container.querySelector('[data-catalog-route="result"]');
    const resultLayout = view.container.querySelector("[data-catalog-result-layout]");
    const fixedChrome = view.container.querySelector("[data-catalog-fixed-chrome]");
    const filterSummary = view.container.querySelector("[data-catalog-filter-summary]");
    const resultScroller = view.container.querySelector("[data-catalog-result-scroller]");
    const commandRibbon = view.container.querySelector("[data-app-shell-controller-ribbon]");
    const comboHeadings = screen.getAllByRole("heading", { name: "Combos" });

    expect(shell?.classList.contains("h-dvh")).toBe(true);
    expect(shell?.classList.contains("overflow-hidden")).toBe(true);
    expect(outlet?.classList.contains("overflow-auto")).toBe(true);
    expect(outlet?.contains(topBar)).toBe(false);
    expect(catalogResult?.classList.contains("h-full")).toBe(true);
    expect(catalogResult?.classList.contains("min-h-0")).toBe(true);
    expect(catalogResult?.classList.contains("overflow-hidden")).toBe(true);
    expect(resultLayout?.classList.contains("h-full")).toBe(true);
    expect(resultLayout?.classList.contains("min-h-0")).toBe(true);
    expect(resultLayout?.classList.contains("overflow-hidden")).toBe(true);
    expect(fixedChrome?.contains(filterSummary)).toBe(true);
    expect(resultScroller?.contains(filterSummary)).toBe(false);
    expect(filterSummary?.classList.contains("border")).toBe(false);
    expect(fixedChrome?.classList.contains("border-b")).toBe(true);
    expect(resultScroller?.classList.contains("overflow-y-auto")).toBe(true);
    expect(resultScroller?.classList.contains("scroll-pb-14")).toBe(false);
    expect(resultScroller?.classList.contains("pb-14")).toBe(false);
    expect(resultScroller?.hasAttribute("data-catalog-command-clearance")).toBe(false);
    expect(resultScroller?.querySelector("[data-combo-local-action]")).toBeNull();
    expect(resultScroller?.querySelector("[data-combo-row-action='open-detail']")).toBeTruthy();
    expect(commandRibbon).toBeNull();
    expect(comboHeadings).toHaveLength(1);
    expect(comboHeadings[0]?.classList.contains("sr-only")).toBe(true);
    expect(screen.queryByText("Combos · Navigate")).toBeNull();
  });

  it.each([
    "/mkxl/lists",
    "/mkxl/builder",
  ])("shows one shell-owned Menu-only ribbon for connected placeholder route %s", async (path) => {
    installControllerPolling([gesturingGamepad]);
    const view = await renderRoute(path);

    await waitFor(() =>
      expect(view.container.querySelectorAll("[data-app-shell-controller-ribbon]")).toHaveLength(1),
    );
    const ribbon = view.container.querySelector("[data-app-shell-controller-ribbon]");
    const outlet = view.container.querySelector("[data-app-shell-outlet]");

    expect(ribbon?.querySelectorAll("li")).toHaveLength(1);
    expect(ribbon?.textContent).toContain("Open global menu");
    expect(outlet?.contains(ribbon)).toBe(false);
    expect(view.container.querySelector("[data-catalog-command-ribbon]")).toBeNull();
  });

  it.each([
    "/mkxl/catalog",
    "/mkxl/catalog/scorpion",
    "/mkxl/catalog/scorpion/ninjutsu",
    "/mkxl/catalog/kotal-kahn/war-god/kotal-kahn-war-god-starter-001",
    "/not/a/real/route",
  ])("renders one in-flow shell ribbon with Menu last for connected route %s", async (path) => {
    installControllerPolling([gesturingGamepad]);
    const view = await renderRoute(path);

    await waitFor(() =>
      expect(view.container.querySelectorAll("[data-app-shell-controller-ribbon]")).toHaveLength(1),
    );
    const ribbon = view.container.querySelector("[data-app-shell-controller-ribbon]");
    const outlet = view.container.querySelector("[data-app-shell-outlet]");
    const commands = ribbon?.querySelectorAll("li");

    expect(commands && commands.length > 1).toBe(true);
    expect(commands?.item((commands?.length ?? 1) - 1).textContent).toContain("Open global menu");
    expect(outlet?.contains(ribbon)).toBe(false);
  });

  it("updates Settings ribbon glyphs immediately from the applied notation setting", async () => {
    installControllerPolling([gesturingGamepad]);
    const view = await renderRoute("/mkxl/catalog?settings=interface");

    await waitFor(() =>
      expect(
        view.container.querySelector(
          '[data-app-shell-controller-ribbon] [data-ui-notation-icon="notation-fgc-3"]',
        ),
      ).toBeTruthy(),
    );

    fireEvent.click(screen.getByRole("button", { name: notationDisplayModes.PlayStation }));

    await waitFor(() =>
      expect(
        view.container.querySelector(
          '[data-app-shell-controller-ribbon] [data-ui-notation-icon="notation-playstation-cross"]',
        ),
      ).toBeTruthy(),
    );
    expect(
      view.container.querySelector(
        '[data-app-shell-controller-ribbon] [data-ui-notation-icon="notation-fgc-3"]',
      ),
    ).toBeNull();
  });

  it("localizes the Recovery action and controller ribbon from applied settings", async () => {
    installControllerPolling([gesturingGamepad]);
    const view = await renderRoute("/not/a/real/route", "desktop", true, {
      language: languageCodes.UA,
    });

    expect(await screen.findByRole("button", { name: "Відкрити каталог MKXL" })).toBeTruthy();
    await waitFor(() =>
      expect(
        view.container.querySelector("[data-app-shell-controller-ribbon]")?.textContent,
      ).toContain("Відкрити каталог MKXL"),
    );
  });

  it("hides the global ribbon on disconnect and restores the same route context", async () => {
    const controller = installControllerPolling([gesturingGamepad]);
    const view = await renderRoute("/mkxl/catalog/scorpion/ninjutsu");

    await waitFor(() =>
      expect(view.container.querySelector("[data-app-shell-controller-ribbon]")).toBeTruthy(),
    );
    const labelsBeforeDisconnect = Array.from(
      view.container.querySelectorAll("[data-app-shell-controller-ribbon] li"),
    ).map((item) => item.textContent);

    controller.setGamepads([]);
    controller.flush(1);
    await waitFor(() =>
      expect(view.container.querySelector("[data-app-shell-controller-ribbon]")).toBeNull(),
    );

    controller.setGamepads([gesturingGamepad]);
    controller.flush(2);
    await waitFor(() =>
      expect(view.container.querySelector("[data-app-shell-controller-ribbon]")).toBeTruthy(),
    );
    expect(
      Array.from(view.container.querySelectorAll("[data-app-shell-controller-ribbon] li")).map(
        (item) => item.textContent,
      ),
    ).toEqual(labelsBeforeDisconnect);
  });

  it("drives the filter drawer and pass-through global Menu using only controller input", async () => {
    const controller = installControllerPolling([gesturingGamepad]);
    const view = await renderRoute("/mkxl/catalog/scorpion/ninjutsu");

    controller.setGamepads([neutralGamepad]);
    controller.flush(0);
    pressControllerButton(controller, 3, 10);

    await waitFor(() => expect(view.container.querySelector("[data-filter-drawer]")).toBeTruthy());
    expect(
      view.container.querySelector("[data-app-shell-controller-ribbon]")?.textContent,
    ).toContain("Discard changes");

    pressControllerButton(controller, 9, 20);
    expect(await screen.findByRole("menuitem", { name: "Named Lists" })).toBeTruthy();
    expect(view.container.querySelector("[data-filter-drawer]")).toBeTruthy();

    pressControllerButton(controller, 1, 30);
    expect(view.container.querySelector("[data-filter-drawer]")).toBeTruthy();
    await waitFor(() => expect(screen.queryByRole("menuitem", { name: "Named Lists" })).toBeNull());
    expect(view.container.querySelector("[data-filter-drawer]")).toBeTruthy();

    pressControllerButton(controller, 9, 40);
    expect(await screen.findByRole("menuitem", { name: "Named Lists" })).toBeTruthy();
    pressControllerButton(controller, 9, 50);
    await waitFor(() => expect(screen.queryByRole("menuitem", { name: "Named Lists" })).toBeNull());
    expect(view.container.querySelector("[data-filter-drawer]")).toBeTruthy();

    pressControllerButton(controller, 3, 60);
    await waitFor(() => expect(view.container.querySelector("[data-filter-drawer]")).toBeNull());
  });

  it.each([
    "/mkxl/catalog/kotal-kahn/war-god/kotal-kahn-war-god-starter-001",
    "/not/a/real/route",
  ])("gives an open shell overlay the only controller focus marker on %s", async (path) => {
    const controller = installControllerPolling([gesturingGamepad]);
    const view = await renderRoute(path);

    controller.setGamepads([neutralGamepad]);
    controller.flush(0);
    await waitFor(() =>
      expect(view.container.querySelectorAll('[data-controller-focused="true"]')).toHaveLength(1),
    );
    const pageMarker = view.container.querySelector<HTMLElement>(
      '[data-app-shell-outlet] [data-controller-focused="true"]',
    );

    expect(pageMarker).toBeTruthy();
    pressControllerButton(controller, 9, 10);
    expect(await screen.findByRole("menu", { name: "Open global menu" })).toBeTruthy();
    await waitFor(() =>
      expect(document.querySelectorAll('[data-controller-focused="true"]')).toHaveLength(1),
    );

    const shellMarker = document.querySelector<HTMLElement>('[data-controller-focused="true"]');
    const outlet = view.container.querySelector("[data-app-shell-outlet]");

    expect(outlet?.getAttribute("data-app-shell-controller-focus-owner")).toBe("shell-overlay");
    expect(outlet?.contains(shellMarker)).toBe(false);
    expect(pageMarker?.dataset.controllerFocused).toBeUndefined();
    await waitFor(() =>
      expect(
        view.container.querySelector("[data-app-shell-controller-ribbon]")?.textContent,
      ).toContain("Close navigation"),
    );

    fireEvent.click(screen.getByRole("button", { name: "Open global menu" }));
    await waitFor(() =>
      expect(screen.queryByRole("menu", { name: "Open global menu" })).toBeNull(),
    );
    await waitFor(() =>
      expect(view.container.querySelectorAll('[data-controller-focused="true"]')).toHaveLength(1),
    );
    expect(outlet?.getAttribute("data-app-shell-controller-focus-owner")).toBe("page");
    expect(pageMarker?.dataset.controllerFocused).toBe("true");
  });

  it("inspects detail steps without advertising or opening an actionless menu", async () => {
    const controller = installControllerPolling([gesturingGamepad]);
    const detailPath = "/mkxl/catalog/kotal-kahn/war-god/kotal-kahn-war-god-starter-001";
    const { container, router } = await renderRoute(detailPath);

    controller.setGamepads([neutralGamepad]);
    controller.flush(0);
    const returnButton = screen.getByRole("button", { name: "Back to catalog" });
    expect(returnButton.dataset.controllerFocused).toBe("true");

    pressControllerButton(controller, 13, 10);
    expect(returnButton.dataset.controllerFocused).toBeUndefined();
    await waitFor(() =>
      expect(
        container.querySelector('[data-ui-combo-whiteboard-step][data-controller-focused="true"]'),
      ).toBeTruthy(),
    );
    expect(returnButton.dataset.controllerFocused).toBeUndefined();

    pressControllerButton(controller, 0, 20);
    expect(router.state.location.pathname).toBe(detailPath);
    expect(container.querySelector("[data-ui-combo-whiteboard-local-menu]")).toBeNull();

    pressControllerButton(controller, 1, 30);
    await waitFor(() =>
      expect(router.state.location.pathname).toBe("/mkxl/catalog/kotal-kahn/war-god"),
    );
  });

  it("opens the fallback Catalog from Recovery with controller Confirm", async () => {
    const controller = installControllerPolling([gesturingGamepad]);
    const { router } = await renderRoute("/not-an-installed-route");

    controller.setGamepads([neutralGamepad]);
    controller.flush(0);
    const recoveryAction = await screen.findByRole("button", { name: "Open MKXL Catalog" });
    expect(recoveryAction.dataset.controllerFocused).toBe("true");

    pressControllerButton(controller, 0, 10);
    await waitFor(() => expect(router.state.location.pathname).toBe("/mkxl/catalog"));
  });

  it("keeps keyboard focus without controller focus or controller-only scrolling", async () => {
    const scrollIntoView = vi.fn();
    Object.defineProperty(globalThis.HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
      writable: true,
    });
    const view = await renderRoute("/mkxl/catalog/scorpion/ninjutsu");
    const resultRowActions = view.container.querySelectorAll<HTMLButtonElement>(
      '[data-catalog-result-scroller] [data-combo-row-action="open-detail"]',
    );
    const secondRowAction = resultRowActions.item(1);
    const secondCard = secondRowAction
      .closest("li")
      ?.querySelector<HTMLElement>('[data-ui-component="UI-CMP-011"]');
    const firstCard = resultRowActions
      .item(0)
      .closest("li")
      ?.querySelector<HTMLElement>('[data-ui-component="UI-CMP-011"]');

    expect(resultRowActions.length).toBeGreaterThan(1);
    expect(firstCard?.getAttribute("data-controller-focused")).toBeNull();
    scrollIntoView.mockClear();
    act(() => secondRowAction.focus());

    expect(document.activeElement).toBe(secondRowAction);
    expect(secondCard?.getAttribute("data-controller-focused")).toBeNull();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it("restores the last catalog target across controller disconnect and reconnect", async () => {
    const controller = installControllerPolling([gesturingGamepad]);
    const scrollIntoView = vi.fn();
    Object.defineProperty(globalThis.HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
      writable: true,
    });
    const view = await renderRoute("/mkxl/catalog/scorpion/ninjutsu");
    const resultRowActions = view.container.querySelectorAll<HTMLButtonElement>(
      '[data-catalog-result-scroller] [data-combo-row-action="open-detail"]',
    );
    const secondRowAction = resultRowActions.item(1);
    const secondCard = secondRowAction
      .closest("li")
      ?.querySelector<HTMLElement>('[data-ui-component="UI-CMP-011"]');

    expect(resultRowActions.length).toBeGreaterThan(1);
    await waitFor(() =>
      expect(
        view.container
          .querySelector(".mk-combos-ui-root")
          ?.getAttribute("data-ui-controller-focus-visible"),
      ).toBe("true"),
    );
    controller.setGamepads([neutralGamepad]);
    controller.flush(0);

    act(() => secondRowAction.focus());
    await waitFor(() => expect(secondCard?.getAttribute("data-controller-focused")).toBe("true"));
    expect(scrollIntoView).toHaveBeenCalledWith({ block: "nearest" });

    controller.setGamepads([]);
    controller.flush(1);
    await waitFor(() => expect(secondCard?.getAttribute("data-controller-focused")).toBeNull());
    expect(document.activeElement).toBe(secondRowAction);

    scrollIntoView.mockClear();
    controller.setGamepads([gesturingGamepad]);
    controller.flush(2);
    await waitFor(() => expect(secondCard?.getAttribute("data-controller-focused")).toBe("true"));
    expect(scrollIntoView).toHaveBeenCalledWith({ block: "nearest" });
  });

  it("does not interpret or migrate legacy query context", async () => {
    const { container, router } = await renderRoute(
      "/mkxl/catalog?character=scorpion&variation=scorpion%3Aninjutsu",
    );

    expect(router.state.location.pathname).toBe("/mkxl/catalog");
    expect(router.state.location.search).toEqual({
      character: "scorpion",
      variation: "scorpion:ninjutsu",
    });
    expect(container.querySelector('[data-catalog-route="character-selector"]')).toBeTruthy();
    expect(container.querySelector('[data-catalog-route="result"]')).toBeNull();
  });

  it("shows fighter guidance once in the selector header", async () => {
    await renderRoute("/mkxl/catalog");

    expect(
      screen.getAllByText("Choose a fighter to see their available team or variation."),
    ).toHaveLength(1);
  });

  it.each([
    "/mkxl/catalog/scorpion",
    "/mk1/catalog/scorpion",
  ])("keeps matchup guidance in the %s header without inline return controls", async (path) => {
    const view = await renderRoute(path);
    const selector = view.container.querySelector('[data-catalog-route="specification-selector"]');
    const header = selector?.querySelector("[data-command-deck-header]");
    const pickerRegion = selector?.querySelector("[data-command-deck-picker-region]");
    const guidance = "Complete the matchup to load its combos.";

    expect(selector).toBeTruthy();
    expect(screen.getAllByText(guidance)).toHaveLength(1);
    expect(header?.textContent).toContain(guidance);
    expect(pickerRegion?.textContent).not.toContain(guidance);
    expect(within(selector as HTMLElement).getByText("Selected fighter: Scorpion")).toBeTruthy();
    expect(
      within(selector as HTMLElement).queryByRole("button", { name: "Back to fighters" }),
    ).toBeNull();
  });

  it("does not overwrite the last valid catalog when result search is unknown-only", async () => {
    const mkxl = installedGames[0];
    const filters = mkxl.catalog.parseFilterQuery({ position: ["midscreen"] });
    const context = mkxl.catalog.recoverContext(
      { characterId: "scorpion", variationId: "scorpion:ninjutsu" },
      filters.filters,
    );
    const saved = mkxl.catalog.saveLastCatalog({
      context: context.context,
      filters: context.filters,
      slice: mkxl.backup.createEmptySlice(),
    });

    expect(saved.ok).toBe(true);
    if (!saved.ok) {
      return;
    }

    const { router } = await renderRoute(
      "/mkxl/catalog/scorpion/ninjutsu?future=value",
      "desktop",
      true,
      {},
      { mkxl: saved.value },
    );

    await waitFor(() => expect(router.state.location.search).toEqual({}));
    const restored = mkxl.catalog.restoreLastCatalog(readPersistedLocalState().state.games.mkxl);
    expect(restored.ok).toBe(true);
    if (!restored.ok) {
      return;
    }
    expect(mkxl.catalog.serializeFilterQuery(restored.value.filters)).toEqual({
      position: ["midscreen"],
    });
  });

  it.each([
    ["/mkxl/catalog/missing-fighter", "catalog-invalid-character"],
    ["/mkxl/catalog/scorpion/missing-variation", "catalog-invalid-specification"],
  ])("keeps invalid pathname context recoverable for %s", async (path, errorToken) => {
    const view = await renderRoute(path);

    expect(view.container.querySelector(`[data-error-token="${errorToken}"]`)).toBeTruthy();
    expect(screen.getByRole("button", { name: /fighters|variation or kameo/iu })).toBeTruthy();
  });

  it.each([
    ["mkxl", /Ninjutsu: Combos:/u, "/mkxl/catalog/scorpion/ninjutsu"],
    ["mk1", /Cyrax: Combos:/u, "/mk1/catalog/scorpion/cyrax"],
  ])("pushes %s fighter context, replaces specification context, and honors browser Back", async (gameId, specificationName, resultPath) => {
    const rootPath = `/${gameId}/catalog`;
    const { history, router } = await renderRoute(rootPath);

    fireEvent.click(screen.getByRole("button", { name: /Scorpion: Combos:/u }));
    await waitFor(() => expect(router.state.location.pathname).toBe(`${rootPath}/scorpion`));
    fireEvent.click(await screen.findByRole("button", { name: specificationName }));
    await waitFor(() => expect(router.state.location.pathname).toBe(resultPath));
    expect(history.length).toBe(2);

    await act(async () => history.back());
    await waitFor(() => expect(router.state.location.pathname).toBe(rootPath));
  });

  it.each([
    ["/mkxl/catalog/scorpion", "/mkxl/catalog"],
    ["/mk1/catalog/scorpion", "/mk1/catalog"],
  ])("returns from the %s selector through controller Back", async (path, rootPath) => {
    const controller = installControllerPolling([gesturingGamepad]);
    const { router } = await renderRoute(path);

    controller.setGamepads([neutralGamepad]);
    controller.flush(0);
    pressControllerButton(controller, 1, 10);

    await waitFor(() => expect(router.state.location.pathname).toBe(rootPath));
  });

  it("opens the modal filter drawer over pathname-context results", async () => {
    const view = await renderRoute("/mkxl/catalog/scorpion/ninjutsu");

    expect(view.container.querySelector('[data-catalog-route="result"]')).toBeTruthy();
    expect(view.container.querySelector("[data-catalog-context-rail]")).toBeNull();
    expect(view.container.querySelector("[data-catalog-filter-summary]")).toBeTruthy();
    expect(view.container.querySelector("[data-catalog-command-ribbon]")).toBeNull();
    expect(screen.getByRole("button", { name: "Filters" }).getAttribute("aria-expanded")).toBe(
      "false",
    );
    fireEvent.click(screen.getByRole("button", { name: "Filters" }));
    const filterDrawer = view.container.querySelector("[data-filter-drawer]");
    const resultScroller = view.container.querySelector("[data-catalog-result-scroller]");

    expect(filterDrawer).toBeTruthy();
    expect(screen.getByRole("dialog", { name: "Filters" })).toBe(filterDrawer);
    expect(resultScroller?.hasAttribute("inert")).toBe(true);
    expect(view.container.querySelector("[data-catalog-command-ribbon]")).toBeNull();
    expect(view.container.querySelector("#catalog-combos-title")?.textContent).toBe("Combos");
    await waitFor(() => expect(document.activeElement).toBe(filterDrawer));

    expect(screen.getAllByRole("button", { name: "Discard changes" })).toHaveLength(1);
    expect(view.container.querySelector("[data-catalog-filter-summary]")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Discard changes" }));
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole("button", { name: "Filters" })),
    );
  });

  it("preselects the saved fighter without navigating until explicit confirmation", async () => {
    const mk1 = installedGames.find(
      (business): business is (typeof installedGames)[1] => business.id === "mk1",
    );

    if (!mk1) {
      throw new Error("MK1 business should be installed.");
    }

    const generalShao = mk1.catalog.selectCharacter("general-shao");
    const saved = mk1.catalog.saveLastCatalog({
      context: generalShao.context,
      filters: generalShao.filters,
      slice: mk1.backup.createEmptySlice(),
    });

    if (!saved.ok) {
      throw new Error("MK1 last catalog should be saved.");
    }

    const { router } = await renderRoute(
      "/mk1/catalog",
      "tablet",
      true,
      {},
      {
        mk1: saved.value,
      },
    );

    await waitFor(() => expect(router.state.location.pathname).toBe("/mk1/catalog"));
    expect(router.state.location.search).toEqual({});
    expect(
      screen.getByRole("button", { name: /General Shao: Combos:/u }).getAttribute("aria-pressed"),
    ).toBe("true");

    const scorpion = screen.getByRole("button", { name: /Scorpion: Combos:/u });
    await waitFor(() => expect((scorpion as HTMLButtonElement).disabled).toBe(false));
    fireEvent.click(scorpion);
    await waitFor(() => expect(router.state.location.pathname).toBe("/mk1/catalog/scorpion"));
    expect(router.state.location.search).toEqual({});
    const cyrax = await screen.findByRole("button", { name: /Cyrax: Combos:/u });
    await waitFor(() => expect((cyrax as HTMLButtonElement).disabled).toBe(false));
    fireEvent.click(cyrax);

    await waitFor(() => expect(router.state.location.pathname).toBe("/mk1/catalog/scorpion/cyrax"));
    expect(router.state.location.search).toEqual({});
  });

  it("discards filter drafts and commits them only on Apply", async () => {
    const { container, router } = await renderRoute("/mkxl/catalog/scorpion/ninjutsu");

    fireEvent.click(screen.getByRole("button", { name: "Filters" }));
    const midscreen = screen.getByRole("button", { name: /Midscreen: Combos:/u });
    fireEvent.click(midscreen);
    expect(midscreen.getAttribute("aria-pressed")).toBe("true");
    expect(router.state.location.search).toEqual({});

    fireEvent.click(screen.getByRole("button", { name: "Discard changes" }));
    expect(container.querySelector("[data-filter-drawer]")).toBeNull();
    expect(router.state.location.search).toEqual({});

    fireEvent.click(screen.getByRole("button", { name: "Filters" }));
    const restoredDraft = screen.getByRole("button", { name: /Midscreen: Combos:/u });
    expect(restoredDraft.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(restoredDraft);
    fireEvent.click(screen.getByRole("button", { name: "Apply filters" }));

    await waitFor(() => expect(router.state.location.search).toEqual({ position: ["midscreen"] }));
    await waitFor(() => expect(container.querySelector("[data-filter-drawer]")).toBeNull());
  });

  it("reveals dependent Interactables after keyboard Arena selection and clears the cascade", async () => {
    const user = userEvent.setup();
    const { router } = await renderRoute("/mkxl/catalog/alien/tarkatan");
    const filterTrigger = screen.getByRole("button", { name: "Filters" });

    filterTrigger.focus();
    await user.keyboard("{Enter}");

    expect(screen.getByRole("group", { name: "Arena" })).toBeTruthy();
    expect(screen.queryByRole("group", { name: "Interactables" })).toBeNull();
    const crossroads = screen.getByRole("button", { name: "Crossroads: Combos: 1" });
    crossroads.focus();
    await user.keyboard("{Enter}");

    const interactables = await screen.findByRole("group", { name: "Interactables" });
    const positionEscape = within(interactables).getByRole("button", {
      name: "Crossroads position escape: Combos: 1",
    });
    expect(crossroads.getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(positionEscape);
    expect(positionEscape.getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(crossroads);
    await waitFor(() => expect(screen.queryByRole("group", { name: "Interactables" })).toBeNull());
    expect(crossroads.getAttribute("aria-pressed")).toBe("false");
    expect(router.state.location.search).toEqual({});
  });

  it("navigates the Arena to Interactables cascade with controller input", async () => {
    const controller = installControllerPolling([gesturingGamepad]);
    await renderRoute("/mkxl/catalog/alien/tarkatan");

    controller.setGamepads([neutralGamepad]);
    controller.flush(0);
    pressControllerButton(controller, 3, 10);
    await waitFor(() => expect(screen.getByRole("group", { name: "Arena" })).toBeTruthy());

    for (const timestamp of [20, 30, 40, 50, 60]) {
      pressControllerButton(controller, 13, timestamp);
    }

    const crossroads = screen.getByRole("button", { name: "Crossroads: Combos: 1" });
    await waitFor(() => expect(crossroads.dataset.controllerFocused).toBe("true"));
    pressControllerButton(controller, 0, 70);

    const positionEscape = await screen.findByRole("button", {
      name: "Crossroads position escape: Combos: 1",
    });
    expect(crossroads.getAttribute("aria-pressed")).toBe("true");
    pressControllerButton(controller, 13, 80);
    await waitFor(() => expect(positionEscape.dataset.controllerFocused).toBe("true"));
    pressControllerButton(controller, 0, 90);
    expect(positionEscape.getAttribute("aria-pressed")).toBe("true");

    pressControllerButton(controller, 12, 100);
    await waitFor(() => expect(crossroads.dataset.controllerFocused).toBe("true"));
    pressControllerButton(controller, 0, 110);
    await waitFor(() => expect(screen.queryByRole("group", { name: "Interactables" })).toBeNull());
  });

  it("removes exact applied choice badges without clearing unrelated URL filters", async () => {
    const { router } = await renderRoute(
      "/mkxl/catalog/scorpion/ninjutsu?difficulty=%5B%22easy%22%5D&position=%5B%22midscreen%22%5D",
    );

    await waitFor(() =>
      expect(router.state.location.search).toEqual({
        difficulty: ["easy"],
        position: ["midscreen"],
      }),
    );
    const removeMidscreen = await screen.findByRole("button", {
      name: "Remove filter “Position: Center”",
    });
    const removeDifficulty = screen.getByRole("button", {
      name: "Remove filter “Difficulty: Easy”",
    });
    await waitFor(() => expect((removeMidscreen as HTMLButtonElement).disabled).toBe(false));
    expect((removeDifficulty as HTMLButtonElement).disabled).toBe(false);

    fireEvent.click(removeMidscreen);

    await waitFor(() =>
      expect(router.state.location.search).toEqual({
        difficulty: ["easy"],
      }),
    );
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: "Remove filter “Position: Center”" })).toBeNull(),
    );
    const remainingRemoveDifficulty = screen.getByRole("button", {
      name: "Remove filter “Difficulty: Easy”",
    });
    await waitFor(() =>
      expect((remainingRemoveDifficulty as HTMLButtonElement).disabled).toBe(false),
    );

    fireEvent.click(remainingRemoveDifficulty);

    await waitFor(() => expect(router.state.location.search).toEqual({}));
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: "Remove filter “Difficulty: Easy”" })).toBeNull(),
    );
  });

  it("keeps the live draft preview inert and does not commit before Apply", async () => {
    const { container, router } = await renderRoute("/mkxl/catalog/scorpion/ninjutsu");

    fireEvent.click(screen.getByRole("button", { name: "Filters" }));
    const resultScroller = container.querySelector("[data-catalog-result-scroller]");

    expect(resultScroller?.hasAttribute("inert")).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: /Midscreen: Combos:/u }));
    const draftRowAction = resultScroller?.querySelector<HTMLButtonElement>(
      '[data-combo-row-action="open-detail"]',
    );

    expect(draftRowAction).toBeTruthy();
    expect(
      draftRowAction
        ?.closest("li")
        ?.querySelector('[data-ui-component="UI-CMP-011"]')
        ?.getAttribute("data-combo-presentation"),
    ).toBe("commandDeck");
    fireEvent.click(draftRowAction as HTMLButtonElement);

    expect(router.state.location.pathname).toBe("/mkxl/catalog/scorpion/ninjutsu");
    expect(router.state.location.search).toEqual({});
  });

  it("returns combo detail to the persisted pathname catalog context", async () => {
    const mkxl = installedGames[0];
    const selectedCharacter = mkxl.catalog.selectCharacter("scorpion");
    const ready = mkxl.catalog.selectVariation(
      selectedCharacter.context,
      "scorpion:ninjutsu",
      selectedCharacter.filters,
    );
    const summary = mkxl.catalog.selectSeededSummaries({
      context: ready.context,
      filters: ready.filters,
    })[0];
    const saved = mkxl.catalog.saveLastCatalog({
      context: ready.context,
      filters: ready.filters,
      slice: mkxl.backup.createEmptySlice(),
    });

    expect(summary).toBeDefined();
    expect(saved.ok).toBe(true);
    if (!summary || !saved.ok) {
      return;
    }

    const { router } = await renderRoute(
      `/mkxl/catalog/scorpion/ninjutsu/${summary.ref.comboId}`,
      "desktop",
      true,
      {},
      { mkxl: saved.value },
    );

    fireEvent.click(await screen.findByRole("button", { name: "Back to catalog" }));
    await waitFor(() =>
      expect(router.state.location.pathname).toBe("/mkxl/catalog/scorpion/ninjutsu"),
    );
    expect(router.state.location.search).toEqual({});
  });

  it("resolves a custom combo from the source-neutral nested detail path", async () => {
    const mkxl = installedGames[0];
    const summary = mkxl.catalog.getSeededSummary("kotal-kahn-war-god-starter-001");

    expect(summary).toBeDefined();
    if (!summary) {
      return;
    }

    const customCombo = {
      cachedNotation: summary.cachedNotation,
      characterId: summary.character.id,
      createdAt: "2026-07-16T00:00:00.000Z",
      gameId: "mkxl",
      gameVersion: summary.gameVersion,
      id: "local-kotal-war-god-route",
      metadata: summary.metadata,
      movePath: summary.movePath,
      source: "custom",
      stageContext: summary.stageContext,
      updatedAt: "2026-07-16T00:00:00.000Z",
      variationId: summary.variation.id,
    } as const;
    const detailPath = `/mkxl/catalog/kotal-kahn/war-god/${customCombo.id}`;
    const { router } = await renderRoute(
      detailPath,
      "desktop",
      true,
      {},
      {
        mkxl: {
          ...mkxl.backup.createEmptySlice(),
          customCombos: [customCombo],
        },
      },
    );

    expect(await screen.findByRole("heading", { level: 1 })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Combo unavailable" })).toBeNull();
    expect(router.state.location.pathname).toBe(detailPath);
    expect(router.state.location.search).toEqual({});
  });

  it.each([
    ["/mkxl/catalog", ["Catalog"], "Catalog"],
    ["/mkxl/catalog/scorpion", ["Catalog", "Scorpion"], "Scorpion"],
    ["/mkxl/catalog/scorpion/ninjutsu", ["Catalog", "Scorpion", "Ninjutsu"], "Ninjutsu"],
    ["/mk1/catalog/scorpion/cyrax", ["Catalog", "Scorpion", "Cyrax"], "Cyrax"],
    ["/mkxl/lists", ["Catalog", "Named Lists"], "Named Lists"],
    ["/mkxl/builder", ["Catalog", "Builder"], "Builder"],
    [
      "/mkxl/catalog/kotal-kahn/war-god/kotal-kahn-war-god-starter-001",
      ["Catalog", "Kotal Kahn", "War God", "kotal-kahn-war-god-starter-001"],
      "kotal-kahn-war-god-starter-001",
    ],
    [
      "/mk1/catalog/scorpion/cyrax/scorpion-cyrax-seed-001",
      ["Catalog", "Scorpion", "Cyrax", "scorpion-cyrax-seed-001"],
      "scorpion-cyrax-seed-001",
    ],
  ])("prepares desktop breadcrumbs for %s", async (path, expectedLabels, currentLabel) => {
    await renderRoute(path);
    const breadcrumbs = screen.getByRole("navigation", { name: "Breadcrumbs" });
    const crumbLabels = Array.from(
      breadcrumbs.querySelectorAll<HTMLElement>("[data-breadcrumb-label]"),
    ).map((item) => item.textContent?.trim());
    const separators = Array.from(
      breadcrumbs.querySelectorAll<HTMLElement>("[data-breadcrumb-separator]"),
    );

    expect(within(breadcrumbs).getByRole("button", { name: "Choose game" })).toBeTruthy();
    expect(crumbLabels).toEqual(expectedLabels);
    expect(separators).toHaveLength(expectedLabels.length);
    expect(separators.every((separator) => separator.textContent?.trim() === "/")).toBe(true);
    expect(separators.every((separator) => separator.getAttribute("aria-hidden") === "true")).toBe(
      true,
    );
    const currentCrumb = within(breadcrumbs)
      .getByText(currentLabel)
      .closest('[aria-current="page"]');

    expect(currentCrumb?.getAttribute("aria-current")).toBe("page");
    expect(currentCrumb?.closest("button")).toBeNull();
  });

  it.each([
    ["/mkxl/catalog/scorpion/ninjutsu", 2, []],
    ["/mk1/catalog/scorpion/cyrax", 0, ["SC", "CY"]],
    ["/mkxl/catalog/kotal-kahn/war-god/kotal-kahn-war-god-starter-001", 2, []],
    ["/mk1/catalog/scorpion/cyrax/scorpion-cyrax-seed-001", 0, ["SC", "CY"]],
  ])("shows character and specification icons in catalog breadcrumbs for %s", async (path, imageCount, expectedFallbacks) => {
    await renderRoute(path);
    const breadcrumbs = screen.getByRole("navigation", { name: "Breadcrumbs" });
    const icons = breadcrumbs.querySelectorAll("[data-breadcrumb-icon]");
    const images = breadcrumbs.querySelectorAll("[data-breadcrumb-icon] img");
    const fallbacks = Array.from(
      breadcrumbs.querySelectorAll<HTMLElement>("[data-breadcrumb-icon-fallback]"),
    ).map((item) => item.textContent);

    expect(icons).toHaveLength(2);
    expect(images).toHaveLength(imageCount);
    expect(Array.from(images).every((image) => image.getAttribute("alt") === "")).toBe(true);
    expect(fallbacks).toEqual(expectedFallbacks);
  });

  it.each([
    ["Kotal Kahn", "/mkxl/catalog/kotal-kahn"],
    ["War God", "/mkxl/catalog/kotal-kahn/war-god"],
  ])("navigates from a combo detail %s breadcrumb", async (label, expectedPath) => {
    const { router } = await renderRoute(
      "/mkxl/catalog/kotal-kahn/war-god/kotal-kahn-war-god-starter-001",
    );

    const breadcrumbs = screen.getByRole("navigation", { name: "Breadcrumbs" });
    fireEvent.click(within(breadcrumbs).getByRole("button", { name: label }));

    await waitFor(() => expect(router.state.location.pathname).toBe(expectedPath));
    expect(router.state.location.search).toEqual({});
  });

  it("moves mobile navigation into one drawer without hidden focusable duplicates", async () => {
    await renderRoute("/mkxl/lists", "mobile");

    expect(screen.queryByRole("navigation", { name: "Breadcrumbs" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Choose game" })).toBeNull();
    expect(
      screen
        .getAllByText("Named Lists")
        .find((element) => element.closest('[aria-current="page"]')),
    ).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Open global menu" }));

    expect(await screen.findByRole("dialog", { name: "Navigation" })).toBeTruthy();
    expect(screen.getAllByRole("button", { name: "Choose game" })).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: "Catalog" })).toHaveLength(1);
    const currentDrawerCrumb = screen
      .getAllByText("Named Lists")
      .find((element) => element.closest('[role="dialog"]'))
      ?.closest('[aria-current="page"]');

    expect(currentDrawerCrumb).toBeTruthy();
    expect(currentDrawerCrumb?.closest("button")).toBeNull();
  });

  it("moves through the rendered mobile order and restores focus after the nested game menu", async () => {
    const controller = installControllerPolling([gesturingGamepad]);
    const view = await renderRoute("/mkxl/lists", "mobile");

    controller.setGamepads([neutralGamepad]);
    controller.flush(0);
    pressControllerButton(controller, 9, 10);
    const drawer = await screen.findByRole("dialog", { name: "Navigation" });
    const chooseGame = within(drawer).getByRole("button", { name: "Choose game" });
    const catalog = within(drawer).getByRole("button", { name: "Catalog" });
    const builder = within(drawer).getByRole("button", { name: "Builder" });
    const settings = within(drawer).getByRole("button", { name: "Settings" });

    await waitFor(() => expect(chooseGame.dataset.controllerFocused).toBe("true"));
    expect(view.container.querySelectorAll('[data-controller-focused="true"]')).toHaveLength(1);

    pressControllerButton(controller, 13, 20);
    expect(catalog.dataset.controllerFocused).toBe("true");
    pressControllerButton(controller, 13, 30);
    expect(builder.dataset.controllerFocused).toBe("true");
    pressControllerButton(controller, 13, 40);
    expect(settings.dataset.controllerFocused).toBe("true");
    pressControllerButton(controller, 13, 50);
    expect(chooseGame.dataset.controllerFocused).toBe("true");
    expect(within(drawer).getByText("Named Lists").closest('[aria-current="page"]')).toBeTruthy();
    expect(within(drawer).queryByRole("button", { name: "Named Lists" })).toBeNull();

    pressControllerButton(controller, 0, 60);
    const gameMenu = await screen.findByRole("menu", { name: "Choose game" });
    const currentGame = within(gameMenu).getByRole("menuitem", { name: "MKXL" });
    const nextGame = within(gameMenu).getByRole("menuitem", { name: "MK1" });

    await waitFor(() => expect(nextGame.dataset.controllerFocused).toBe("true"));
    expect(currentGame.dataset.controllerFocused).toBeUndefined();
    expect(document.querySelectorAll('[data-controller-focused="true"]')).toHaveLength(1);

    pressControllerButton(controller, 1, 70);
    await waitFor(() => expect(screen.queryByRole("menu", { name: "Choose game" })).toBeNull());
    expect(chooseGame.dataset.controllerFocused).toBe("true");
    expect(view.container.querySelectorAll('[data-controller-focused="true"]')).toHaveLength(1);
  });

  it("keeps tablet breadcrumbs inline without duplicating them in the drawer", async () => {
    await renderRoute("/mkxl/lists", "tablet");

    const breadcrumbs = screen.getByRole("navigation", { name: "Breadcrumbs" });

    expect(within(breadcrumbs).getByRole("button", { name: "Choose game" })).toBeTruthy();
    expect(within(breadcrumbs).getByRole("button", { name: "Catalog" })).toBeTruthy();
    expect(
      within(breadcrumbs).getByText("Named Lists").closest('[aria-current="page"]'),
    ).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Open global menu" }));
    const drawer = await screen.findByRole("dialog", { name: "Navigation" });

    expect(within(drawer).queryByRole("button", { name: "Choose game" })).toBeNull();
    expect(within(drawer).queryByRole("button", { name: "Catalog" })).toBeNull();
    expect(within(drawer).queryByText("Named Lists")).toBeNull();
    expect(within(drawer).getByRole("button", { name: "Builder" })).toBeTruthy();
    expect(within(drawer).getByRole("button", { name: "Settings" })).toBeTruthy();
  });

  it.each([
    "desktop",
    "tablet",
  ] as const)("navigates from an inline %s breadcrumb", async (mode) => {
    const { router } = await renderRoute("/mkxl/lists", mode);

    fireEvent.click(screen.getByRole("button", { name: "Catalog" }));
    await waitFor(() => expect(router.state.location.pathname).toBe("/mkxl/catalog"));
    await waitFor(() =>
      expect(
        (screen.getByRole("button", { name: "Open global menu" }) as HTMLButtonElement).disabled,
      ).toBe(false),
    );

    fireEvent.click(screen.getByRole("button", { name: "Open global menu" }));
    if (mode === "desktop") {
      fireEvent.click(await screen.findByRole("menuitem", { name: "Settings" }));
    } else {
      const drawer = await screen.findByRole("dialog", { name: "Navigation" });
      fireEvent.click(within(drawer).getByRole("button", { name: "Settings" }));
    }
    await waitFor(() => expect(router.state.location.search).toEqual({ settings: "interface" }));
    expect(router.state.location.pathname).toBe("/mkxl/catalog");
    expect(await screen.findByRole("dialog", { name: "Settings" })).toBeTruthy();
    expect(
      document.querySelector('[data-ui-page="UI-PAGE-001"]')?.getAttribute("data-active-game"),
    ).toBe("mkxl");
  });

  it("opens the variation selector from the character breadcrumb", async () => {
    const { router } = await renderRoute("/mkxl/catalog/scorpion/ninjutsu");

    fireEvent.click(screen.getByRole("button", { name: "Scorpion" }));

    await waitFor(() => expect(router.state.location.pathname).toBe("/mkxl/catalog/scorpion"));
    expect(router.state.location.search).toEqual({});
  });

  it.each([
    ["desktop", "/mkxl/catalog/scorpion", "/mkxl/catalog"],
    ["desktop", "/mk1/catalog/scorpion", "/mk1/catalog"],
    ["mobile", "/mkxl/catalog/scorpion", "/mkxl/catalog"],
    ["mobile", "/mk1/catalog/scorpion", "/mk1/catalog"],
  ] as const)("returns from %s %s through the Catalog breadcrumb surface", async (mode, path, rootPath) => {
    const { router } = await renderRoute(path, mode);

    if (mode === "mobile") {
      fireEvent.click(screen.getByRole("button", { name: "Open global menu" }));
      const drawer = await screen.findByRole("dialog", { name: "Navigation" });
      fireEvent.click(within(drawer).getByRole("button", { name: "Catalog" }));
    } else {
      const breadcrumbs = screen.getByRole("navigation", { name: "Breadcrumbs" });
      fireEvent.click(within(breadcrumbs).getByRole("button", { name: "Catalog" }));
    }

    await waitFor(() => expect(router.state.location.pathname).toBe(rootPath));
    expect(router.state.location.search).toEqual({});
  });

  it("keeps catalog context navigation available in the compact drawer", async () => {
    const { router } = await renderRoute("/mk1/catalog/scorpion/cyrax", "mobile");

    expect(
      screen.getAllByText("Cyrax").find((element) => element.closest('[aria-current="page"]')),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Open global menu" }));
    const drawer = await screen.findByRole("dialog", { name: "Navigation" });

    expect(within(drawer).getByRole("button", { name: "Catalog" })).toBeTruthy();
    fireEvent.click(within(drawer).getByRole("button", { name: "Scorpion" }));

    await waitFor(() => expect(router.state.location.pathname).toBe("/mk1/catalog/scorpion"));
    expect(router.state.location.search).toEqual({});
  });

  it("does not duplicate breadcrumb destinations in the desktop dropdown", async () => {
    await renderRoute("/mkxl/lists");

    fireEvent.click(screen.getByRole("button", { name: "Open global menu" }));
    const menu = await screen.findByRole("menu", { name: "Open global menu" });

    expect(within(menu).queryByRole("menuitem", { name: "Catalog" })).toBeNull();
    expect(within(menu).queryByRole("menuitem", { name: "Named Lists" })).toBeNull();
    expect(within(menu).getByRole("menuitem", { name: "Builder" })).toBeTruthy();
    expect(within(menu).getByRole("menuitem", { name: "Settings" })).toBeTruthy();
  });

  it.each([
    ["catalog", "/mkxl/catalog?future=value", "/mk1/catalog", {}],
    ["lists", "/mkxl/lists", "/mk1/lists", undefined],
    ["builder", "/mkxl/builder?future=value", "/mk1/builder", {}],
    [
      "detail",
      "/mkxl/catalog/kotal-kahn/war-god/kotal-kahn-war-god-starter-001",
      "/mk1/catalog",
      undefined,
    ],
    ["root", "/", "/mk1/catalog", undefined],
    ["recovery", "/not/a/real/route", "/mk1/catalog", undefined],
  ])("maps %s game switching to %s", async (_case, initialPath, expectedPath, expectedSearch) => {
    const { router } = await renderRoute(initialPath);

    await selectGame("MK1");

    await waitFor(() => expect(router.state.location.pathname).toBe(expectedPath));
    if (expectedSearch !== undefined) {
      expect(router.state.location.search).toEqual(expectedSearch);
    }
    await waitFor(() => expectActiveGame("mk1"));
  });

  it("switches games from the compact drawer", async () => {
    const { router } = await renderRoute("/mkxl/catalog", "mobile");

    fireEvent.click(screen.getByRole("button", { name: "Open global menu" }));
    await screen.findByRole("dialog", { name: "Navigation" });
    await selectGame("MK1");

    await waitFor(() => expect(router.state.location.pathname).toBe("/mk1/catalog"));
    await waitFor(() => expectActiveGame("mk1"));
  });

  it("remembers a route game when entering settings", async () => {
    const { router } = await renderRoute("/mk1/catalog");

    fireEvent.click(screen.getByRole("button", { name: "Open global menu" }));
    fireEvent.click(await screen.findByRole("menuitem", { name: "Settings" }));

    await waitFor(() => expect(router.state.location.search).toEqual({ settings: "interface" }));
    expect(router.state.location.pathname).toBe("/mk1/catalog");
    expect(await screen.findByRole("dialog", { name: "Settings" })).toBeTruthy();
    expect(
      document.querySelector('[data-ui-page="UI-PAGE-001"]')?.getAttribute("data-active-game"),
    ).toBe("mk1");
  });

  it.each([
    ["/future-game/catalog"],
    ["/mkxl/combos/seeded/scorpion-bnb-001"],
    ["/settings"],
    ["/backup"],
    ["/mkxl/backup"],
    ["/not/a/real/route"],
  ])("renders %s as recovery inside the shell", async (path) => {
    const view = await renderRoute(path);

    expect(screen.getByRole("heading", { name: "This route is unavailable" })).toBeTruthy();
    expect(view.container.querySelector('[data-ui-page="UI-PAGE-001"]')).toBeTruthy();
    expect(view.container.querySelector('[data-ui-page="route-recovery"]')).toBeTruthy();
    expect(view.container.querySelector('[data-ui-page="UI-PAGE-003"]')).toBeNull();
  });

  it.each([
    "/settings",
    "/backup",
  ])("classifies the removed %s route as shell recovery without Settings compatibility", async (path) => {
    await renderRoute(path);
    const breadcrumbs = screen.getByRole("navigation", { name: "Breadcrumbs" });
    const recoveryCrumb = within(breadcrumbs)
      .getByText("Unavailable route")
      .closest('[aria-current="page"]');

    expect(recoveryCrumb?.getAttribute("aria-current")).toBe("page");
    expect(within(breadcrumbs).queryByText("Settings")).toBeNull();
    expect(screen.queryByRole("dialog", { name: "Settings" })).toBeNull();
  });

  it("offers a safe recovery action to the first installed game", async () => {
    const { router } = await renderRoute("/not/a/real/route");

    fireEvent.click(screen.getByRole("button", { name: "Open MKXL Catalog" }));

    await waitFor(() => expect(router.state.location.pathname).toBe("/mkxl/catalog"));
    expectCatalogGameLabel("MKXL");
  });

  it("opens the backup tab directly over the current route without redirecting", async () => {
    const { history, router } = await renderRoute("/mkxl/catalog?settings=backup");

    expect(router.state.location.pathname).toBe("/mkxl/catalog");
    expect(router.state.location.search).toEqual({ settings: "backup" });
    expect(history.length).toBe(1);
    expect(screen.getByRole("dialog", { name: "Settings" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Game backups" }).getAttribute("aria-selected")).toBe(
      "true",
    );
    expect(screen.getAllByRole("button", { name: /^MK(?:XL|1)$/u })).toHaveLength(
      installedGames.length,
    );
    const target = screen.getByRole("button", { name: "MKXL" });

    expect(target.getAttribute("aria-expanded")).toBe("true");
    await waitFor(() => expect(document.activeElement).toBe(target));
  });

  it("synchronizes backup expansion while mounted Settings switches tabs", async () => {
    const { router } = await renderRoute("/mkxl/catalog?settings=interface");
    expect(screen.queryByRole("button", { name: "MKXL" })).toBeNull();

    fireEvent.click(screen.getByRole("tab", { name: "Game backups" }));
    await waitFor(() => expect(router.state.location.search).toEqual({ settings: "backup" }));

    const target = await screen.findByRole("button", { name: "MKXL" });

    await waitFor(() => expect(target.getAttribute("aria-expanded")).toBe("true"));
    await waitFor(() => expect(document.activeElement).toBe(target));

    fireEvent.click(screen.getByRole("tab", { name: "Interface" }));
    await waitFor(() => expect(router.state.location.search).toEqual({ settings: "interface" }));

    await waitFor(() => expect(screen.queryByRole("button", { name: "MKXL" })).toBeNull());
    expect(screen.getByRole("heading", { name: "Interface" })).toBeTruthy();
  });

  it("ignores foreign settings keys without entering recovery", async () => {
    const { container, router } = await renderRoute("/mkxl/lists?settings=interface&future=value");

    expect(screen.getByRole("heading", { name: "Settings" })).toBeTruthy();
    expect(
      screen.getByText("Adjust the interface or manage a separate backup for each game."),
    ).toBeTruthy();
    expect(router.state.location.pathname).toBe("/mkxl/lists");
    expect(router.state.location.search).toEqual({
      future: "value",
      settings: "interface",
    });
    expect(container.querySelector('[data-ui-page="route-recovery"]')).toBeNull();
    expect(screen.queryByText("value")).toBeNull();
  });

  it("exposes pending navigation as shell busy state and blocks triggers", async () => {
    const { container, router } = await renderRoute("/mkxl/lists");
    let resolveNavigation: (() => void) | undefined;
    const pendingNavigation = new Promise<void>((resolve) => {
      resolveNavigation = resolve;
    });
    const navigateSpy = vi.spyOn(router, "navigate").mockReturnValue(pendingNavigation);

    fireEvent.click(screen.getByRole("button", { name: "Catalog" }));

    const shell = container.querySelector('[data-ui-page="UI-PAGE-001"]');
    await waitFor(() => expect(shell?.getAttribute("aria-busy")).toBe("true"));
    expect((screen.getByRole("button", { name: "Catalog" }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    expect(
      (screen.getByRole("button", { name: "Open global menu" }) as HTMLButtonElement).disabled,
    ).toBe(true);
    expect(navigateSpy).toHaveBeenCalledTimes(1);

    await act(async () => resolveNavigation?.());
    await waitFor(() => expect(shell?.hasAttribute("aria-busy")).toBe(false));
  });

  it("blocks the game switcher while its navigation is pending", async () => {
    const { container, router } = await renderRoute("/mkxl/catalog");
    let resolveNavigation: (() => void) | undefined;
    const pendingNavigation = new Promise<void>((resolve) => {
      resolveNavigation = resolve;
    });
    vi.spyOn(router, "navigate").mockReturnValue(pendingNavigation);

    await selectGame("MK1");

    const shell = container.querySelector('[data-ui-page="UI-PAGE-001"]');
    await waitFor(() => expect(shell?.getAttribute("aria-busy")).toBe("true"));
    expect(
      (screen.getByRole("button", { name: "Choose game" }) as HTMLButtonElement).disabled,
    ).toBe(true);

    await act(async () => resolveNavigation?.());
    await waitFor(() => expect(shell?.hasAttribute("aria-busy")).toBe(false));
  });
});
