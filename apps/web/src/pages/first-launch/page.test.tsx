import { languageCodes, notationDisplayModes } from "@mk-combos/contracts/settings/value";
import { fireEvent, render, screen, waitFor, within } from "@mk-combos/contracts/test/unit/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LocalStateObservableState, LocalStateSource } from "../../app/local-state/type";
import {
  localStateErrorCodes,
  localStateHydrationStatuses,
  localStatePersistenceStatuses,
} from "../../app/local-state/value";
import { FirstLaunchPage } from "./page";

const navigate = vi.hoisted(() => vi.fn());

let observableState: LocalStateObservableState;

const successfulResult = {
  ok: true,
  persistenceStatus: localStatePersistenceStatuses.persistent,
} as const;

const localStateSource = {
  autoCompleteFromDeepLink: vi.fn<LocalStateSource["autoCompleteFromDeepLink"]>(
    () => successfulResult,
  ),
  clearSettingsReturnTarget: vi.fn<LocalStateSource["clearSettingsReturnTarget"]>(
    () => successfulResult,
  ),
  completeFirstLaunch: vi.fn<LocalStateSource["completeFirstLaunch"]>(() => successfulResult),
  rememberLastActiveGame: vi.fn<LocalStateSource["rememberLastActiveGame"]>(() => successfulResult),
  replaceGameSlice: vi.fn<LocalStateSource["replaceGameSlice"]>(() => successfulResult),
  setSettingsReturnTarget: vi.fn<LocalStateSource["setSettingsReturnTarget"]>(
    () => successfulResult,
  ),
  updateSettings: vi.fn<LocalStateSource["updateSettings"]>(() => successfulResult),
} satisfies LocalStateSource;

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigate,
}));

vi.mock("../../app/local-state/provider", () => ({
  useLocalStateObservableState: () => observableState,
  useLocalStateSource: () => localStateSource,
}));

vi.mock("../../app/providers/provider", () => ({
  useAppResponsiveMode: () => "desktop",
}));

function createObservableState(
  overrides: Partial<LocalStateObservableState> = {},
): LocalStateObservableState {
  return {
    appliedSettings: {
      defaultGameId: "mkxl",
      language: languageCodes.EN,
      notationDisplayMode: notationDisplayModes.FGC,
    },
    firstLaunchCompleted: false,
    games: {},
    hydrationStatus: localStateHydrationStatuses.ready,
    installedGameSlices: {},
    persistenceStatus: localStatePersistenceStatuses.persistent,
    resolvedActiveGameId: "mkxl",
    ...overrides,
  };
}

describe("FirstLaunchPage", () => {
  beforeEach(() => {
    observableState = createObservableState();
    vi.clearAllMocks();
    localStateSource.completeFirstLaunch.mockReturnValue(successfulResult);
    navigate.mockResolvedValue(undefined);
  });

  it("hydrates the explicit setup choices and shows a concise selected-mode preview", async () => {
    observableState = createObservableState({
      appliedSettings: {
        defaultGameId: "mk1",
        language: languageCodes.UA,
        notationDisplayMode: notationDisplayModes.PlayStation,
      },
      resolvedActiveGameId: "mk1",
    });

    render(<FirstLaunchPage />);

    expect(await screen.findByRole("heading", { name: "Налаштуймо MK Combos" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "З MK Combos ви можете:" })).toBeTruthy();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(
      screen.getByText(
        "Ваші списки й власні комбо зберігаються лише в цьому браузері, доки ви не створите резервну копію.",
      ),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Початкова гра" }).textContent).toContain("MK1");
    expect(screen.getByRole("button", { name: "Українська" }).dataset.selected).toBe("true");
    expect(screen.getByRole("button", { name: "PlayStation" }).dataset.selected).toBe("true");

    const preview = screen.getByRole("table", { name: "Приклад" });
    expect(within(preview).getAllByRole("row")).toHaveLength(2);
    expect(within(preview).getByRole("rowheader").textContent).toContain("PlayStation");
    expect(within(preview).queryByText("FGC")).toBeNull();
    expect(within(preview).queryByText("Xbox")).toBeNull();
  });

  it("confirms selected settings and replace-navigates to that game's catalog", async () => {
    render(<FirstLaunchPage />);
    await screen.findByRole("heading", { name: "Set up MK Combos" });

    fireEvent.click(screen.getByRole("button", { name: "Українська" }));
    await screen.findByRole("heading", { name: "Налаштуймо MK Combos" });
    expect(document.documentElement.lang).toBe("uk");

    fireEvent.click(screen.getByRole("button", { name: "Початкова гра" }));
    fireEvent.click(await screen.findByRole("menuitem", { name: "MK1" }));
    fireEvent.click(screen.getByRole("button", { name: "Xbox" }));
    fireEvent.click(screen.getByRole("button", { name: "Відкрити каталог" }));

    await waitFor(() =>
      expect(localStateSource.completeFirstLaunch).toHaveBeenCalledWith({
        defaultGameId: "mk1",
        language: languageCodes.UA,
        lastActiveGameId: "mk1",
        notationDisplayMode: notationDisplayModes.Xbox,
      }),
    );
    expect(navigate).toHaveBeenCalledWith({
      params: { gameId: "mk1" },
      replace: true,
      search: {},
      to: "/$gameId/catalog",
    });
  });

  it("surfaces session-only persistence and recoverable action errors", async () => {
    observableState = createObservableState({
      error: {
        code: localStateErrorCodes.storageUnavailable,
        message: "Browser storage is unavailable.",
        recoverable: true,
      },
      persistenceStatus: localStatePersistenceStatuses.sessionOnly,
    });
    localStateSource.completeFirstLaunch.mockReturnValue({
      error: {
        code: localStateErrorCodes.invalidActionInput,
        message: "First-launch settings were rejected.",
        recoverable: true,
      },
      ok: false,
    });

    render(<FirstLaunchPage />);
    await screen.findByRole("heading", { name: "Set up MK Combos" });

    expect(
      screen.getByText(
        "This browser can't save your choices. They will be lost after you reload or close the page.",
      ),
    ).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.queryByText("Browser storage is unavailable.")).toBeNull();
    expect(screen.queryByRole("button", { name: "Open catalog" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Continue without saving" }));

    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toContain("We couldn't apply these settings."),
    );
    expect(screen.queryByText("First-launch settings were rejected.")).toBeNull();
    expect(navigate).not.toHaveBeenCalled();
  });

  it("requires an explicit session-only acknowledgement after a failed durable write", async () => {
    localStateSource.completeFirstLaunch.mockReturnValue({
      ok: true,
      persistenceStatus: localStatePersistenceStatuses.sessionOnly,
    });

    const { rerender } = render(<FirstLaunchPage />);
    await screen.findByRole("heading", { name: "Set up MK Combos" });

    fireEvent.click(screen.getByRole("button", { name: "Open catalog" }));

    await waitFor(() => expect(localStateSource.completeFirstLaunch).toHaveBeenCalledTimes(1));
    expect(navigate).not.toHaveBeenCalled();

    observableState = createObservableState({
      persistenceStatus: localStatePersistenceStatuses.sessionOnly,
    });
    rerender(<FirstLaunchPage />);

    expect(screen.queryByRole("button", { name: "Open catalog" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Continue without saving" }));

    await waitFor(() => expect(localStateSource.completeFirstLaunch).toHaveBeenCalledTimes(2));
    expect(navigate).toHaveBeenCalledWith({
      params: { gameId: "mkxl" },
      replace: true,
      search: {},
      to: "/$gameId/catalog",
    });
  });
});
