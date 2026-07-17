import { GameBackupEnvelopeSchema } from "@mk-combos/contracts/backup/schema";
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
  waitFor,
  within,
} from "@mk-combos/contracts/test/unit/react";
import type { ControllerCommandEvent } from "@mk-combos/controller-bridge/bridge/type";
import { controllerCommandEventPhases } from "@mk-combos/controller-bridge/bridge/value";
import { knownControllerCommandIds } from "@mk-combos/controller-bridge/command/value";
import { controllerControlIds } from "@mk-combos/controller-bridge/input/value";
import { controllerProfileIds } from "@mk-combos/controller-bridge/profile/value";
import { uiResponsiveModes } from "@mk-combos/ui/components/value";
import { UiRoot } from "@mk-combos/ui/primitives/layout";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ControllerCommandScope } from "../../../app/controller-session/type";
import {
  LocalStateProvider,
  useLocalStateObservableState,
} from "../../../app/local-state/provider";
import { PersistedLocalStateSchema } from "../../../app/local-state/schema";
import type { LocalStateStorage } from "../../../app/local-state/type";
import {
  localStateHydrationStatuses,
  localStateStorageKey,
  localStateStorageVersion,
} from "../../../app/local-state/value";
import { installedGames } from "../../../game-business/installed-games/value";
import { SettingsModal } from "./component";
import type { SettingsTab } from "./navigation/type";
import { settingsTabs } from "./navigation/value";

const { blockerSpy, controllerScopeSpy, historyBackSpy, navigateSpy, routerLocation } = vi.hoisted(
  () => ({
    blockerSpy: vi.fn(),
    controllerScopeSpy: vi.fn(),
    historyBackSpy: vi.fn(),
    navigateSpy: vi.fn(),
    routerLocation: {
      href: "/mkxl/catalog?character=scorpion&settings=interface#moves",
      settingsModalEntry: false,
    },
  }),
);

vi.mock("@tanstack/react-router", () => ({
  useBlocker: (options: unknown) => blockerSpy(options),
  useNavigate: () => navigateSpy,
  useRouter: () => ({ history: { back: historyBackSpy } }),
  useRouterState: ({ select }: Readonly<{ select: (state: unknown) => unknown }>) =>
    select({
      location: {
        href: routerLocation.href,
        state: { settingsModalEntry: routerLocation.settingsModalEntry },
      },
    }),
}));
vi.mock("../../../app/controller-session/provider", () => ({
  useControllerCommandScope: (scope: unknown) => controllerScopeSpy(scope),
}));
vi.mock("../../../app/providers/provider", () => ({
  useAppResponsiveMode: () => "desktop",
}));

type SettingsHarness = Readonly<{
  readStored: () => string;
  setItem: ReturnType<typeof vi.fn>;
  unmount: () => void;
}>;

type RenderSettingsOptions = Readonly<{
  controllerFocusVisible?: boolean;
  failWrites?: boolean;
  href?: string;
  open?: boolean;
  openedFromShell?: boolean;
  section?: SettingsTab;
}>;

type NavigateOptions = Readonly<{
  href?: string;
  replace?: boolean;
  resetScroll?: boolean;
  state?: boolean | ((state: Record<string, unknown>) => Record<string, unknown>);
}>;

function latestNavigateOptions(): NavigateOptions {
  const options = navigateSpy.mock.lastCall?.[0] as NavigateOptions | undefined;

  if (options === undefined) {
    throw new Error("Expected Settings navigation.");
  }

  return options;
}

function commandEvent(commandId: string): ControllerCommandEvent {
  return {
    commandId,
    controlId: controllerControlIds.faceSouth,
    gamepadId: "settings-test-controller",
    gamepadIndex: 0,
    phase: controllerCommandEventPhases.press,
    profileId: controllerProfileIds.standard,
    sequence: 1,
    timestamp: 100,
    value: 1,
  };
}

function getControllerScope(id: string): ControllerCommandScope {
  const scope = [...controllerScopeSpy.mock.calls]
    .reverse()
    .map(([candidate]) => candidate as ControllerCommandScope)
    .find((candidate) => candidate.id === id);

  if (scope === undefined) {
    throw new Error(`Expected controller scope ${id}.`);
  }

  return scope;
}

function dispatchControllerCommand(scopeId: string, commandId: string) {
  act(() => {
    getControllerScope(scopeId).handleCommand(commandEvent(commandId));
  });
}

