import { fireEvent, render, screen } from "@mk-combos/contracts/test/unit/react";
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
} from "@mk-combos/ui/components/controller-hint-strip";
import { DisplayModeSwitcher } from "@mk-combos/ui/components/display-mode-switcher";
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
  BreadcrumbItemSchema,
  ComponentInteractionReasonSchema,
  ControllerAccessStateSchema,
  GameSwitcherOptionSchema,
  UiResponsiveModeSchema,
} from "@mk-combos/ui/components/schema";
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
        id: "catalog",
        kind: "future-kind",
        label: "Catalog",
      }).kind,
    ).toBe("future-kind");
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
          disclosureState={backupDisclosureStates.expanded}
          exportAvailability={{ available: true }}
          exportLabel="Export backup"
          importAvailability={{ available: true }}
          importLabel="Import backup"
          localStateSummary={summary}
          operationState={operationState}
          sourceFocusTarget="backup-future-game"
          sourceSurface="test"
          title="Backup"
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
        confirmLabel="Open catalog"
        displayModeSwitcher={{
          availableDisplayModes: displayModes,
          label: "Button labels",
          selectedDisplayMode: "FGC",
          sourceSurface: "first-launch",
        }}
        gameSwitcher={{
          availableGames: games,
          context: gameSwitcherContexts.firstLaunch,
          label: "Starting game",
          menuOpen: false,
          selectedGameId: "mkxl",
          sourceSurface: "first-launch",
        }}
        languageSwitcher={{
          availableLanguages: languages,
          label: "Interface language",
          selectedLanguage: "EN",
          sourceSurface: "first-launch",
        }}
        notationLegend={{
          caption: "Preview",
          legendRows: createNotationLegendRows(["FGC"]),
          markersHeaderLabel: "Buttons",
          modeHeaderLabel: "Format",
        }}
        onRequestAction={onAction}
        sourceSurface="first-launch"
        title="Your preferences"
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

    fireEvent.submit(form as HTMLFormElement);
    expect(onAction).toHaveBeenLastCalledWith({
      action: firstLaunchSetupFormActions.confirm,
      reason: "press",
      sourceSurface: "first-launch",
    });

    rerender(
      <FirstLaunchSetupForm
        confirmAvailable
        confirmLabel="Open catalog"
        displayModeSwitcher={{
          availableDisplayModes: displayModes,
          label: "Button labels",
          selectedDisplayMode: "FGC",
          sourceSurface: "first-launch",
        }}
        gameSwitcher={{
          availableGames: games,
          context: gameSwitcherContexts.firstLaunch,
          label: "Starting game",
          menuOpen: false,
          selectedGameId: "mkxl",
          sourceSurface: "first-launch",
        }}
        languageSwitcher={{
          availableLanguages: languages,
          label: "Interface language",
          selectedLanguage: "EN",
          sourceSurface: "first-launch",
        }}
        notationLegend={{
          caption: "Preview",
          legendRows: createNotationLegendRows(["FGC"]),
          markersHeaderLabel: "Buttons",
          modeHeaderLabel: "Format",
        }}
        onRequestAction={onAction}
        persistenceMessage="These settings cannot be saved."
        sessionOnlyAcknowledgeLabel="Continue without saving"
        sourceSurface="first-launch"
        title="Your preferences"
      />,
    );

    expect(screen.queryByRole("button", { name: "Open catalog" })).toBeNull();
    expect(screen.getAllByRole("button", { name: "Continue without saving" })).toHaveLength(1);
    fireEvent.submit(container.querySelector("form") as HTMLFormElement);
    expect(onAction).toHaveBeenLastCalledWith({
      action: firstLaunchSetupFormActions.acknowledgeSessionOnly,
      reason: "press",
      sourceSurface: "first-launch",
    });
  });

  it("emits a semantic language selection without a browser event", () => {
    const onSelect = vi.fn();
    render(
      <LanguageSwitcher
        availableLanguages={languages}
        label="Language"
        onRequestSelectLanguage={onSelect}
        selectedLanguage="EN"
        sourceFocusTarget="language-control"
        sourceSurface="settings"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Українська" }));

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
        availableDisplayModes={displayModes}
        invalidSelectedDisplayMode
        label="Display mode"
        selectedDisplayMode="FGC"
        sourceSurface="settings"
        validationMessage="Unsupported display mode"
      />,
    );

    expect(screen.getByRole("alert").textContent).toContain("Unsupported display mode");
    expect(screen.getByRole("group", { name: "Display mode" }).getAttribute("aria-invalid")).toBe(
      "true",
    );
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

  it("mounts inline breadcrumbs only in desktop mode", () => {
    const { container, rerender } = render(
      <Breadcrumbs
        ariaLabel="Breadcrumbs"
        gameSwitcher={gameSwitcherProps}
        items={breadcrumbItems}
        layoutMode="mobile"
        sourceSurface="shell"
      />,
    );

    expect(container.innerHTML).toBe("");

    rerender(
      <Breadcrumbs
        ariaLabel="Breadcrumbs"
        gameSwitcher={gameSwitcherProps}
        items={breadcrumbItems}
        layoutMode="tablet"
        sourceSurface="shell"
      />,
    );
    expect(container.innerHTML).toBe("");

    rerender(
      <Breadcrumbs
        ariaLabel="Breadcrumbs"
        gameSwitcher={gameSwitcherProps}
        items={breadcrumbItems}
        layoutMode="desktop"
        sourceSurface="shell"
      />,
    );
    expect(screen.getByRole("navigation", { name: "Breadcrumbs" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Catalog" })).toBeTruthy();
  });

  it("renders only current-location identity inline in compact top bars", () => {
    render(
      <GlobalTopBar
        breadcrumbs={{
          ariaLabel: "Breadcrumbs",
          gameSwitcher: gameSwitcherProps,
          items: breadcrumbItems,
          layoutMode: "tablet",
          sourceSurface: "shell",
        }}
        layoutMode="tablet"
        menu={{
          actions: [],
          label: "Open global menu",
          layoutMode: "tablet",
          open: false,
          sourceSurface: "shell",
        }}
      />,
    );

    expect(screen.queryByRole("navigation", { name: "Breadcrumbs" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Choose game" })).toBeNull();
    expect(screen.getByText("Settings").closest('[aria-current="page"]')).toBeTruthy();
  });

  it("renders compact navigation in a drawer without duplicate Catalog actions", () => {
    const onAction = vi.fn();
    const onMenuChange = vi.fn();

    render(
      <TopBarDropdownMenu
        actions={[
          { available: true, id: "catalog", label: "Catalog" },
          { available: true, id: "lists", label: "Named Lists" },
        ]}
        breadcrumbs={breadcrumbItems}
        label="Open global menu"
        layoutMode="tablet"
        onRequestAction={onAction}
        onRequestMenuChange={onMenuChange}
        open
        responsiveCloseLabel="Close navigation"
        responsiveGameSwitcher={gameSwitcherProps}
        responsiveNavigationLabel="Navigation"
        sourceFocusTarget="global-menu"
        sourceSurface="shell"
      />,
    );

    expect(screen.getByRole("dialog", { name: "Navigation" })).toBeTruthy();
    expect(document.querySelector("[data-ui-drawer-backdrop]")).toBeTruthy();
    expect(screen.getAllByRole("button", { name: "Choose game" })).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: "Catalog" })).toHaveLength(1);
    const currentItem = screen.getByText("Settings").closest('[aria-current="page"]');
    const actionItem = screen.getByRole("button", { name: "Named Lists" });

    expect(currentItem).toBeTruthy();
    expect(currentItem?.getAttribute("data-disabled")).toBeNull();
    expect(currentItem?.className).not.toContain("cursor-pointer");
    expect(currentItem?.className).not.toContain("hover:");
    expect(actionItem.className).toContain("cursor-pointer");
    expect(actionItem.className).toContain("hover:bg");

    fireEvent.click(screen.getByRole("button", { name: "Catalog" }));

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

  it("hides controller hints without a connection or grace state", () => {
    const { container } = render(
      <ControllerHintStrip
        connectionState="disconnected"
        hasRecentDisconnect={false}
        hints={[]}
        label="Controller disconnected"
        panelOpen={false}
        sourceSurface="shell"
      />,
    );

    expect(container.innerHTML).toBe("");
  });

  it("renders the connected controller trigger as one icon without visible status chrome", () => {
    render(
      <ControllerHintStrip
        connectionState="connected"
        hasRecentDisconnect={false}
        hints={[]}
        label="Controller connected"
        panelOpen={false}
        profileLabel="Xbox Controller"
        sourceSurface="shell"
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

  it("renders the global menu icon trigger without a surface underlay", () => {
    render(
      <TopBarDropdownMenu
        actions={[]}
        label="Open global menu"
        layoutMode="desktop"
        open={false}
        sourceSurface="shell"
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
        actions={[{ available: true, id: "settings", label: "Settings" }]}
        label="Open global menu"
        layoutMode="desktop"
        open
        sourceSurface="shell"
      />,
    );

    expect(screen.getByRole("menu", { name: "Open global menu" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Settings" })).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("uses a dashed icon for disconnect grace without adding another indicator", () => {
    render(
      <ControllerHintStrip
        connectionState="disconnected"
        hasRecentDisconnect
        hints={[]}
        label="Controller recently disconnected"
        panelOpen={false}
        sourceSurface="shell"
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
        connectionState="connected"
        hasRecentDisconnect={false}
        hints={[
          { commandId: "open", inputLabel: "A", label: "Open" },
          { commandId: "back", inputLabel: "B", label: "Back" },
        ]}
        label="Controller connected"
        onRequestHintPanelChange={onPanelChange}
        panelOpen
        profileLabel="Xbox Controller"
        sourceFocusTarget="controller-indicator"
        sourceSurface="shell"
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
        description="Use a connected controller to continue."
        layoutMode="mobile"
        state="awaitingGesture"
        statusLabel="Press any controller button"
        title="Controller required"
      />,
    );

    expect(screen.getByRole("dialog", { name: "Controller required" })).toBeTruthy();

    rerender(
      <ControllerAccessGate
        description="Ready"
        layoutMode="mobile"
        state="ready"
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
});

describe("backup and notation surfaces", () => {
  it("blocks destructive replacement for an invalid backup", () => {
    const onAction = vi.fn<(intent: ComponentActionIntent) => void>();
    render(
      <ImportPreviewDialog
        backupCandidateId="candidate-1"
        cancelLabel="Cancel"
        confirmLabel="Replace"
        confirmationAvailability={{ available: true }}
        description="Review imported data"
        localStateSummary={summary}
        onRequestAction={onAction}
        open
        replaceImpactSummary="All local state will be replaced"
        retryLabel="Choose another file"
        sourceSurface="settings"
        title="Import backup"
        validationResult={{ message: "Invalid backup", status: "invalid" }}
      />,
    );

    expect((screen.getByRole("button", { name: /Replace/ }) as HTMLButtonElement).disabled).toBe(
      true,
    );
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
        caption="Notation legend"
        legendRows={createNotationLegendRows(["FGC", "PlayStation", "Xbox"])}
        markersHeaderLabel="Markers"
        modeHeaderLabel="Mode"
      />,
    );

    expect(screen.getByRole("table", { name: "Notation legend" })).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getAllByRole("row")).toHaveLength(4);
  });
});
