import { fireEvent, render, screen, within } from "@mk-combos/contracts/test/unit/react";
import {
  BackupCollapsibleBlock,
  type BackupCollapsibleBlockAction,
  backupCollapsibleBlockActions,
} from "@mk-combos/ui/components/backup-collapsible-block";
import { Breadcrumbs } from "@mk-combos/ui/components/breadcrumbs";
import { ControllerAccessGate } from "@mk-combos/ui/components/controller-access-gate";
import type {
  ControllerConnectionState,
  ControllerHint,
  ControllerHintStripPanelAction,
} from "@mk-combos/ui/components/controller-hint-strip";
import {
  ControllerHintStrip,
  controllerConnectionStates,
  controllerHintStripPanelActions,
  controllerHintStripPresentations,
} from "@mk-combos/ui/components/controller-hint-strip";
import { DisplayModeSwitcher } from "@mk-combos/ui/components/display-mode-switcher";
import {
  ErrorState,
  errorStateActionKinds,
  errorStateSeverities,
} from "@mk-combos/ui/components/error-state";
import {
  ExportDialog,
  type ExportDialogAction,
  exportDialogActions,
} from "@mk-combos/ui/components/export-dialog";
import {
  FirstLaunchSetupForm,
  type FirstLaunchSetupFormAction,
  firstLaunchSetupFormActions,
} from "@mk-combos/ui/components/first-launch-setup-form";
import type {
  GameSwitcherContext,
  GameSwitcherMenuAction,
} from "@mk-combos/ui/components/game-switcher";
import {
  GameSwitcher,
  gameSwitcherContexts,
  gameSwitcherMenuActions,
} from "@mk-combos/ui/components/game-switcher";
import { GlobalTopBar } from "@mk-combos/ui/components/global-top-bar";
import type {
  ImportPreviewActionIntent,
  ImportPreviewDialogAction,
} from "@mk-combos/ui/components/import-preview-dialog";
import {
  ImportPreviewDialog,
  importPreviewDialogActions,
} from "@mk-combos/ui/components/import-preview-dialog";
import { LanguageSwitcher } from "@mk-combos/ui/components/language-switcher";
import {
  NotationLegendTable,
  type NotationLegendTableLayout,
  notationLegendTableLayouts,
} from "@mk-combos/ui/components/notation-legend-table";
import { createActionIntent, createValueIntent } from "@mk-combos/ui/components/runtime";
import {
  BackupLocalStateSummarySchema,
  BackupSliceStatusSchema,
  BackupValidationMessageSchema,
  BackupValidationMessageToneSchema,
  BackupValidationStatusSchema,
  BreadcrumbItemIconSchema,
  BreadcrumbItemSchema,
  ComponentInteractionReasonSchema,
  ControllerAccessStateSchema,
  GameSwitcherOptionSchema,
  ThemePreferenceSwitcherOptionSchema,
  UiResponsiveModeSchema,
} from "@mk-combos/ui/components/schema";
import { ThemePreferenceSwitcher } from "@mk-combos/ui/components/theme-preference-switcher";
import type {
  TopBarDropdownMenuChangeAction,
  TopBarMenuAction,
  TopBarMenuActionTone,
} from "@mk-combos/ui/components/top-bar-dropdown-menu";
import {
  TopBarDropdownMenu,
  topBarDropdownMenuChangeActions,
  topBarMenuActionTones,
} from "@mk-combos/ui/components/top-bar-dropdown-menu";
import type {
  BackupGameSliceSummary,
  BackupOperationState,
  BackupPersistenceMode,
  BackupSliceStatus,
  BackupValidationMessageTone,
  BackupValidationStatus,
  BreadcrumbItemIcon,
  BreadcrumbTarget,
  ComponentActionIntent,
  ComponentIntentBase,
  ComponentOptionStatus,
} from "@mk-combos/ui/components/type";
import {
  backupDisclosureStates,
  backupOperationStates,
  backupPersistenceModes,
  backupSliceStatuses,
  backupValidationMessageTones,
  backupValidationStatuses,
  componentInteractionReasons,
  componentOptionStatuses,
  controllerAccessStates,
  uiResponsiveModes,
} from "@mk-combos/ui/components/value";
import { moveFocus, resolveFocusEntry } from "@mk-combos/ui/focus-navigation/runtime";
import type { UiFocusNavigationScope } from "@mk-combos/ui/focus-navigation/type";
import { createNotationLegendRows } from "@mk-combos/ui/notation/runtime";
import { UiRoot } from "@mk-combos/ui/primitives/layout";
import { describe, expect, it, vi } from "vitest";

const games = [
  { gameId: "mkxl", label: "Mortal Kombat XL", shortLabel: "MKXL", status: "available" },
  { gameId: "future-game", label: "Future Game", status: "available" },
] as const;

const languages = [
  { label: "English", language: "EN", shortLabel: "EN", status: "available" },
  { label: "Українська", language: "UA", shortLabel: "UA", status: "available" },
] as const;

const displayModes = [
  { label: "FGC", mode: "FGC", status: "available" },
  { label: "PlayStation", mode: "PlayStation", shortLabel: "PS", status: "available" },
  { label: "Xbox", mode: "Xbox", shortLabel: "XB", status: "available" },
] as const;

const themeOptions = [
  { label: "Follow system", preference: "system", shortLabel: "System", status: "available" },
  { label: "Dark", preference: "dark", status: "available" },
  { label: "Light", preference: "light", status: "available" },
] as const;

const summary = {
  gameSlices: [{ gameId: "future-game", label: "Future Game", status: "unsupported" }],
  persistenceMode: "persistent",
  settingsSummary: "English · FGC",
} as const;

const gameSwitcherProps = {
  availableGames: games,
  context: "breadcrumbs",
  label: "Choose game",
  menuOpen: false,
  selectedGameId: "mkxl",
  sourceSurface: "test",
} as const;