function createPersistedState(mkxlSlice: unknown = installedGames[0].backup.createEmptySlice()) {
  return PersistedLocalStateSchema.parse({
    firstLaunchCompleted: true,
    state: {
      games: {
        mk1: installedGames[1].backup.createEmptySlice(),
        mkxl: mkxlSlice,
      },
      settings: {
        defaultGameId: "mkxl",
        language: languageCodes.EN,
        lastActiveGameId: "mkxl",
        notationDisplayMode: notationDisplayModes.FGC,
        themePreference: themePreferences.system,
      },
    },
    version: localStateStorageVersion,
  });
}

function HydratedSettings({ open, section }: Readonly<{ open: boolean; section: SettingsTab }>) {
  const localState = useLocalStateObservableState();

  if (localState.hydrationStatus !== localStateHydrationStatuses.ready) {
    return null;
  }

  return <SettingsModal open={open} section={section} />;
}

function renderSettings(
  initial = createPersistedState(),
  options: RenderSettingsOptions = {},
): SettingsHarness {
  routerLocation.href = options.href ?? "/mkxl/catalog?character=scorpion&settings=interface#moves";
  routerLocation.settingsModalEntry = options.openedFromShell ?? false;
  let stored = JSON.stringify(initial);
  const setItem = vi.fn((key: string, value: string) => {
    if (options.failWrites) {
      throw new Error("quota exceeded");
    }

    if (key === localStateStorageKey) {
      stored = value;
    }
  });
  const storage: LocalStateStorage = {
    getItem: vi.fn((key: string) => (key === localStateStorageKey ? stored : null)),
    setItem,
  };

  const { unmount } = render(
    <LocalStateProvider environment={{ storage }}>
      <UiRoot
        responsiveMode={uiResponsiveModes.desktop}
        controllerFocusVisible={options.controllerFocusVisible}
      >
        <HydratedSettings
          open={options.open ?? true}
          section={options.section ?? settingsTabs.interface}
        />
      </UiRoot>
    </LocalStateProvider>,
  );

  return { readStored: () => stored, setItem, unmount };
}

function renderBackupSettings(
  initial = createPersistedState(),
  options: Omit<RenderSettingsOptions, "section"> = {},
): SettingsHarness {
  return renderSettings(initial, {
    href: "/mkxl/catalog?character=scorpion&settings=backup#moves",
    ...options,
    section: settingsTabs.backup,
  });
}

beforeEach(() => {
  blockerSpy.mockReset();
  controllerScopeSpy.mockReset();
  historyBackSpy.mockReset();
  navigateSpy.mockReset();
  routerLocation.href = "/mkxl/catalog?character=scorpion&settings=interface#moves";
  routerLocation.settingsModalEntry = false;
});

