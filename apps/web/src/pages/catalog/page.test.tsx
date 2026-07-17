import {
  languageCodes,
  notationDisplayModes,
  themePreferences,
} from "@mk-combos/contracts/settings/value";
import { act, fireEvent, render, screen, waitFor } from "@mk-combos/contracts/test/unit/react";
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PersistedLocalStateSchema } from "../../app/local-state/schema";
import { localStateStorageKey, localStateStorageVersion } from "../../app/local-state/value";
import { installedGames } from "../../game-business/installed-games/value";
import { getRouter } from "../../router";

vi.mock("../../styles.css?url", () => ({ default: "/styles.css" }));

const originalMatchMedia = globalThis.window.matchMedia;
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

function installConnectedController() {
  let gamepads: readonly (typeof neutralGamepad)[] = [gesturingGamepad];
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
    arm() {
      gamepads = [neutralGamepad];
      const pending = Array.from(callbacks.values());
      callbacks.clear();
      act(() => {
        for (const callback of pending) {
          callback(0);
        }
      });
    },
  };
}

function installDesktopMode() {
  Object.defineProperty(globalThis.window, "matchMedia", {
    configurable: true,
    value: vi.fn((query: string) => ({
      addEventListener: vi.fn(),
      matches: query === "(min-width: 40rem)" || query === "(min-width: 70rem)",
      media: query,
      removeEventListener: vi.fn(),
    })),
  });
}

async function renderCatalogRoute(path: string) {
  globalThis.window.localStorage.clear();
  globalThis.window.localStorage.setItem(
    localStateStorageKey,
    JSON.stringify(
      PersistedLocalStateSchema.parse({
        firstLaunchCompleted: true,
        state: {
          games: Object.fromEntries(
            installedGames.map((business) => [business.id, business.backup.createEmptySlice()]),
          ),
          settings: {
            defaultGameId: installedGames[0].id,
            language: languageCodes.EN,
            lastActiveGameId: installedGames[0].id,
            notationDisplayMode: notationDisplayModes.FGC,
            themePreference: themePreferences.system,
          },
        },
        version: localStateStorageVersion,
      }),
    ),
  );
  installDesktopMode();
  const router = getRouter({
    history: createMemoryHistory({ initialEntries: [path] }),
  });

  await router.load();
  const view = render(<RouterProvider router={router} />, {
    baseElement: document,
    container: document,
  });
  await act(async () => {
    await router.load();
  });

  return view;
}

afterEach(() => {
  globalThis.window.localStorage.clear();
  Object.defineProperty(globalThis.window, "matchMedia", {
    configurable: true,
    value: originalMatchMedia,
  });

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

describe("Catalog controller focus", () => {
  it("marks only the filter drawer target while its modal overlay is active", async () => {
    const controller = installConnectedController();
    await renderCatalogRoute("/mkxl/catalog/scorpion/ninjutsu");
    controller.arm();

    await waitFor(() =>
      expect(document.querySelector("[data-app-shell-controller-ribbon]")).toBeTruthy(),
    );
    fireEvent.click(screen.getByRole("button", { name: "Filters" }));

    await waitFor(() => {
      const catalog = document.querySelector('[data-catalog-route="result"]');
      const filterDrawer = document.querySelector("[data-filter-drawer]");
      const results = catalog?.querySelector("[data-catalog-result-scroller]");

      expect(document.querySelectorAll('[data-controller-focused="true"]')).toHaveLength(1);
      expect(catalog?.querySelector('[data-controller-focused="true"]')).toBeNull();
      expect(filterDrawer?.querySelectorAll('[data-controller-focused="true"]')).toHaveLength(1);
      expect(results?.querySelector('[data-controller-focused="true"]')).toBeNull();
      expect(results?.hasAttribute("inert")).toBe(true);
    });
  });

  it.each([
    ["/mkxl/catalog/not-a-fighter", "specification-selector", "Back to fighters", "choose-fighter"],
    [
      "/mkxl/catalog/scorpion/not-a-variation",
      "result",
      "Choose a variation or kameo",
      "choose-specification",
    ],
  ])("marks the actual recovery action for %s", async (path, routeKind, actionLabel, focusTarget) => {
    const controller = installConnectedController();
    await renderCatalogRoute(path);
    controller.arm();

    const action = await screen.findByRole("button", { name: actionLabel });
    const page = document.querySelector(`[data-catalog-route="${routeKind}"]`);

    expect(page?.querySelectorAll('[data-controller-focused="true"]')).toHaveLength(1);
    expect(action.dataset.controllerFocused).toBe("true");
    expect(action.dataset.uiFocusTarget).toBe(focusTarget);
  });
});