const acceptsPublicComponentTypes = <
  _Types extends {
    backupAction: BackupCollapsibleBlockAction;
    backupPersistence: BackupPersistenceMode;
    backupOperation: BackupOperationState;
    backupSliceStatus: BackupSliceStatus;
    backupValidationMessageTone: BackupValidationMessageTone;
    backupValidationStatus: BackupValidationStatus;
    breadcrumbItemIcon: BreadcrumbItemIcon;
    breadcrumbTarget: BreadcrumbTarget;
    connection: ControllerConnectionState;
    controllerHintPanelAction: ControllerHintStripPanelAction;
    exportAction: ExportDialogAction;
    firstLaunchAction: FirstLaunchSetupFormAction;
    gameContext: GameSwitcherContext;
    gameSwitcherMenuAction: GameSwitcherMenuAction;
    gameSlice: BackupGameSliceSummary;
    hint: ControllerHint;
    importPreviewAction: ImportPreviewDialogAction;
    intent: ComponentIntentBase;
    menuAction: TopBarMenuAction;
    menuActionTone: TopBarMenuActionTone;
    notationLegendLayout: NotationLegendTableLayout;
    optionStatus: ComponentOptionStatus;
    previewIntent: ImportPreviewActionIntent;
    topBarMenuChangeAction: TopBarDropdownMenuChangeAction;
  },
>() => true;

