import { act, render, screen } from "@mk-combos/contracts/test/unit/react";
import { uiResponsiveModes } from "@mk-combos/ui/components/value";
import { uiContrastModes, uiDensityModes, uiThemeModes } from "@mk-combos/ui/tokens/value";
import { afterEach, describe, expect, it, vi } from "vitest";
import { webBasePath } from "../config/web-path";
import { AppProviders, useAppResponsiveMode } from "./providers";

type MockMediaQuery = ReturnType<typeof createMockMediaQuery>;

function ResponsiveModeConsumer() {
  return <span data-testid="app-responsive-mode">{useAppResponsiveMode()}</span>;
}

function createMockMediaQuery(media: string, initialMatches: boolean) {
  let matches = initialMatches;
  const listeners = new Set<() => void>();
  const query = {
    addEventListener: vi.fn((_type: string, listener: () => void) => listeners.add(listener)),
    get matches() {
      return matches;
    },
    media,
    removeEventListener: vi.fn((_type: string, listener: () => void) => listeners.delete(listener)),
  };

  return {
    emit(nextMatches: boolean) {
      matches = nextMatches;
      for (const listener of listeners) {
        listener();
      }
    },
    query,
  };
}

describe("AppProviders", () => {
  const originalMatchMedia = globalThis.window.matchMedia;

  afterEach(() => {
    Object.defineProperty(globalThis.window, "matchMedia", {
      configurable: true,
      value: originalMatchMedia,
    });
  });

  const installMatchMedia = (desktop: MockMediaQuery, tablet: MockMediaQuery) => {
    Object.defineProperty(globalThis.window, "matchMedia", {
      configurable: true,
      value: (query: string) => {
        if (query === "(min-width: 70rem)") {
          return desktop.query;
        }
        if (query === "(min-width: 40rem)") {
          return tablet.query;
        }
        throw new Error(`Unexpected media query: ${query}`);
      },
    });
  };

  it("owns the UI root defaults and desktop fallback", () => {
    Object.defineProperty(globalThis.window, "matchMedia", {
      configurable: true,
      value: undefined,
    });

    const view = render(
      <AppProviders>
        <span>Prepared route content</span>
      </AppProviders>,
    );
    const root = view.container.firstElementChild;

    expect(screen.getByText("Prepared route content")).toBeTruthy();
    expect(root?.getAttribute("data-ui-contrast")).toBe(uiContrastModes.standard);
    expect(root?.getAttribute("data-ui-density")).toBe(uiDensityModes.small);
    expect(root?.getAttribute("data-ui-responsive")).toBe(uiResponsiveModes.desktop);
    expect(root?.getAttribute("data-ui-theme")).toBe(uiThemeModes.dark);
    expect(root?.className).toContain("min-h-dvh");
  });

  it("projects responsive browser changes through the UI root", () => {
    const desktop = createMockMediaQuery("(min-width: 70rem)", false);
    const tablet = createMockMediaQuery("(min-width: 40rem)", false);
    installMatchMedia(desktop, tablet);

    const view = render(<AppProviders>Responsive route</AppProviders>);
    const root = view.container.firstElementChild;

    expect(root?.getAttribute("data-ui-responsive")).toBe(uiResponsiveModes.mobile);

    act(() => tablet.emit(true));
    expect(root?.getAttribute("data-ui-responsive")).toBe(uiResponsiveModes.tablet);

    act(() => desktop.emit(true));
    expect(root?.getAttribute("data-ui-responsive")).toBe(uiResponsiveModes.desktop);

    view.unmount();
    expect(desktop.query.removeEventListener).toHaveBeenCalledTimes(1);
    expect(tablet.query.removeEventListener).toHaveBeenCalledTimes(1);
  });

  it("shares the computed responsive mode with descendants without another subscription", () => {
    const desktop = createMockMediaQuery("(min-width: 70rem)", false);
    const tablet = createMockMediaQuery("(min-width: 40rem)", false);
    installMatchMedia(desktop, tablet);

    render(
      <AppProviders>
        <ResponsiveModeConsumer />
      </AppProviders>,
    );

    expect(screen.getByTestId("app-responsive-mode").textContent).toBe(uiResponsiveModes.mobile);
    expect(desktop.query.addEventListener).toHaveBeenCalledTimes(1);
    expect(tablet.query.addEventListener).toHaveBeenCalledTimes(1);

    act(() => tablet.emit(true));
    expect(screen.getByTestId("app-responsive-mode").textContent).toBe(uiResponsiveModes.tablet);
  });

  it("fails clearly when responsive mode is read outside AppProviders", () => {
    expect(() => render(<ResponsiveModeConsumer />)).toThrowError(
      "useAppResponsiveMode must be used within AppProviders",
    );
  });
});

describe("web deployment path", () => {
  it("keeps the GitHub Pages application base stable", () => {
    expect(webBasePath).toBe("/mk-combos/");
  });
});
