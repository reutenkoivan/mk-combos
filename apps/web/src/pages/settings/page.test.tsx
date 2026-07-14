import { GameBackupEnvelopeSchema } from "@mk-combos/contracts/backup/schema";
import { languageCodes, notationDisplayModes } from "@mk-combos/contracts/settings/value";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@mk-combos/contracts/test/unit/react";
import { uiResponsiveModes } from "@mk-combos/ui/components/value";
import { UiRoot } from "@mk-combos/ui/primitives/layout";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LocalStateProvider, useLocalStateObservableState } from "../../app/local-state/provider";
import { PersistedLocalStateSchema } from "../../app/local-state/schema";
import type { LocalStateStorage } from "../../app/local-state/type";
import {
  localStateHydrationStatuses,
  localStateStorageKey,
  localStateStorageVersion,
} from "../../app/local-state/value";
import { installedGames } from "../../game-business/installed-games/value";
import { SettingsPage } from "./page";
import type { SettingsSection } from "./search/type";
import { settingsSections } from "./search/value";

const { navigateSpy } = vi.hoisted(() => ({ navigateSpy: vi.fn() }));

vi.mock("@tanstack/react-router", () => ({ useNavigate: () => navigateSpy }));
vi.mock("../../app/providers/provider", () => ({
  useAppResponsiveMode: () => "desktop",
}));

type SettingsHarness = Readonly<{
  readStored: () => string;
  setItem: ReturnType<typeof vi.fn>;
}>;

type RenderSettingsOptions = Readonly<{
  failWrites?: boolean;
  section?: SettingsSection;
}>;

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
      },
    },
    version: localStateStorageVersion,
  });
}

function HydratedSettings({ section }: Readonly<{ section?: SettingsSection }>) {
  const localState = useLocalStateObservableState();

  if (localState.hydrationStatus !== localStateHydrationStatuses.ready) {
    return null;
  }

  return <SettingsPage section={section} />;
}

function renderSettings(
  initial = createPersistedState(),
  options: RenderSettingsOptions = {},
): SettingsHarness {
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

  render(
    <LocalStateProvider environment={{ storage }}>
      <UiRoot responsiveMode={uiResponsiveModes.desktop}>
        <HydratedSettings section={options.section} />
      </UiRoot>
    </LocalStateProvider>,
  );

  return { readStored: () => stored, setItem };
}

function renderBackupSettings(
  initial = createPersistedState(),
  options: Omit<RenderSettingsOptions, "section"> = {},
): SettingsHarness {
  return renderSettings(initial, { ...options, section: settingsSections.backup });
}

beforeEach(() => {
  navigateSpy.mockReset();
});

describe("SettingsPage", () => {
  it("autosaves applied language and notation selections and updates document language", async () => {
    const harness = renderSettings();

    expect(await screen.findByRole("heading", { name: "Settings" })).toBeTruthy();
    expect(screen.getByText("Changes save automatically.")).toBeTruthy();
    expect(screen.queryByText("Settings are saved automatically.")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Українська" }));

    expect(await screen.findByRole("heading", { name: "Налаштування" })).toBeTruthy();
    expect(document.documentElement.lang).toBe("uk");
    fireEvent.click(screen.getByRole("button", { name: notationDisplayModes.PlayStation }));

    await waitFor(() => {
      const settings = PersistedLocalStateSchema.parse(JSON.parse(harness.readStored())).state
        .settings;

      expect(settings.language).toBe(languageCodes.UA);
      expect(settings.notationDisplayMode).toBe(notationDisplayModes.PlayStation);
    });
    expect(harness.setItem).toHaveBeenCalledTimes(2);
  });

  it.each([
    {
      current: undefined,
      expectedSearch: { section: settingsSections.backup },
      target: "Game backups",
    },
    {
      current: settingsSections.backup,
      expectedSearch: {},
      target: "Interface",
    },
  ] as const)("replace-navigates to the $target settings tab", async (testCase) => {
    renderSettings(createPersistedState(), { section: testCase.current });

    fireEvent.click(await screen.findByRole("tab", { name: testCase.target }));

    expect(navigateSpy).toHaveBeenCalledWith({
      replace: true,
      search: testCase.expectedSearch,
      to: "/settings",
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
    });

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