describe("shell and settings component contracts", () => {
  it("keeps GameId open and schemas strict", () => {
    expect(GameSwitcherOptionSchema.parse(games[1]).gameId).toBe("future-game");
    expect(() => GameSwitcherOptionSchema.parse({ ...games[0], extra: true })).toThrow();
    expect(
      BreadcrumbItemSchema.parse({
        current: true,
        disabled: false,
        icon: { fallbackLabel: "CA", src: "/catalog.svg" },
        id: "catalog",
        kind: "future-kind",
        label: "Catalog",
      }).kind,
    ).toBe("future-kind");
    expect(
      BreadcrumbItemIconSchema.safeParse({ fallbackLabel: "SC", src: "/scorpion.svg", x: true })
        .success,
    ).toBe(false);
    expect(BackupLocalStateSummarySchema.parse(summary).gameSlices[0]?.status).toBe("unsupported");
    expect(BackupSliceStatusSchema.parse("unsupported")).toBe("unsupported");
    expect(BackupValidationStatusSchema.parse("warning")).toBe("warning");
    expect(BackupValidationMessageToneSchema.parse(backupValidationMessageTones.warning)).toBe(
      backupValidationMessageTones.warning,
    );
    expect(BackupValidationMessageToneSchema.safeParse("success").success).toBe(false);
    expect(UiResponsiveModeSchema.parse("tablet")).toBe("tablet");
    expect(ComponentInteractionReasonSchema.parse("swipe")).toBe("swipe");
    expect(ComponentInteractionReasonSchema.parse("closeWatcher")).toBe("closeWatcher");
    expect(ControllerAccessStateSchema.parse("awaitingNeutral")).toBe("awaitingNeutral");
    expect(ThemePreferenceSwitcherOptionSchema.parse(themeOptions[0]).preference).toBe("system");
    expect(
      ThemePreferenceSwitcherOptionSchema.safeParse({ ...themeOptions[0], rawMediaQuery: true })
        .success,
    ).toBe(false);
    expect(
      BackupValidationMessageSchema.parse({
        gameId: "future-game",
        message: "Unknown slice",
        tone: "warning",
      }),
    ).toEqual({ gameId: "future-game", message: "Unknown slice", tone: "warning" });
    expect(
      acceptsPublicComponentTypes<{
        backupAction: "expand";
        backupPersistence: "persistent";
        backupOperation: "idle";
        backupSliceStatus: "ready";
        backupValidationMessageTone: "warning";
        backupValidationStatus: "valid";
        breadcrumbItemIcon: { fallbackLabel: "SC"; src: "/scorpion.svg" };
        breadcrumbTarget: { surfaceCode: "UI-PAGE-003" };
        connection: "connected";
        controllerHintPanelAction: "open";
        exportAction: "confirmExport";
        firstLaunchAction: "confirm";
        gameContext: "breadcrumbs";
        gameSwitcherMenuAction: "open";
        gameSlice: { gameId: "future-game"; label: "Future"; status: "unsupported" };
        hint: { commandId: "open"; inputLabel: "A"; label: "Open" };
        importPreviewAction: "confirmReplace";
        intent: { reason: "press"; sourceSurface: "settings" };
        menuAction: { available: true; id: "settings"; label: "Settings" };
        menuActionTone: "destructive";
        notationLegendLayout: "compact";
        optionStatus: "available";
        previewIntent: {
          action: "confirmReplace";
          backupCandidateId: "candidate-1";
          reason: "press";
          sourceSurface: "settings";
        };
        topBarMenuChangeAction: "close";
      }>(),
    ).toBe(true);
  });

  it("exports the documented component surface and helpers", () => {
    expect(
      [
        BackupCollapsibleBlock,
        Breadcrumbs,
        ControllerHintStrip,
        ControllerAccessGate,
        DisplayModeSwitcher,
        ExportDialog,
        FirstLaunchSetupForm,
        GameSwitcher,
        GlobalTopBar,
        ImportPreviewDialog,
        LanguageSwitcher,
        NotationLegendTable,
        ThemePreferenceSwitcher,
        TopBarDropdownMenu,
      ].every((component) => typeof component === "function"),
    ).toBe(true);
    expect(backupCollapsibleBlockActions).toEqual({
      collapse: "collapse",
      expand: "expand",
      export: "export",
      openFilePicker: "openFilePicker",
    });
    expect(controllerHintStripPanelActions).toEqual({ close: "close", open: "open" });
    expect(controllerConnectionStates).toEqual({
      connected: "connected",
      disconnected: "disconnected",
    });
    expect(exportDialogActions).toEqual({
      cancelExport: "cancelExport",
      close: "close",
      confirmExport: "confirmExport",
    });
    expect(firstLaunchSetupFormActions).toEqual({
      acknowledgeSessionOnly: "acknowledgeSessionOnly",
      confirm: "confirm",
    });
    expect(gameSwitcherMenuActions).toEqual({ close: "close", open: "open" });
    expect(gameSwitcherContexts).toEqual({
      breadcrumbs: "breadcrumbs",
      firstLaunch: "firstLaunch",
    });
    expect(importPreviewDialogActions).toEqual({
      cancelImport: "cancelImport",
      close: "close",
      confirmReplace: "confirmReplace",
      retryFileSelection: "retryFileSelection",
    });
    expect(topBarDropdownMenuChangeActions).toEqual({ close: "close", open: "open" });
    expect(topBarMenuActionTones).toEqual({ destructive: "destructive", neutral: "neutral" });
    expect(notationLegendTableLayouts).toEqual({
      compact: "compact",
      stacked: "stacked",
      table: "table",
    });
    expect(backupDisclosureStates).toEqual({ collapsed: "collapsed", expanded: "expanded" });
    expect(backupOperationStates).toEqual({
      exporting: "exporting",
      idle: "idle",
      importComplete: "importComplete",
      importFilePicker: "importFilePicker",
      importInvalid: "importInvalid",
      importPreview: "importPreview",
      importValidating: "importValidating",
      replaceBusy: "replaceBusy",
      replaceConfirm: "replaceConfirm",
    });
    expect(backupPersistenceModes).toEqual({
      persistent: "persistent",
      sessionOnly: "sessionOnly",
      unavailable: "unavailable",
    });
    expect(backupSliceStatuses).toEqual({
      invalid: "invalid",
      missing: "missing",
      ready: "ready",
      unsupported: "unsupported",
    });
    expect(backupValidationStatuses).toEqual({
      invalid: "invalid",
      none: "none",
      valid: "valid",
      warning: "warning",
    });
    expect(backupValidationMessageTones).toEqual({
      destructive: "destructive",
      neutral: "neutral",
      warning: "warning",
    });
    expect(componentOptionStatuses).toEqual({
      available: "available",
      disabledUnavailable: "disabledUnavailable",
    });
    expect(controllerAccessStates).toEqual({
      awaitingGesture: "awaitingGesture",
      awaitingNeutral: "awaitingNeutral",
      blocked: "blocked",
      checking: "checking",
      disconnected: "disconnected",
      ready: "ready",
      suspended: "suspended",
      unsupported: "unsupported",
    });
    expect(uiResponsiveModes).toEqual({ desktop: "desktop", mobile: "mobile", tablet: "tablet" });
    expect(componentInteractionReasons).toEqual({
      closePress: "closePress",
      closeWatcher: "closeWatcher",
      escapeKey: "escapeKey",
      focusOut: "focusOut",
      imperativeAction: "imperativeAction",
      inputChange: "inputChange",
      itemPress: "itemPress",
      listNavigation: "listNavigation",
      none: "none",
      outsidePress: "outsidePress",
      press: "press",
      swipe: "swipe",
      triggerFocus: "triggerFocus",
      triggerHover: "triggerHover",
      triggerPress: "triggerPress",
    });
    expect(
      createActionIntent({ action: "save", reason: "press", sourceSurface: "settings" }),
    ).toEqual({
      action: "save",
      reason: "press",
      sourceSurface: "settings",
    });
    expect(
      createValueIntent({ reason: "itemPress", sourceSurface: "shell", value: "future-game" }),
    ).toEqual({
      reason: "itemPress",
      sourceSurface: "shell",
      value: "future-game",
    });
  });

  it("derives backup busy and disclosure blocking behavior from every operation state", () => {
    for (const operationState of Object.values(backupOperationStates)) {
      const expectedBusy =
        operationState !== backupOperationStates.idle &&
        operationState !== backupOperationStates.importComplete;
      const expectedBlocking =
        operationState !== backupOperationStates.idle &&
        operationState !== backupOperationStates.importComplete &&
        operationState !== backupOperationStates.importInvalid;
      const view = render(
        <BackupCollapsibleBlock
          title="Backup"
          sourceSurface="test"
          exportLabel="Export backup"
          importLabel="Import backup"
          localStateSummary={summary}
          operationState={operationState}
          exportAvailability={{ available: true }}
          importAvailability={{ available: true }}
          sourceFocusTarget="backup-future-game"
          disclosureState={backupDisclosureStates.expanded}
          validationResult={{ status: backupValidationStatuses.none }}
        />,
      );

      expect(screen.getByRole("button", { name: "Export backup" })).toHaveProperty(
        "disabled",
        expectedBusy,
      );
      expect(screen.getByRole("button", { name: "Import backup" })).toHaveProperty(
        "disabled",
        expectedBusy,
      );
      expect(screen.getByRole("button", { name: "Backup" }).getAttribute("aria-disabled")).toBe(
        expectedBlocking ? "true" : "false",
      );
      expect(
        screen.getByRole("button", { name: "Backup" }).getAttribute("data-ui-focus-target"),
      ).toBe("backup-future-game");
      expect(screen.getByRole("button", { name: "Backup" }).textContent).toContain(
        summary.settingsSummary,
      );
      expect(
        document.getElementById(
          screen.getByRole("button", { name: "Backup" }).getAttribute("aria-describedby") ?? "",
        )?.textContent,
      ).toBe(summary.settingsSummary);
      expect(screen.queryByText("External input required")).toBeNull();
      view.unmount();
    }
  });
});

