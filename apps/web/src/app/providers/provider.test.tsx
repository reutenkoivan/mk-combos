import { languageCodes, themePreferences } from "@mk-combos/contracts/settings/value";
import { act, fireEvent, render, screen, waitFor } from "@mk-combos/contracts/test/unit/react";
import { uiResponsiveModes } from "@mk-combos/ui/components/value";
import { uiContrastModes, uiDensityModes, uiThemeModes } from "@mk-combos/ui/tokens/value";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useLocalStateObservableState, useLocalStateSource } from "../local-state/provider";
import { createDefaultLocalAppState } from "../local-state/runtime";
import { PersistedLocalStateSchema } from "../local-state/schema";
import {
  localStateHydrationStatuses,
  localStateStorageKey,
  localStateStorageVersion,
} from "../local-state/value";
import { systemDarkThemeMediaQuery } from "../theme/value";
import { AppProviders, useAppResponsiveMode, useAppUiTheme } from "./provider";

type MockMediaQuery = ReturnType<typeof createMockMediaQuery>;

function ResponsiveModeConsumer() {
  return <span data-testid="app-responsive-mode">{useAppResponsiveMode()}</span>;
}

function UiThemeConsumer() {
  return <span data-testid="app-ui-theme">{useAppUiTheme()}</span>;
}

function ThemePreferenceConsumer() {
  const localState = useLocalStateObservableState();
  const source = useLocalStateSource();

  return (
    <button
      type="button"
      disabled={localState.hydrationStatus !== localStateHydrationStatuses.ready}
      onClick={() => source.updateSettings({ themePreference: themePreferences.light })}
    >
      Use light theme
    </button>
  );
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

  beforeEach(() => {
    globalThis.window.localStorage.clear();
  });

  afterEach(() => {
    globalThis.window.localStorage.clear();
    Object.defineProperty(globalThis.window, "matchMedia", {
      configurable: true,
      value: originalMatchMedia,
    });
  });

  const installMatchMedia = (
    desktop: MockMediaQuery,
    tablet: MockMediaQuery,
    systemDark = createMockMediaQuery(systemDarkThemeMediaQuery, true),
  ) => {
    Object.defineProperty(globalThis.window, "matchMedia", {
      configurable: true,
      value: (query: string) => {
        if (query === "(min-width: 70rem)") {
          return desktop.query;
        }
        if (query === "(min-width: 40rem)") {
          return tablet.query;
        }
        if (query === systemDarkThemeMediaQuery) {
          return systemDark.query;
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

  it("projects system color-scheme changes through the UI root", () => {
    const desktop = createMockMediaQuery("(min-width: 70rem)", true);
    const tablet = createMockMediaQuery("(min-width: 40rem)", true);
    const systemDark = createMockMediaQuery(systemDarkThemeMediaQuery, false);
    installMatchMedia(desktop, tablet, systemDark);

    const view = render(
      <AppProviders>
        <UiThemeConsumer />
      </AppProviders>,
    );
    const root = view.container.firstElementChild;

    expect(root?.getAttribute("data-ui-theme")).toBe(uiThemeModes.light);
    expect(screen.getByTestId("app-ui-theme").textContent).toBe(uiThemeModes.light);

    act(() => systemDark.emit(true));
    expect(root?.getAttribute("data-ui-theme")).toBe(uiThemeModes.dark);
    expect(screen.getByTestId("app-ui-theme").textContent).toBe(uiThemeModes.dark);

    view.unmount();
    expect(systemDark.query.removeEventListener).toHaveBeenCalledTimes(1);
  });

  it("keeps an explicit persisted theme independent from system changes", async () => {
    const state = createDefaultLocalAppState(languageCodes.EN).state;
    globalThis.window.localStorage.setItem(
      localStateStorageKey,
      JSON.stringify(
        PersistedLocalStateSchema.parse({
          firstLaunchCompleted: true,
          state: {
            ...state,
            settings: {
              ...state.settings,
              themePreference: themePreferences.light,
            },
          },
          version: localStateStorageVersion,
        }),
      ),
    );
    const desktop = createMockMediaQuery("(min-width: 70rem)", true);
    const tablet = createMockMediaQuery("(min-width: 40rem)", true);
    const systemDark = createMockMediaQuery(systemDarkThemeMediaQuery, true);
    installMatchMedia(desktop, tablet, systemDark);

    const view = render(<AppProviders>Explicitly themed route</AppProviders>);
    const root = view.container.firstElementChild;

    await waitFor(() => expect(root?.getAttribute("data-ui-theme")).toBe(uiThemeModes.light));

    act(() => systemDark.emit(false));
    expect(root?.getAttribute("data-ui-theme")).toBe(uiThemeModes.light);
  });

  it("applies an explicit theme setting immediately", async () => {
    const desktop = createMockMediaQuery("(min-width: 70rem)", true);
    const tablet = createMockMediaQuery("(min-width: 40rem)", true);
    const systemDark = createMockMediaQuery(systemDarkThemeMediaQuery, true);
    installMatchMedia(desktop, tablet, systemDark);

    const view = render(
      <AppProviders>
        <ThemePreferenceConsumer />
      </AppProviders>,
    );
    const root = view.container.firstElementChild;
    const button = screen.getByRole("button", { name: "Use light theme" });

    await waitFor(() => expect(button).toHaveProperty("disabled", false));
    expect(root?.getAttribute("data-ui-theme")).toBe(uiThemeModes.dark);

    fireEvent.click(button);

    expect(root?.getAttribute("data-ui-theme")).toBe(uiThemeModes.light);
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
    expect(() => render(<ResponsiveModeConsumer />)).toThrow(
      "useAppResponsiveMode must be used within AppProviders",
    );
  });
});