describe("SettingsModal", () => {
  it("renders Settings as an accessible modal only while the search state is open", async () => {
    const { rerender } = render(
      <LocalStateProvider environment={{ storage: null }}>
        <UiRoot responsiveMode={uiResponsiveModes.desktop}>
          <HydratedSettings open section={settingsTabs.interface} />
        </UiRoot>
      </LocalStateProvider>,
    );

    const dialog = await screen.findByRole("dialog", { name: "Settings" });

    expect(dialog.dataset.uiPage).toBe("UI-PAGE-008");
    expect(
      within(dialog).getByRole("tab", { name: "Interface" }).getAttribute("aria-selected"),
    ).toBe("true");

    rerender(
      <LocalStateProvider environment={{ storage: null }}>
        <UiRoot responsiveMode={uiResponsiveModes.desktop}>
          <HydratedSettings open={false} section={settingsTabs.interface} />
        </UiRoot>
      </LocalStateProvider>,
    );

    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Settings" })).toBeNull());
    expect(getControllerScope("settings-modal-controller").enabled).toBe(false);
  });

  it("removes only the settings query when a direct-link modal is closed", async () => {
    renderSettings();

    fireEvent.click(await screen.findByRole("button", { name: "Close settings" }));

    const navigation = latestNavigateOptions();

    expect(navigation).toMatchObject({
      href: "/mkxl/catalog?character=scorpion#moves",
      replace: true,
      resetScroll: false,
    });
    expect(typeof navigation.state).toBe("function");
    if (typeof navigation.state === "function") {
      expect(navigation.state({ preserved: "value", settingsModalEntry: true })).toEqual({
        preserved: "value",
        settingsModalEntry: undefined,
      });
    }
    expect(historyBackSpy).not.toHaveBeenCalled();
  });

  it("uses browser history to close a modal opened from the shell", async () => {
    renderSettings(createPersistedState(), { openedFromShell: true });

    fireEvent.click(await screen.findByRole("button", { name: "Close settings" }));

    expect(historyBackSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it("supports Escape and semantic controller Back dismissal", async () => {
    const { unmount } = renderSettings();

    expect(await screen.findByRole("dialog", { name: "Settings" })).toBeTruthy();
    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => expect(navigateSpy).toHaveBeenCalledTimes(1));
    expect(latestNavigateOptions().href).toBe("/mkxl/catalog?character=scorpion#moves");

    unmount();
    navigateSpy.mockReset();
    renderSettings();
    expect(await screen.findByRole("dialog", { name: "Settings" })).toBeTruthy();
    dispatchControllerCommand("settings-modal-controller", knownControllerCommandIds.back);

    expect(latestNavigateOptions().href).toBe("/mkxl/catalog?character=scorpion#moves");
  });

  it("autosaves applied theme, language, and notation selections", async () => {
    const harness = renderSettings();

    expect(await screen.findByRole("heading", { name: "Settings" })).toBeTruthy();
    expect(screen.getByText("Changes save automatically.")).toBeTruthy();
    expect(screen.queryByText("Settings are saved automatically.")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Light" }));
    fireEvent.click(screen.getByRole("button", { name: "Українська" }));

    expect(await screen.findByRole("heading", { name: "Налаштування" })).toBeTruthy();
    expect(document.documentElement.lang).toBe("uk");
    expect(screen.getByRole("button", { name: "Світла" }).dataset.selected).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: notationDisplayModes.PlayStation }));

    await waitFor(() => {
      const settings = PersistedLocalStateSchema.parse(JSON.parse(harness.readStored())).state
        .settings;

      expect(settings.language).toBe(languageCodes.UA);
      expect(settings.notationDisplayMode).toBe(notationDisplayModes.PlayStation);
      expect(settings.themePreference).toBe(themePreferences.light);
    });
    expect(harness.setItem).toHaveBeenCalledTimes(3);
  });

  it("moves logical controller focus through interface rows and confirms the focused option", async () => {
    const harness = renderSettings(createPersistedState(), { controllerFocusVisible: true });

    expect(await screen.findByRole("heading", { name: "Settings" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Close settings" }).dataset.controllerFocused).toBe(
      "true",
    );
    expect(
      getControllerScope("settings-modal-controller").ribbon?.commands.map(({ id }) => id),
    ).toEqual([
      "settings-navigation",
      "settings-confirm",
      "settings-previous-tab",
      "settings-next-tab",
      "settings-back",
    ]);

    dispatchControllerCommand("settings-modal-controller", knownControllerCommandIds.navDown);
    dispatchControllerCommand("settings-modal-controller", knownControllerCommandIds.navDown);
    dispatchControllerCommand("settings-modal-controller", knownControllerCommandIds.navRight);

    const darkOption = screen.getByRole("button", { name: "Dark" });

    expect(darkOption.dataset.controllerFocused).toBe("true");
    expect(darkOption.dataset.selected).toBeUndefined();

    dispatchControllerCommand("settings-modal-controller", knownControllerCommandIds.confirm);

    await waitFor(() => expect(darkOption.dataset.selected).toBe("true"));
    expect(
      PersistedLocalStateSchema.parse(JSON.parse(harness.readStored())).state.settings
        .themePreference,
    ).toBe(themePreferences.dark);
  });

  it("cycles settings sections with shoulder commands", async () => {
    renderSettings(createPersistedState(), { controllerFocusVisible: true });

    expect(await screen.findByRole("heading", { name: "Settings" })).toBeTruthy();
    dispatchControllerCommand("settings-modal-controller", knownControllerCommandIds.nextTab);

    expect(navigateSpy).toHaveBeenCalledWith({
      href: "/mkxl/catalog?character=scorpion&settings=backup#moves",
      replace: true,
      resetScroll: false,
      state: true,
    });
    expect(screen.getByRole("tab", { name: "Game backups" }).dataset.controllerFocused).toBe(
      "true",
    );
  });

  it("uses an exclusive controller scope for backup dialogs and restores page focus", async () => {
    renderBackupSettings(createPersistedState(), { controllerFocusVisible: true });

    expect(await screen.findByRole("heading", { name: "Settings" })).toBeTruthy();
    dispatchControllerCommand("settings-modal-controller", knownControllerCommandIds.navDown);
    dispatchControllerCommand("settings-modal-controller", knownControllerCommandIds.navDown);
    dispatchControllerCommand("settings-modal-controller", knownControllerCommandIds.navDown);

    const exportButton = screen.getByRole("button", { name: "Create backup" });

    expect(exportButton.dataset.controllerFocused).toBe("true");
    dispatchControllerCommand("settings-modal-controller", knownControllerCommandIds.confirm);

    const dialog = await screen.findByRole("dialog", { name: "Create a MKXL backup" });
    const dialogScope = getControllerScope("settings-dialog-controller");

    expect(dialogScope.enabled).toBe(true);
    expect(dialogScope.exclusive).toBe(true);
    expect(dialogScope.ribbon?.shellPolicy).toBe("suppress");
    expect(within(dialog).getByRole("button", { name: "Cancel" }).dataset.controllerFocused).toBe(
      "true",
    );
    expect(exportButton.dataset.controllerFocused).toBeUndefined();

    dispatchControllerCommand("settings-dialog-controller", knownControllerCommandIds.back);

    await waitFor(() =>
      expect(screen.queryByRole("dialog", { name: "Create a MKXL backup" })).toBeNull(),
    );
    expect(exportButton.dataset.controllerFocused).toBe("true");
  });

  it.each([
    {
      current: settingsTabs.interface,
      expectedHref: "/mkxl/catalog?character=scorpion&settings=backup#moves",
      href: "/mkxl/catalog?character=scorpion&settings=interface#moves",
      target: "Game backups",
    },
    {
      current: settingsTabs.backup,
      expectedHref: "/mk1/lists?tag=corner&settings=interface#saved",
      href: "/mk1/lists?tag=corner&settings=backup#saved",
      target: "Interface",
    },
  ] as const)("replace-navigates the current href to the $target settings tab", async (testCase) => {
    renderSettings(createPersistedState(), {
      href: testCase.href,
      section: testCase.current,
    });

    fireEvent.click(await screen.findByRole("tab", { name: testCase.target }));

    expect(navigateSpy).toHaveBeenCalledWith({
      href: testCase.expectedHref,
      replace: true,
      resetScroll: false,
      state: true,
    });
  });

  it("keeps exactly one installed-game backup block expanded", async () => {
    renderBackupSettings();

    const mkxl = await screen.findByRole("button", { name: "MKXL" });
    const mk1 = screen.getByRole("button", { name: "MK1" });

    expect(screen.queryByText(/system file picker/iu)).toBeNull();
    expect(mkxl.getAttribute("aria-expanded")).toBe("true");
    expect(mk1.getAttribute("aria-expanded")).toBe("false");
    expect(mkxl.hasAttribute("data-panel-open")).toBe(true);
    expect(mk1.hasAttribute("data-panel-open")).toBe(false);
    expect(
      mkxl.querySelector<SVGElement>('[data-ui-icon="chevron-down"]')?.getAttribute("class"),
    ).toContain("rotate-180");
    expect(
      mk1.querySelector<SVGElement>('[data-ui-icon="chevron-down"]')?.getAttribute("class"),
    ).not.toContain("rotate-180");

    fireEvent.click(mk1);
    expect(mkxl.getAttribute("aria-expanded")).toBe("false");
    expect(mk1.getAttribute("aria-expanded")).toBe("true");
    expect(mkxl.hasAttribute("data-panel-open")).toBe(false);
    expect(mk1.hasAttribute("data-panel-open")).toBe(true);
    expect(
      mkxl.querySelector<SVGElement>('[data-ui-icon="chevron-down"]')?.getAttribute("class"),
    ).not.toContain("rotate-180");
    expect(
      mk1.querySelector<SVGElement>('[data-ui-icon="chevron-down"]')?.getAttribute("class"),
    ).toContain("rotate-180");
  });

  it("imports a matching backup by replacing only its target game slice", async () => {
    const invalidMkxlSlice = { customCombos: "invalid", namedLists: [], version: 1 };
    const initial = createPersistedState(invalidMkxlSlice);
    const originalMk1 = initial.state.games.mk1;
    const originalSettings = initial.state.settings;
    const harness = renderBackupSettings(initial);
    const replacement = installedGames[0].backup.createEmptySlice();
    const backup = GameBackupEnvelopeSchema.parse({
      exportedAt: "2026-07-14T10:00:00.000Z",
      gameId: "mkxl",
      slice: replacement,
      version: 1,
    });

    fireEvent.click(await screen.findByRole("button", { name: "Restore from backup" }));
    const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');

    if (fileInput === null) {
      throw new Error("Expected the page-owned game backup input.");
    }

    fireEvent.change(fileInput, {
      target: {
        files: [
          {
            lastModified: 1,
            name: "mkxl-backup.json",
            text: async () => JSON.stringify(backup),
          },
        ],
      },
    });

    expect(
      await screen.findByRole("dialog", { name: "Restore MKXL from this backup?" }),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Replace MKXL data" }));

    expect(await screen.findByText("MKXL data restored.")).toBeTruthy();
    const stored = PersistedLocalStateSchema.parse(JSON.parse(harness.readStored()));

    expect(stored.state.games.mkxl).toEqual(replacement);
    expect(stored.state.games.mk1).toEqual(originalMk1);
    expect(stored.state.settings).toEqual(originalSettings);
  });

  it("previews the selected candidate and cancelling does not mutate local state", async () => {
    const initial = createPersistedState();
    const harness = renderBackupSettings(initial);
    const exportedAt = "2026-07-14T12:34:56.000Z";
    const backup = GameBackupEnvelopeSchema.parse({
      exportedAt,
      gameId: "mkxl",
      slice: installedGames[0].backup.createEmptySlice(),
      version: 1,
    });

    fireEvent.click(await screen.findByRole("button", { name: "Restore from backup" }));
    const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');

    if (fileInput === null) {
      throw new Error("Expected the page-owned game backup input.");
    }

    fireEvent.change(fileInput, {
      target: {
        files: [
          {
            lastModified: 3,
            name: "candidate.json",
            text: async () => JSON.stringify(backup),
          },
        ],
      },
    });

    const dialog = await screen.findByRole("dialog", {
      name: "Restore MKXL from this backup?",
    });

    expect(
      within(dialog).getByText(/This backup contains data for one game\. Created:/u),
    ).toBeTruthy();
    expect(within(dialog).queryByText(exportedAt)).toBeNull();
    expect(harness.setItem).not.toHaveBeenCalled();

    fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog", { name: "Restore MKXL from this backup?" })).toBeNull(),
    );
    expect(PersistedLocalStateSchema.parse(JSON.parse(harness.readStored()))).toEqual(initial);
    expect(harness.setItem).not.toHaveBeenCalled();
  });

  it("shows recoverable business warnings in the candidate preview", async () => {
    renderBackupSettings();
    const timestamp = "2026-07-14T12:00:00.000Z";
    const warningSlice = {
      ...installedGames[0].backup.createEmptySlice(),
      namedLists: [
        {
          createdAt: timestamp,
          gameId: "mkxl",
          id: "warning-list",
          items: [
            {
              addedAt: timestamp,
              ref: {
                comboId: "missing-seeded-combo",
                gameId: "mkxl",
                source: "seeded",
              },
            },
          ],
          name: "Warning list",
          updatedAt: timestamp,
        },
      ],
    };
    const backup = GameBackupEnvelopeSchema.parse({
      exportedAt: timestamp,
      gameId: "mkxl",
      slice: warningSlice,
      version: 1,
    });

    fireEvent.click(await screen.findByRole("button", { name: "Restore from backup" }));
    const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');

    if (fileInput === null) {
      throw new Error("Expected the page-owned game backup input.");
    }

    fireEvent.change(fileInput, {
      target: {
        files: [
          {
            lastModified: 4,
            name: "warning.json",
            text: async () => JSON.stringify(backup),
          },
        ],
      },
    });

    const dialog = await screen.findByRole("dialog", {
      name: "Restore MKXL from this backup?",
    });

    expect(
      within(dialog).getByText("Some saved combos or lists may need review after restore."),
    ).toBeTruthy();
    expect(within(dialog).queryByText("MKXL combo reference could not be resolved.")).toBeNull();
    expect(within(dialog).getByRole("button", { name: "Replace MKXL data" })).toHaveProperty(
      "disabled",
      false,
    );

    fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
    await waitFor(() =>
      expect(
        screen.queryByText("Some saved combos or lists may need review after restore."),
      ).toBeNull(),
    );
  });

  it("locks every game disclosure while an import candidate is validating", async () => {
    renderBackupSettings();
    const backup = GameBackupEnvelopeSchema.parse({
      exportedAt: "2026-07-14T10:00:00.000Z",
      gameId: "mkxl",
      slice: installedGames[0].backup.createEmptySlice(),
      version: 1,
    });
    let resolveText: ((value: string) => void) | undefined;
    const text = new Promise<string>((resolve) => {
      resolveText = resolve;
    });

    fireEvent.click(await screen.findByRole("button", { name: "Restore from backup" }));
    const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');

    if (fileInput === null) {
      throw new Error("Expected the page-owned game backup input.");
    }

    fireEvent.change(fileInput, {
      target: {
        files: [{ lastModified: 5, name: "pending.json", text: () => text }],
      },
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "MKXL" }).getAttribute("aria-disabled")).toBe(
        "true",
      );
      expect(screen.getByRole("button", { name: "MK1" }).getAttribute("aria-disabled")).toBe(
        "true",
      );
      expect(screen.getByRole("tab", { name: "Interface" }).getAttribute("aria-disabled")).toBe(
        "true",
      );
      expect(screen.getByRole("tab", { name: "Game backups" }).getAttribute("aria-disabled")).toBe(
        "true",
      );
      expect(screen.getByRole("button", { name: "Close settings" })).toHaveProperty(
        "disabled",
        true,
      );
    });

    expect(blockerSpy.mock.lastCall?.[0]).toMatchObject({
      disabled: false,
      enableBeforeUnload: true,
    });
    fireEvent.keyDown(document, { key: "Escape" });
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(historyBackSpy).not.toHaveBeenCalled();

    await act(async () => resolveText?.(JSON.stringify(backup)));
    const dialog = await screen.findByRole("dialog", {
      name: "Restore MKXL from this backup?",
    });

    fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
  });

  it("reports when an imported replacement can only be kept for the session", async () => {
    const initial = createPersistedState();
    const harness = renderBackupSettings(initial, { failWrites: true });
    const backup = GameBackupEnvelopeSchema.parse({
      exportedAt: "2026-07-14T10:00:00.000Z",
      gameId: "mkxl",
      slice: installedGames[0].backup.createEmptySlice(),
      version: 1,
    });

    fireEvent.click(await screen.findByRole("button", { name: "Restore from backup" }));
    const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');

    if (fileInput === null) {
      throw new Error("Expected the page-owned game backup input.");
    }

    fireEvent.change(fileInput, {
      target: {
        files: [
          {
            lastModified: 6,
            name: "session-only.json",
            text: async () => JSON.stringify(backup),
          },
        ],
      },
    });

    const dialog = await screen.findByRole("dialog", {
      name: "Restore MKXL from this backup?",
    });

    fireEvent.click(within(dialog).getByRole("button", { name: "Replace MKXL data" }));

    expect(await screen.findByText("MKXL data restored.")).toBeTruthy();
    expect(
      screen.getByText(
        "Data restored for now, but it wasn't saved. Create a backup before reloading the page.",
      ),
    ).toBeTruthy();
    expect(PersistedLocalStateSchema.parse(JSON.parse(harness.readStored()))).toEqual(initial);
    expect(harness.setItem).toHaveBeenCalledTimes(1);
  });

  it("rejects a backup for another game without mutating local state", async () => {
    const initial = createPersistedState();
    const harness = renderBackupSettings(initial);
    const wrongGameBackup = GameBackupEnvelopeSchema.parse({
      exportedAt: "2026-07-14T10:00:00.000Z",
      gameId: "mk1",
      slice: installedGames[1].backup.createEmptySlice(),
      version: 1,
    });

    fireEvent.click(await screen.findByRole("button", { name: "Restore from backup" }));
    const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');

    if (fileInput === null) {
      throw new Error("Expected the page-owned game backup input.");
    }

    fireEvent.change(fileInput, {
      target: {
        files: [
          {
            lastModified: 2,
            name: "wrong-game.json",
            text: async () => JSON.stringify(wrongGameBackup),
          },
        ],
      },
    });

    expect(
      await screen.findByText("This backup is for another game. Choose a MKXL backup."),
    ).toBeTruthy();
    expect(screen.queryByRole("dialog", { name: "Restore MKXL from this backup?" })).toBeNull();
    expect(PersistedLocalStateSchema.parse(JSON.parse(harness.readStored()))).toEqual(initial);
    expect(harness.setItem).not.toHaveBeenCalled();

    expect(screen.queryByText("This backup belongs to a different game.")).toBeNull();
  });
});