describe("controlled selectors", () => {
  it("renders a labelled semantic first-launch form with one current submit action", () => {
    const onAction = vi.fn();
    const { container, rerender } = render(
      <FirstLaunchSetupForm
        confirmAvailable
        title="Your preferences"
        onRequestAction={onAction}
        confirmLabel="Open catalog"
        sourceSurface="first-launch"
        sourceFocusTarget="first-launch-submit"
        controllerFocusedAction={firstLaunchSetupFormActions.confirm}
        languageSwitcher={{
          availableLanguages: languages,
          label: "Interface language",
          selectedLanguage: "EN",
          sourceSurface: "first-launch",
        }}
        displayModeSwitcher={{
          availableDisplayModes: displayModes,
          label: "Button labels",
          selectedDisplayMode: "FGC",
          sourceSurface: "first-launch",
        }}
        notationLegend={{
          caption: "Preview",
          legendRows: createNotationLegendRows(["FGC"]),
          markersHeaderLabel: "Buttons",
          modeHeaderLabel: "Format",
        }}
        gameSwitcher={{
          availableGames: games,
          context: gameSwitcherContexts.firstLaunch,
          label: "Starting game",
          menuOpen: false,
          selectedGameId: "mkxl",
          sourceSurface: "first-launch",
        }}
      />,
    );

    const form = container.querySelector("form");

    expect(form).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Your preferences" })).toBeTruthy();
    expect(screen.getByText("Starting game")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Starting game" })).toBeTruthy();
    expect(screen.getAllByRole("button", { name: /Open catalog/ })).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Open catalog" }).getAttribute("type")).toBe(
      "submit",
    );
    expect(screen.getByRole("button", { name: "Open catalog" }).className).toContain(
      "bg-(--ui-accent)",
    );
    expect(
      screen.getByRole("button", { name: "Open catalog" }).getAttribute("data-controller-focused"),
    ).toBe("true");
    expect(
      screen.getByRole("button", { name: "Open catalog" }).getAttribute("data-ui-focus-target"),
    ).toBe("first-launch-submit");

    fireEvent.submit(form as HTMLFormElement);
    expect(onAction).toHaveBeenLastCalledWith({
      action: firstLaunchSetupFormActions.confirm,
      reason: "press",
      sourceFocusTarget: "first-launch-submit",
      sourceSurface: "first-launch",
    });

    rerender(
      <FirstLaunchSetupForm
        confirmAvailable
        title="Your preferences"
        onRequestAction={onAction}
        confirmLabel="Open catalog"
        sourceSurface="first-launch"
        sourceFocusTarget="first-launch-submit"
        persistenceMessage="These settings cannot be saved."
        sessionOnlyAcknowledgeLabel="Continue without saving"
        languageSwitcher={{
          availableLanguages: languages,
          label: "Interface language",
          selectedLanguage: "EN",
          sourceSurface: "first-launch",
        }}
        displayModeSwitcher={{
          availableDisplayModes: displayModes,
          label: "Button labels",
          selectedDisplayMode: "FGC",
          sourceSurface: "first-launch",
        }}
        notationLegend={{
          caption: "Preview",
          legendRows: createNotationLegendRows(["FGC"]),
          markersHeaderLabel: "Buttons",
          modeHeaderLabel: "Format",
        }}
        gameSwitcher={{
          availableGames: games,
          context: gameSwitcherContexts.firstLaunch,
          label: "Starting game",
          menuOpen: false,
          selectedGameId: "mkxl",
          sourceSurface: "first-launch",
        }}
      />,
    );

    expect(screen.queryByRole("button", { name: "Open catalog" })).toBeNull();
    expect(screen.getAllByRole("button", { name: "Continue without saving" })).toHaveLength(1);
    fireEvent.submit(container.querySelector("form") as HTMLFormElement);
    expect(onAction).toHaveBeenLastCalledWith({
      action: firstLaunchSetupFormActions.acknowledgeSessionOnly,
      reason: "press",
      sourceFocusTarget: "first-launch-submit",
      sourceSurface: "first-launch",
    });
  });

  it("emits a semantic language selection without a browser event", () => {
    const onSelect = vi.fn();
    render(
      <LanguageSwitcher
        label="Language"
        selectedLanguage="EN"
        sourceSurface="settings"
        availableLanguages={languages}
        controllerFocusedLanguage="UA"
        onRequestSelectLanguage={onSelect}
        sourceFocusTarget="language-control"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Українська" }));

    expect(
      screen.getByRole("button", { name: "Українська" }).getAttribute("data-controller-focused"),
    ).toBe("true");
    expect(
      screen.getByRole("button", { name: "Українська" }).getAttribute("data-ui-focus-target"),
    ).toBe("language-control:UA");

    expect(onSelect).toHaveBeenCalledWith({
      reason: "none",
      sourceFocusTarget: "language-control",
      sourceSurface: "settings",
      value: "UA",
    });
  });

  it("renders display mode validation as an associated invalid state", () => {
    render(
      <DisplayModeSwitcher
        label="Display mode"
        sourceSurface="settings"
        selectedDisplayMode="FGC"
        invalidSelectedDisplayMode
        availableDisplayModes={displayModes}
        controllerFocusedDisplayMode="PlayStation"
        validationMessage="Unsupported display mode"
      />,
    );

    expect(screen.getByRole("alert").textContent).toContain("Unsupported display mode");
    expect(screen.getByRole("group", { name: "Display mode" }).getAttribute("aria-invalid")).toBe(
      "true",
    );
    expect(
      screen.getByRole("button", { name: "PlayStation" }).getAttribute("data-controller-focused"),
    ).toBe("true");
  });

  it("emits a controlled system, dark, or light theme preference", () => {
    const onSelect = vi.fn();
    render(
      <ThemePreferenceSwitcher
        label="Theme"
        sourceSurface="settings"
        selectedThemePreference="system"
        sourceFocusTarget="theme-control"
        controllerFocusedThemePreference="dark"
        availableThemePreferences={themeOptions}
        onRequestSelectThemePreference={onSelect}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Dark" }));
    expect(
      screen.getByRole("button", { name: "Dark" }).getAttribute("data-controller-focused"),
    ).toBe("true");
    expect(onSelect).toHaveBeenCalledWith({
      reason: "none",
      sourceFocusTarget: "theme-control",
      sourceSurface: "settings",
      value: "dark",
    });
  });
});

describe("responsive shell composition", () => {
  const breadcrumbItems = [
    {
      current: false,
      disabled: false,
      id: "catalog",
      kind: "catalog",
      label: "Catalog",
      target: { surfaceCode: "UI-PAGE-003" },
    },
    {
      current: true,
      disabled: false,
      id: "settings",
      kind: "settings",
      label: "Settings",
    },
  ] as const;

  it("mounts inline breadcrumbs in tablet and desktop modes", () => {
    const { container, rerender } = render(
      <Breadcrumbs
        layoutMode="mobile"
        sourceSurface="shell"
        ariaLabel="Breadcrumbs"
        items={breadcrumbItems}
        gameSwitcher={gameSwitcherProps}
      />,
    );

    expect(container.innerHTML).toBe("");

    rerender(
      <Breadcrumbs
        layoutMode="tablet"
        sourceSurface="shell"
        ariaLabel="Breadcrumbs"
        items={breadcrumbItems}
        gameSwitcher={gameSwitcherProps}
      />,
    );
    const tabletBreadcrumbs = screen.getByRole("navigation", { name: "Breadcrumbs" });
    const tabletTrail = tabletBreadcrumbs.querySelector("ol");
    const tabletGameCrumb = screen.getByRole("button", { name: "Choose game" });
    const tabletCatalogCrumb = screen.getByRole("button", { name: "Catalog" });
    const tabletGameItem = tabletGameCrumb.closest("li");

    expect(tabletBreadcrumbs.className).not.toContain("overflow-hidden");
    expect(tabletBreadcrumbs.getAttribute("data-breadcrumb-compact-controls")).toBe("true");
    expect(tabletTrail?.className).not.toContain("overflow-hidden");
    expect(tabletGameItem?.className).toContain("items-center");
    expect(tabletGameItem?.className).toContain("shrink-0");
    expect(tabletGameCrumb.className.split(" ")).toContain("h-7");
    expect(tabletGameCrumb.className.split(" ")).toContain("shrink-0");
    expect(tabletCatalogCrumb.className.split(" ")).toContain("min-w-0");
    expect(tabletCatalogCrumb.className.split(" ")).toContain("shrink");
    expect(screen.getByText("Settings").closest('[aria-current="page"]')).toBeTruthy();

    const tabletBreadcrumbClasses = tabletBreadcrumbs.className;
    const tabletGameCrumbClasses = tabletGameCrumb.className;

    rerender(
      <Breadcrumbs
        layoutMode="desktop"
        sourceSurface="shell"
        ariaLabel="Breadcrumbs"
        items={breadcrumbItems}
        gameSwitcher={gameSwitcherProps}
      />,
    );
    const breadcrumbs = screen.getByRole("navigation", { name: "Breadcrumbs" });
    const separators = Array.from(
      breadcrumbs.querySelectorAll<HTMLElement>("[data-breadcrumb-separator]"),
    );

    expect(breadcrumbs).toBeTruthy();
    expect(breadcrumbs.className).toBe(tabletBreadcrumbClasses);
    expect(breadcrumbs.className).toContain("[--ui-focus-ring:inset_0_0_0_2px_var(--ui-accent)]");
    const catalogCrumb = screen.getByRole("button", { name: "Catalog" });
    const gameCrumb = screen.getByRole("button", { name: "Choose game" });

    expect(gameCrumb.className).toBe(tabletGameCrumbClasses);

    for (const interactiveCrumb of [gameCrumb, catalogCrumb]) {
      expect(interactiveCrumb.className).toContain("border-transparent");
      expect(interactiveCrumb.className).toContain("bg-transparent");
      expect(interactiveCrumb.className).toContain("shadow-none");
    }
    expect(separators).toHaveLength(breadcrumbItems.length);
    expect(separators.every((separator) => separator.textContent?.trim() === "/")).toBe(true);
    expect(separators.every((separator) => separator.getAttribute("aria-hidden") === "true")).toBe(
      true,
    );
  });

  it("renders image and fallback icons with breadcrumb labels", () => {
    const { container } = render(
      <Breadcrumbs
        layoutMode="desktop"
        sourceSurface="shell"
        ariaLabel="Breadcrumbs"
        gameSwitcher={gameSwitcherProps}
        items={[
          {
            current: false,
            disabled: false,
            icon: { fallbackLabel: "SC", src: "/scorpion.svg" },
            id: "character",
            kind: "character",
            label: "Scorpion",
            target: { surfaceCode: "UI-PAGE-003" },
          },
          {
            current: true,
            disabled: false,
            icon: { fallbackLabel: "NI" },
            id: "variation",
            kind: "variation",
            label: "Ninjutsu",
          },
        ]}
      />,
    );
    const icons = container.querySelectorAll("[data-breadcrumb-icon]");
    const image = container.querySelector("[data-breadcrumb-icon] img");
    const currentCrumb = screen.getByText("Ninjutsu").closest('[aria-current="page"]');
    const separators = container.querySelectorAll("[data-breadcrumb-separator]");

    expect(icons).toHaveLength(2);
    expect(Array.from(icons).every((icon) => icon.className.includes("h-6 w-6"))).toBe(true);
    expect(Array.from(icons).every((icon) => !icon.className.includes("h-7 w-7"))).toBe(true);
    expect(image?.getAttribute("src")).toBe("/scorpion.svg");
    expect(image?.getAttribute("alt")).toBe("");
    expect(container.querySelector("[data-breadcrumb-icon-fallback]")?.textContent).toBe("NI");
    expect(screen.getByRole("button", { name: "Scorpion" })).toBeTruthy();
    expect(currentCrumb?.className).toContain("h-7");
    expect(Array.from(separators).every((separator) => separator.className.includes("h-7"))).toBe(
      true,
    );
  });

  it("renders desktop-style inline breadcrumbs in tablet top bars", () => {
    render(
      <GlobalTopBar
        layoutMode="tablet"
        menu={{
          actions: [],
          label: "Open global menu",
          layoutMode: "tablet",
          open: false,
          sourceSurface: "shell",
        }}
        breadcrumbs={{
          ariaLabel: "Breadcrumbs",
          gameSwitcher: gameSwitcherProps,
          items: breadcrumbItems,
          layoutMode: "tablet",
          sourceSurface: "shell",
        }}
      />,
    );

    expect(screen.getByRole("navigation", { name: "Breadcrumbs" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Choose game" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Catalog" })).toBeTruthy();
    expect(screen.getByText("Settings").closest('[aria-current="page"]')).toBeTruthy();
  });

  it("renders only current-location identity inline in mobile top bars", () => {
    render(
      <GlobalTopBar
        layoutMode="mobile"
        menu={{
          actions: [],
          label: "Open global menu",
          layoutMode: "mobile",
          open: false,
          sourceSurface: "shell",
        }}
        breadcrumbs={{
          ariaLabel: "Breadcrumbs",
          gameSwitcher: gameSwitcherProps,
          items: breadcrumbItems,
          layoutMode: "mobile",
          sourceSurface: "shell",
        }}
      />,
    );

    expect(screen.queryByRole("navigation", { name: "Breadcrumbs" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Choose game" })).toBeNull();
    expect(screen.getByText("Settings").closest('[aria-current="page"]')).toBeTruthy();
  });

  it("renders mobile navigation in a drawer without duplicate Catalog actions", () => {
    const onAction = vi.fn();
    const onMenuChange = vi.fn();

    render(
      <TopBarDropdownMenu
        open
        layoutMode="mobile"
        sourceSurface="shell"
        label="Open global menu"
        onRequestAction={onAction}
        breadcrumbs={breadcrumbItems}
        sourceFocusTarget="global-menu"
        onRequestMenuChange={onMenuChange}
        responsiveNavigationLabel="Navigation"
        responsiveCloseLabel="Close navigation"
        responsiveGameSwitcher={gameSwitcherProps}
        actions={[
          { available: true, id: "catalog", label: "Catalog" },
          { available: true, id: "lists", label: "Named Lists" },
        ]}
      />,
    );

    expect(screen.getByRole("dialog", { name: "Navigation" })).toBeTruthy();
    expect(document.querySelector("[data-ui-drawer-backdrop]")).toBeTruthy();
    const gameCrumb = screen.getByRole("button", { name: "Choose game" });
    const catalogCrumb = screen.getByRole("button", { name: "Catalog" });

    expect(screen.getAllByRole("button", { name: "Choose game" })).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: "Catalog" })).toHaveLength(1);
    for (const interactiveCrumb of [gameCrumb, catalogCrumb]) {
      expect(interactiveCrumb.className).toContain("border-transparent");
      expect(interactiveCrumb.className).toContain("bg-transparent");
      expect(interactiveCrumb.className).toContain("shadow-none");
    }
    const currentItem = screen.getByText("Settings").closest('[aria-current="page"]');
    const actionItem = screen.getByRole("button", { name: "Named Lists" });

    expect(currentItem).toBeTruthy();
    expect(currentItem?.getAttribute("data-disabled")).toBeNull();
    expect(currentItem?.className).not.toContain("cursor-pointer");
    expect(currentItem?.className).not.toContain("hover:");
    expect(actionItem.className).toContain("cursor-pointer");
    expect(actionItem.className).toContain("hover:bg");

    fireEvent.click(catalogCrumb);

    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledWith({
      action: "breadcrumb:catalog",
      reason: "itemPress",
      sourceFocusTarget: "global-menu",
      sourceSurface: "shell",
    });
    expect(onMenuChange).toHaveBeenCalledWith({
      action: topBarDropdownMenuChangeActions.close,
      reason: "closePress",
      sourceFocusTarget: "global-menu",
      sourceSurface: "shell",
    });
  });

  it("keeps the tablet drawer global-only beside inline breadcrumbs", () => {
    render(
      <GlobalTopBar
        layoutMode="tablet"
        breadcrumbs={{
          ariaLabel: "Breadcrumbs",
          gameSwitcher: gameSwitcherProps,
          items: breadcrumbItems,
          layoutMode: "tablet",
          sourceSurface: "shell",
        }}
        menu={{
          actions: [
            { available: true, id: "catalog", label: "Catalog" },
            { available: true, id: "lists", label: "Named Lists" },
            { available: true, id: "builder", label: "Builder" },
          ],
          breadcrumbs: breadcrumbItems,
          label: "Open global menu",
          layoutMode: "tablet",
          open: true,
          responsiveCloseLabel: "Close navigation",
          responsiveGameSwitcher: gameSwitcherProps,
          responsiveNavigationLabel: "Navigation",
          sourceSurface: "shell",
        }}
      />,
    );

    const breadcrumbs = screen.getByRole("navigation", { hidden: true, name: "Breadcrumbs" });
    const drawer = screen.getByRole("dialog", { name: "Navigation" });

    expect(
      within(breadcrumbs).getByRole("button", { hidden: true, name: "Choose game" }),
    ).toBeTruthy();
    expect(within(breadcrumbs).getByRole("button", { hidden: true, name: "Catalog" })).toBeTruthy();
    expect(within(drawer).queryByRole("button", { name: "Choose game" })).toBeNull();
    expect(within(drawer).queryByRole("button", { name: "Catalog" })).toBeNull();
    expect(within(drawer).queryByText("Settings")).toBeNull();
    expect(within(drawer).getByRole("button", { name: "Named Lists" })).toBeTruthy();
    expect(within(drawer).getByRole("button", { name: "Builder" })).toBeTruthy();
  });

  it("hides controller hints without a connection or grace state", () => {
    const { container } = render(
      <ControllerHintStrip
        hints={[]}
        panelOpen={false}
        sourceSurface="shell"
        hasRecentDisconnect={false}
        connectionState="disconnected"
        label="Controller disconnected"
      />,
    );

    expect(container.innerHTML).toBe("");
  });

  it("renders the connected controller trigger as one icon without visible status chrome", () => {
    render(
      <ControllerHintStrip
        hints={[]}
        panelOpen={false}
        sourceSurface="shell"
        connectionState="connected"
        hasRecentDisconnect={false}
        label="Controller connected"
        profileLabel="Xbox Controller"
      />,
    );

    const trigger = screen.getByRole("button", { name: "Controller connected" });

    expect(trigger.querySelectorAll("svg")).toHaveLength(1);
    expect(trigger.textContent).toBe("");
    expect(trigger.getAttribute("data-connection-state")).toBe("connected");
    expect(trigger.getAttribute("data-panel-state")).toBe("closed");
    expect(trigger.className).toContain("border-transparent");
    expect(trigger.className).toContain("bg-transparent");
    expect(trigger.className).toContain("shadow-none");
    expect(screen.queryByText("Xbox Controller")).toBeNull();
  });

  it("renders every prepared command in the sticky command ribbon presentation", () => {
    const { container } = render(
      <ControllerHintStrip
        panelOpen={false}
        layoutMode="mobile"
        sourceSurface="catalog"
        connectionState="connected"
        hasRecentDisconnect={false}
        label="Controller connected"
        presentation={controllerHintStripPresentations.commandRibbon}
        hints={[
          { commandId: "navigate", inputLabel: "D-PAD", label: "Navigate" },
          { commandId: "select", inputLabel: "A", label: "Select" },
          { commandId: "back", inputLabel: "B", label: "Back" },
          { commandId: "filters", inputLabel: "Y", label: "Filters" },
        ]}
      />,
    );

    const ribbon = container.querySelector('[data-presentation="commandRibbon"]');
    expect(ribbon?.className).toContain("sticky");
    expect(ribbon?.className).toContain("rounded-none");
    expect(screen.getByText("Navigate")).toBeTruthy();
    expect(screen.getByText("Select")).toBeTruthy();
    expect(screen.getByText("Back")).toBeTruthy();
    expect(screen.getByText("Filters")).toBeTruthy();
  });

  it("renders the global menu icon trigger without a surface underlay", () => {
    render(
      <TopBarDropdownMenu
        actions={[]}
        open={false}
        layoutMode="desktop"
        sourceSurface="shell"
        label="Open global menu"
      />,
    );

    const trigger = screen.getByRole("button", { name: "Open global menu" });

    expect(trigger.className).toContain("border-transparent");
    expect(trigger.className).toContain("bg-transparent");
    expect(trigger.className).toContain("shadow-none");
  });

  it("keeps desktop navigation in an anchored menu", () => {
    render(
      <TopBarDropdownMenu
        open
        layoutMode="desktop"
        sourceSurface="shell"
        label="Open global menu"
        actions={[{ available: true, id: "settings", label: "Settings" }]}
      />,
    );

    expect(screen.getByRole("menu", { name: "Open global menu" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Settings" })).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("uses a dashed icon for disconnect grace without adding another indicator", () => {
    render(
      <ControllerHintStrip
        hints={[]}
        panelOpen={false}
        hasRecentDisconnect
        sourceSurface="shell"
        connectionState="disconnected"
        label="Controller recently disconnected"
      />,
    );

    const trigger = screen.getByRole("button", { name: "Controller recently disconnected" });
    const icon = trigger.querySelector("svg");

    expect(trigger.querySelectorAll("svg")).toHaveLength(1);
    expect(trigger.getAttribute("data-connection-state")).toBe("disconnected");
    expect(icon?.getAttribute("stroke-dasharray")).toBe("3 2");
  });

  it("moves profile and connection copy into the controlled opened popover", () => {
    const onPanelChange = vi.fn();
    render(
      <ControllerHintStrip
        panelOpen
        sourceSurface="shell"
        connectionState="connected"
        hasRecentDisconnect={false}
        label="Controller connected"
        profileLabel="Xbox Controller"
        onRequestHintPanelChange={onPanelChange}
        sourceFocusTarget="controller-indicator"
        hints={[
          { commandId: "open", inputLabel: "A", label: "Open" },
          { commandId: "back", inputLabel: "B", label: "Back" },
        ]}
      />,
    );

    const trigger = screen.getByRole("button", { name: "Controller connected" });
    const dialog = screen.getByRole("dialog", { name: "Xbox Controller" });
    const hintLabels = Array.from(dialog.querySelectorAll("li")).map((item) => item.textContent);

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.getAttribute("data-panel-state")).toBe("open");
    expect(dialog.textContent).toContain("Controller connected");
    expect(hintLabels).toEqual(["AOpen", "BBack"]);

    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(onPanelChange).toHaveBeenCalledWith({
      action: controllerHintStripPanelActions.close,
      reason: "escapeKey",
      sourceFocusTarget: "controller-indicator",
      sourceSurface: "shell",
    });
  });

  it("renders a blocking controller capability gate until ready", () => {
    const { rerender } = render(
      <ControllerAccessGate
        layoutMode="mobile"
        state="awaitingGesture"
        title="Controller required"
        statusLabel="Press any controller button"
        description="Use a connected controller to continue."
      />,
    );

    expect(screen.getByRole("dialog", { name: "Controller required" })).toBeTruthy();

    rerender(
      <ControllerAccessGate
        state="ready"
        description="Ready"
        layoutMode="mobile"
        statusLabel="Ready"
        title="Controller required"
      />,
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("controller focus navigation", () => {
  const scope = {
    availableCommandIds: ["navDown", "confirm"],
    entryTargetId: "first",
    fallbackTargetId: "first",
    id: "settings",
    targets: [
      { id: "first", neighbors: { down: "disabled" } },
      { disabled: true, id: "disabled", neighbors: { down: "last", up: "first" } },
      { id: "last", neighbors: { up: "disabled" } },
    ],
  } satisfies UiFocusNavigationScope;

  it("resolves deterministic entry and skips disabled targets", () => {
    expect(resolveFocusEntry(scope)).toBe("first");
    expect(moveFocus(scope, "first", "down")).toBe("last");
    expect(moveFocus(scope, "last", "down")).toBe("last");
  });

  it("keeps prepared focus logical while a parent focus boundary hides every marker", () => {
    const view = render(
      <UiRoot controllerFocusVisible={false}>
        <LanguageSwitcher
          selectedLanguage="EN"
          sourceSurface="settings"
          label="Hidden language focus"
          availableLanguages={languages}
          controllerFocusedLanguage="UA"
        />
        <GameSwitcher
          {...gameSwitcherProps}
          menuOpen
          controllerFocused
          controllerFocusedGameId="future-game"
        />
        <FirstLaunchSetupForm
          confirmAvailable
          sourceSurface="first-launch"
          confirmLabel="Hidden submit focus"
          controllerFocusedAction={firstLaunchSetupFormActions.confirm}
          gameSwitcher={{
            ...gameSwitcherProps,
            context: gameSwitcherContexts.firstLaunch,
            label: "Starting game",
          }}
          languageSwitcher={{
            availableLanguages: languages,
            label: "Interface language",
            selectedLanguage: "EN",
            sourceSurface: "first-launch",
          }}
          displayModeSwitcher={{
            availableDisplayModes: displayModes,
            label: "Button labels",
            selectedDisplayMode: "FGC",
            sourceSurface: "first-launch",
          }}
          notationLegend={{
            caption: "Preview",
            legendRows: createNotationLegendRows(["FGC"]),
            markersHeaderLabel: "Buttons",
            modeHeaderLabel: "Format",
          }}
        />
        <ErrorState
          message="Unavailable"
          sourceSurface="recovery"
          errorToken="hidden-focus"
          title="Route unavailable"
          controllerFocusedActionId="fallback"
          severity={errorStateSeverities.blocking}
          actions={[
            {
              available: true,
              id: "fallback",
              kind: errorStateActionKinds.fallback,
              label: "Hidden recovery focus",
            },
          ]}
        />
        <TopBarDropdownMenu
          open
          sourceSurface="shell"
          label="Hidden navigation"
          controllerFocusedActionId="catalog"
          layoutMode={uiResponsiveModes.desktop}
          actions={[{ available: true, id: "catalog", label: "Hidden shell focus" }]}
        />
      </UiRoot>,
    );

    expect(document.querySelectorAll('[data-controller-focused="true"]')).toHaveLength(0);
    expect(view.container.querySelector('[data-ui-controller-focus-visible="false"]')).toBeTruthy();
  });
});

describe("backup and notation surfaces", () => {
  it("places prepared controller focus on mounted backup and dialog actions", () => {
    const view = render(
      <BackupCollapsibleBlock
        title="Future Game"
        sourceSurface="settings"
        exportLabel="Export backup"
        importLabel="Import backup"
        localStateSummary={summary}
        exportAvailability={{ available: true }}
        importAvailability={{ available: true }}
        sourceFocusTarget="backup-future-game"
        operationState={backupOperationStates.idle}
        disclosureState={backupDisclosureStates.expanded}
        validationResult={{ status: backupValidationStatuses.none }}
        controllerFocusedAction={backupCollapsibleBlockActions.export}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Export backup" }).getAttribute("data-controller-focused"),
    ).toBe("true");
    expect(
      screen.getByRole("button", { name: "Import backup" }).getAttribute("data-controller-focused"),
    ).toBeNull();

    view.rerender(
      <ExportDialog
        open
        cancelLabel="Cancel"
        title="Export backup"
        confirmLabel="Download"
        sourceSurface="settings"
        localStateSummary={summary}
        description="Export this game"
        exportAvailability={{ available: true }}
        sourceFocusTarget="backup-future-game-export"
        controllerFocusedAction={exportDialogActions.confirmExport}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Download" }).getAttribute("data-controller-focused"),
    ).toBe("true");
  });

  it("blocks destructive replacement for an invalid backup", () => {
    const onAction = vi.fn<(intent: ComponentActionIntent) => void>();
    render(
      <ImportPreviewDialog
        open
        cancelLabel="Cancel"
        title="Import backup"
        confirmLabel="Replace"
        sourceSurface="settings"
        onRequestAction={onAction}
        localStateSummary={summary}
        backupCandidateId="candidate-1"
        retryLabel="Choose another file"
        description="Review imported data"
        confirmationAvailability={{ available: true }}
        replaceImpactSummary="All local state will be replaced"
        validationResult={{ message: "Invalid backup", status: "invalid" }}
        controllerFocusedAction={importPreviewDialogActions.retryFileSelection}
      />,
    );

    expect((screen.getByRole("button", { name: /Replace/ }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    expect(
      screen
        .getByRole("button", { name: "Choose another file" })
        .getAttribute("data-controller-focused"),
    ).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: importPreviewDialogActions.cancelImport,
        reason: "press",
        sourceSurface: "settings",
      }),
    );
  });

  it("renders a read-only accessible notation table", () => {
    render(
      <NotationLegendTable
        modeHeaderLabel="Mode"
        caption="Notation legend"
        markersHeaderLabel="Markers"
        legendRows={createNotationLegendRows(["FGC", "PlayStation", "Xbox"])}
      />,
    );

    expect(screen.getByRole("table", { name: "Notation legend" })).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getAllByRole("row")).toHaveLength(4);
  });
});
