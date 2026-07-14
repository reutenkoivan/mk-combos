import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@mk-combos/contracts/test/unit/react";
import { uiResponsiveModes } from "@mk-combos/ui/components/value";
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getRouter } from "./router";

vi.mock("./styles.css?url", () => ({ default: "/styles.css" }));

const originalMatchMedia = globalThis.window.matchMedia;

function installResponsiveMode(mode: "desktop" | "tablet") {
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

async function renderRoute(path: string, mode: "desktop" | "tablet" = "desktop") {
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

afterEach(() => {
  Object.defineProperty(globalThis.window, "matchMedia", {
    configurable: true,
    value: originalMatchMedia,
  });
});

describe("AppShell route integration", () => {
  it.each([
    ["/mkxl/catalog", "MKXL", "mkxl"],
    ["/mk1/catalog", "MK1", "mk1"],
  ])("provides the exact active business for %s", async (path, label, gameId) => {
    const view = await renderRoute(path);

    expect(screen.getByRole("heading", { name: "Catalog" })).toBeTruthy();
    expect(screen.getByText(`Active game: ${label}`)).toBeTruthy();
    expect(
      view.container
        .querySelector('[data-ui-page="UI-PAGE-001"]')
        ?.getAttribute("data-active-game"),
    ).toBe(gameId);
  });

  it.each([
    ["/mkxl/catalog", ["Catalog"], "Catalog"],
    ["/mkxl/lists", ["Catalog", "Named Lists"], "Named Lists"],
    ["/mkxl/builder", ["Catalog", "Builder"], "Builder"],
    ["/mkxl/combos/seeded/scorpion-bnb-001", ["Catalog", "scorpion-bnb-001"], "scorpion-bnb-001"],
    ["/settings", ["Settings"], "Settings"],
  ])("prepares desktop breadcrumbs for %s", async (path, expectedLabels, currentLabel) => {
    await renderRoute(path);
    const breadcrumbs = screen.getByRole("navigation", { name: "Breadcrumbs" });
    const crumbLabels = Array.from(breadcrumbs.querySelectorAll("ol > li"))
      .slice(1)
      .map((item) => item.textContent?.trim());

    expect(within(breadcrumbs).getByRole("button", { name: "Choose game" })).toBeTruthy();
    expect(crumbLabels).toEqual(expectedLabels);
    const currentCrumb = within(breadcrumbs).getByText(currentLabel);

    expect(currentCrumb.getAttribute("aria-current")).toBe("page");
    expect(currentCrumb.closest("button")).toBeNull();
  });

  it("moves compact navigation into one drawer without hidden focusable duplicates", async () => {
    await renderRoute("/mkxl/lists", "tablet");

    expect(screen.queryByRole("navigation", { name: "Breadcrumbs" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Choose game" })).toBeNull();
    expect(
      screen
        .getAllByText("Named Lists")
        .find((element) => element.getAttribute("aria-current") === "page"),
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

  it("navigates from a desktop breadcrumb", async () => {
    const { router } = await renderRoute("/mkxl/lists");

    fireEvent.click(screen.getByRole("button", { name: "Catalog" }));
    await waitFor(() => expect(router.state.location.pathname).toBe("/mkxl/catalog"));
    await waitFor(() =>
      expect(
        (screen.getByRole("button", { name: "Open global menu" }) as HTMLButtonElement).disabled,
      ).toBe(false),
    );

    fireEvent.click(screen.getByRole("button", { name: "Open global menu" }));
    fireEvent.click(await screen.findByRole("menuitem", { name: "Settings" }));
    await waitFor(() => expect(router.state.location.pathname).toBe("/settings"));
    expect(screen.getByText("Active game: MKXL")).toBeTruthy();
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
    ["detail", "/mkxl/combos/seeded/scorpion-bnb-001", "/mk1/catalog", undefined],
    ["root", "/", "/mk1/catalog", undefined],
    ["recovery", "/not/a/real/route", "/mk1/catalog", undefined],
  ])("maps %s game switching to %s", async (_case, initialPath, expectedPath, expectedSearch) => {
    const { router } = await renderRoute(initialPath);

    await selectGame("MK1");

    await waitFor(() => expect(router.state.location.pathname).toBe(expectedPath));
    if (expectedSearch !== undefined) {
      expect(router.state.location.search).toEqual(expectedSearch);
    }
    await waitFor(() => expect(screen.getByText("Active game: MK1")).toBeTruthy());
  });

  it("switches games from the compact drawer", async () => {
    const { router } = await renderRoute("/mkxl/catalog", "tablet");

    fireEvent.click(screen.getByRole("button", { name: "Open global menu" }));
    await screen.findByRole("dialog", { name: "Navigation" });
    await selectGame("MK1");

    await waitFor(() => expect(router.state.location.pathname).toBe("/mk1/catalog"));
    await waitFor(() => expect(screen.getByText("Active game: MK1")).toBeTruthy());
  });

  it("changes the session game on settings without leaving settings", async () => {
    const { router } = await renderRoute("/settings");

    expect(screen.getByText("Active game: MKXL")).toBeTruthy();
    await selectGame("MK1");

    expect(router.state.location.pathname).toBe("/settings");
    await waitFor(() => expect(screen.getByText("Active game: MK1")).toBeTruthy());
  });

  it("remembers a route game when entering settings", async () => {
    const { router } = await renderRoute("/mk1/catalog");

    fireEvent.click(screen.getByRole("button", { name: "Open global menu" }));
    fireEvent.click(await screen.findByRole("menuitem", { name: "Settings" }));

    await waitFor(() => expect(router.state.location.pathname).toBe("/settings"));
    expect(screen.getByText("Active game: MK1")).toBeTruthy();
  });

  it.each([
    ["/future-game/catalog"],
    ["/mkxl/combos/shared/scorpion-bnb-001"],
    ["/settings?section=unknown"],
    ["/not/a/real/route"],
  ])("renders %s as recovery inside the shell", async (path) => {
    const view = await renderRoute(path);

    expect(screen.getByRole("heading", { name: "This route is unavailable" })).toBeTruthy();
    expect(view.container.querySelector('[data-ui-page="UI-PAGE-001"]')).toBeTruthy();
    expect(view.container.querySelector('[data-ui-page="route-recovery"]')).toBeTruthy();
    expect(view.container.querySelector('[data-ui-page="UI-PAGE-003"]')).toBeNull();
  });

  it("classifies an invalid settings section as shell recovery", async () => {
    await renderRoute("/settings?section=unknown");
    const breadcrumbs = screen.getByRole("navigation", { name: "Breadcrumbs" });
    const recoveryCrumb = within(breadcrumbs).getByText("Unavailable route");

    expect(recoveryCrumb.getAttribute("aria-current")).toBe("page");
    expect(within(breadcrumbs).queryByText("Settings")).toBeNull();
  });

  it("offers a safe recovery action to the first installed game", async () => {
    const { router } = await renderRoute("/not/a/real/route");

    fireEvent.click(screen.getByRole("button", { name: "Open MKXL Catalog" }));

    await waitFor(() => expect(router.state.location.pathname).toBe("/mkxl/catalog"));
    expect(screen.getByText("Active game: MKXL")).toBeTruthy();
  });

  it("shows only the normalized settings section after the backup redirect", async () => {
    const { history, router } = await renderRoute("/backup");

    expect(router.state.location.pathname).toBe("/settings");
    expect(router.state.location.search).toEqual({ section: "backup" });
    expect(history.length).toBe(1);
    expect(screen.getByText(/Requested section: backup/)).toBeTruthy();
  });

  it("ignores foreign settings keys without entering recovery", async () => {
    const view = await renderRoute("/settings?future=value");

    expect(screen.getByRole("heading", { name: "Settings" })).toBeTruthy();
    expect(screen.getByText(/Settings, backup, and persistence/)).toBeTruthy();
    expect(view.container.querySelector('[data-ui-page="route-recovery"]')).toBeNull();
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
