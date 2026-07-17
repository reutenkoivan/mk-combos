import { languageCodes, themePreferences } from "@mk-combos/contracts/settings/value";
import { fireEvent, render, screen, waitFor } from "@mk-combos/contracts/test/unit/react";
import { describe, expect, it, vi } from "vitest";

import { LocalStateProvider, useLocalStateObservableState, useLocalStateSource } from "./provider";
import type { LocalStateStorage } from "./type";
import { localStateHydrationStatuses, localStateStorageKey } from "./value";

function LocalStateConsumer() {
  const source = useLocalStateSource();
  const observable = useLocalStateObservableState();

  return (
    <div>
      <span data-testid="hydration">{observable.hydrationStatus}</span>
      <span data-testid="language">{observable.appliedSettings.language}</span>
      <span data-testid="theme">{observable.appliedSettings.themePreference}</span>
      <button type="button" onClick={() => source.updateSettings({ language: languageCodes.EN })}>
        Use English
      </button>
      <button
        type="button"
        onClick={() => source.updateSettings({ themePreference: themePreferences.light })}
      >
        Use light theme
      </button>
    </div>
  );
}

function SourceOutsideProvider() {
  useLocalStateSource();
  return null;
}

function ObservableOutsideProvider() {
  useLocalStateObservableState();
  return null;
}

describe("LocalStateProvider", () => {
  it("hydrates its provider-owned store and exposes separate source and observable hooks", async () => {
    let storedValue: string | null = null;
    const storage: LocalStateStorage = {
      getItem: vi.fn(() => storedValue),
      setItem: vi.fn((key: string, value: string) => {
        if (key === localStateStorageKey) {
          storedValue = value;
        }
      }),
    };

    render(
      <LocalStateProvider
        environment={{
          browserLocalePreferences: { language: "uk-UA" },
          storage,
        }}
      >
        <LocalStateConsumer />
      </LocalStateProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId("hydration").textContent).toBe(localStateHydrationStatuses.ready),
    );
    expect(screen.getByTestId("language").textContent).toBe(languageCodes.UA);
    expect(screen.getByTestId("theme").textContent).toBe(themePreferences.system);
    expect(document.documentElement.lang).toBe("uk");

    fireEvent.click(screen.getByRole("button", { name: "Use English" }));

    expect(screen.getByTestId("language").textContent).toBe(languageCodes.EN);
    expect(document.documentElement.lang).toBe("en");
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(storedValue).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Use light theme" }));

    expect(screen.getByTestId("theme").textContent).toBe(themePreferences.light);
    expect(storage.setItem).toHaveBeenCalledTimes(2);
  });

  it("fails clearly when either hook is read outside its provider", () => {
    expect(() => render(<SourceOutsideProvider />)).toThrow(
      "Local state hooks must be used within LocalStateProvider",
    );
    expect(() => render(<ObservableOutsideProvider />)).toThrow(
      "Local state hooks must be used within LocalStateProvider",
    );
  });
});
