import type {
  LanguageCode,
  NotationDisplayMode,
  ThemePreference,
} from "@mk-combos/contracts/settings/type";
import {
  languageCodes,
  notationDisplayModes,
  themePreferences,
} from "@mk-combos/contracts/settings/value";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useState } from "react";

import {
  BackupCollapsibleBlock,
  backupCollapsibleBlockActions,
} from "../components/backup-collapsible-block";
import { ControllerAccessGate } from "../components/controller-access-gate";
import {
  controllerConnectionStates,
  controllerHintStripPanelActions,
} from "../components/controller-hint-strip";
import { DisplayModeSwitcher } from "../components/display-mode-switcher";
import { exportDialogActions } from "../components/export-dialog";
import { FirstLaunchSetupForm } from "../components/first-launch-setup-form";
import {
  type GameSwitcherMenuAction,
  gameSwitcherContexts,
  gameSwitcherMenuActions,
} from "../components/game-switcher";
import { GlobalTopBar } from "../components/global-top-bar";
import { importPreviewDialogActions } from "../components/import-preview-dialog";
import { LanguageSwitcher } from "../components/language-switcher";
import {
  NotationLegendTable,
  notationLegendTableLayouts,
} from "../components/notation-legend-table";
import { ThemePreferenceSwitcher } from "../components/theme-preference-switcher";
import { topBarDropdownMenuChangeActions } from "../components/top-bar-dropdown-menu";
import type {
  BackupDisclosureState,
  BackupOperationState,
  BreadcrumbItem,
  UiResponsiveMode,
} from "../components/type";
import {
  backupDisclosureStates,
  backupOperationStates,
  backupPersistenceModes,
  backupSliceStatuses,
  backupValidationStatuses,
  componentOptionStatuses,
  controllerAccessStates,
  uiResponsiveModes,
} from "../components/value";
import { useUiOpenState } from "../hooks/open-state";
import { createNotationLegendRows } from "../notation/runtime";
import { StatusMessage } from "../primitives/state";
import type { UiContrastMode, UiThemeMode } from "../tokens/type";
import { uiContrastModes, uiThemeModes } from "../tokens/value";
import { StoryFrame } from "./story-frame";
import { storyViewportGlobals } from "./story-viewports";

const games = [
  {
    gameId: "mkxl",
    label: "Mortal Kombat XL",
    shortLabel: "MKXL",
    status: componentOptionStatuses.available,
  },
  {
    gameId: "mk1",
    label: "Mortal Kombat 1",
    shortLabel: "MK1",
    status: componentOptionStatuses.available,
  },
] as const;

const breadcrumbFacts = [
  {
    disabled: false,
    id: "catalog",
    kind: "catalog",
    label: "Catalog",
    target: { surfaceCode: "UI-PAGE-003" },
  },
  {
    disabled: false,
    id: "detail",
    kind: "comboDetail",
    label: "Scorpion · Long localized combo title",
    target: { surfaceCode: "UI-PAGE-004" },
  },
] as const;

const languageOptions = [
  {
    label: "English",
    language: languageCodes.EN,
    shortLabel: languageCodes.EN,
    status: componentOptionStatuses.available,
  },
  {
    label: "Українська",
    language: languageCodes.UA,
    shortLabel: languageCodes.UA,
    status: componentOptionStatuses.available,
  },
] as const;

const displayModeOptions = [
  { label: "FGC", mode: notationDisplayModes.FGC, status: componentOptionStatuses.available },
  {
    label: "PlayStation",
    mode: notationDisplayModes.PlayStation,
    shortLabel: "PS",
    status: componentOptionStatuses.available,
  },
  {
    label: "Xbox",
    mode: notationDisplayModes.Xbox,
    shortLabel: "XB",
    status: componentOptionStatuses.available,
  },
] as const;

const themePreferenceOptions = [
  {
    label: "Follow system",
    preference: themePreferences.system,
    shortLabel: "System",
    status: componentOptionStatuses.available,
  },
  {
    label: "Dark",
    preference: themePreferences.dark,
    status: componentOptionStatuses.available,
  },
  {
    label: "Light",
    preference: themePreferences.light,
    status: componentOptionStatuses.available,
  },
] as const;

const mkxlLocalStateSummary = {
  gameSlices: [
    {
      customComboCount: 3,
      gameId: "mkxl",
      label: "MKXL",
      namedListCount: 2,
      status: backupSliceStatuses.ready,
    },
  ],
  persistenceMode: backupPersistenceModes.persistent,
  settingsSummary: "Ready to create a backup.",
} as const;

type StoryInitialDialog = "export" | "import" | "none";

type ShellSettingsStoryArgs = {
  contrast: UiContrastMode;
  initialActiveBreadcrumbId: (typeof breadcrumbFacts)[number]["id"];
  initialActiveGameId: (typeof games)[number]["gameId"];
  initialBackupDisclosureState: BackupDisclosureState;
  initialBackupOperationState: BackupOperationState;
  initialDialog: StoryInitialDialog;
  initialDisplayMode: NotationDisplayMode;
  initialGameMenuOpen: boolean;
  initialHintPanelOpen: boolean;
  initialLanguage: LanguageCode;
  initialMenuOpen: boolean;
  initialStatus: string;
  layoutMode: UiResponsiveMode;
  theme: UiThemeMode;
};

function ShellSettingsStorySurfaceWithArgs(_props: ShellSettingsStoryArgs) {
  return null;
}

const meta = {
  args: {
    contrast: uiContrastModes.standard,
    initialActiveBreadcrumbId: "detail",
    initialActiveGameId: "mkxl",
    initialBackupDisclosureState: backupDisclosureStates.expanded,
    initialBackupOperationState: backupOperationStates.idle,
    initialDialog: "none",
    initialDisplayMode: notationDisplayModes.PlayStation,
    initialGameMenuOpen: false,
    initialHintPanelOpen: false,
    initialLanguage: languageCodes.UA,
    initialMenuOpen: false,
    initialStatus: "Ready for interaction",
    layoutMode: uiResponsiveModes.desktop,
    theme: uiThemeModes.dark,
  },
  argTypes: {
    contrast: {
      control: "select",
      options: [uiContrastModes.standard, uiContrastModes.increased],
    },
    initialActiveBreadcrumbId: { control: "select", options: ["catalog", "detail"] },
    initialActiveGameId: { control: "select", options: ["mkxl", "mk1"] },
    initialBackupDisclosureState: {
      control: "select",
      options: [backupDisclosureStates.collapsed, backupDisclosureStates.expanded],
    },
    initialBackupOperationState: {
      control: "select",
      options: Object.values(backupOperationStates),
    },
    initialDialog: { control: "select", options: ["none", "export", "import"] },
    initialDisplayMode: {
      control: "select",
      options: [
        notationDisplayModes.FGC,
        notationDisplayModes.PlayStation,
        notationDisplayModes.Xbox,
      ],
    },
    initialLanguage: {
      control: "select",
      options: [languageCodes.EN, languageCodes.UA],
    },
    layoutMode: {
      control: "select",
      options: [uiResponsiveModes.mobile, uiResponsiveModes.tablet, uiResponsiveModes.desktop],
    },
    theme: { control: "select", options: [uiThemeModes.dark, uiThemeModes.light] },
  },
  component: ShellSettingsStorySurfaceWithArgs,
  globals: storyViewportGlobals.desktop,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  title: "Components/Shell and Settings",
} satisfies Meta<typeof ShellSettingsStorySurfaceWithArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const Frame = (props: {
  children: ReactNode;
  contrast?: UiContrastMode;
  layoutMode: UiResponsiveMode;
  theme?: UiThemeMode;
}) => (
  <StoryFrame
    contrast={props.contrast}
    responsiveMode={props.layoutMode}
    theme={props.theme ?? uiThemeModes.dark}
  >
    {props.children}
  </StoryFrame>
);

function ShellStoryHarness(props: {
  contrast: UiContrastMode;
  initialActiveBreadcrumbId: (typeof breadcrumbFacts)[number]["id"];
  initialActiveGameId: (typeof games)[number]["gameId"];
  initialGameMenuOpen: boolean;
  initialHintPanelOpen: boolean;
  initialMenuOpen: boolean;
  initialStatus: string;
  layoutMode: UiResponsiveMode;
  theme: UiThemeMode;
}) {
  const mobile = props.layoutMode === uiResponsiveModes.mobile;
  const mobileNavigation = props.layoutMode === uiResponsiveModes.mobile;
  const [activeBreadcrumbId, setActiveBreadcrumbId] = useState<string>(
    props.initialActiveBreadcrumbId,
  );
  const [activeGameId, setActiveGameId] = useState<string>(props.initialActiveGameId);
  const gameMenu = useUiOpenState({ initialOpen: props.initialGameMenuOpen });
  const hintPanel = useUiOpenState({ initialOpen: props.initialHintPanelOpen });
  const menu = useUiOpenState({ initialOpen: props.initialMenuOpen });
  const [status, setStatus] = useState(props.initialStatus);
  const requestedActiveIndex = breadcrumbFacts.findIndex((item) => item.id === activeBreadcrumbId);
  const activeIndex = requestedActiveIndex < 0 ? breadcrumbFacts.length - 1 : requestedActiveIndex;
  const trailFacts = breadcrumbFacts.slice(0, activeIndex + 1);
  const items: readonly BreadcrumbItem[] = trailFacts.map((item, index) => {
    const current = index === trailFacts.length - 1;
    if (current) {
      const { target: _target, ...currentItem } = item;
      return { ...currentItem, current };
    }
    return { ...item, current };
  });
  const gameSwitcher = {
    availableGames: games,
    context: gameSwitcherContexts.breadcrumbs,
    label: "Choose game",
    menuOpen: gameMenu.state.open,
    onRequestMenuChange: ({ action }: { action: GameSwitcherMenuAction }) =>
      gameMenu.methods.setOpen(action === gameSwitcherMenuActions.open),
    onRequestSelectGame: ({ value }: { value: string }) => {
      setActiveGameId(value);
      gameMenu.methods.close();
      menu.methods.close();
      setStatus(`Active game: ${games.find((game) => game.gameId === value)?.label ?? value}`);
    },
    selectedGameId: activeGameId,
    sourceSurface: "storybook-shell",
  };

  const navigateBreadcrumb = (id: string) => {
    const item = items.find((candidate) => candidate.id === id);
    setActiveBreadcrumbId(id);
    menu.methods.close();
    setStatus(`Navigation intent: ${item?.label ?? id}`);
  };

  return (
    <Frame contrast={props.contrast} layoutMode={props.layoutMode} theme={props.theme}>
      <div
        className={
          mobileNavigation
            ? "w-full min-w-0 max-w-full"
            : props.layoutMode === uiResponsiveModes.tablet
              ? "w-full min-w-0 max-w-full"
              : "w-full min-w-0"
        }
      >
        <GlobalTopBar
          layoutMode={props.layoutMode}
          breadcrumbs={{
            ariaLabel: "Breadcrumbs",
            gameSwitcher,
            items,
            layoutMode: props.layoutMode,
            onRequestNavigate: ({ value }) => navigateBreadcrumb(value),
            sourceSurface: "storybook-shell",
          }}
          controllerHints={{
            connectionState: controllerConnectionStates.connected,
            hasRecentDisconnect: false,
            hints: mobile
              ? [
                  { commandId: "confirm", inputLabel: "A", label: "Confirm" },
                  { commandId: "back", inputLabel: "B", label: "Back" },
                ]
              : [{ commandId: "open", inputLabel: "A", label: "Open" }],
            label: "Controller connected",
            onRequestHintPanelChange: ({ action }) =>
              hintPanel.methods.setOpen(action === controllerHintStripPanelActions.open),
            panelOpen: hintPanel.state.open,
            profileLabel: "Xbox Controller",
            sourceSurface: "storybook-shell",
          }}
          menu={{
            actions: [
              { available: true, id: "lists", label: "Named Lists" },
              { available: true, id: "builder", label: "Builder" },
              { available: true, id: "settings", label: "Settings" },
            ],
            breadcrumbs: mobileNavigation ? items : undefined,
            responsiveCloseLabel: mobileNavigation ? "Close navigation" : undefined,
            responsiveGameSwitcher: mobileNavigation ? gameSwitcher : undefined,
            responsiveNavigationLabel: mobileNavigation ? "Navigation" : undefined,
            label: "Open global menu",
            layoutMode: props.layoutMode,
            onRequestAction: ({ action }) => {
              if (action.startsWith("breadcrumb:")) {
                navigateBreadcrumb(action.slice("breadcrumb:".length));
                return;
              }
              menu.methods.close();
              setStatus(`Menu intent: ${action}`);
            },
            onRequestMenuChange: ({ action }) =>
              menu.methods.setOpen(action === topBarDropdownMenuChangeActions.open),
            open: menu.state.open,
            sourceSurface: "storybook-shell",
          }}
        />
      </div>
      <div aria-live="polite" className="w-full p-2">
        <StatusMessage>{status}</StatusMessage>
      </div>
    </Frame>
  );
}

function SettingsStoryHarness(props: {
  contrast: UiContrastMode;
  initialBackupDisclosureState: BackupDisclosureState;
  initialBackupOperationState: BackupOperationState;
  initialDialog: StoryInitialDialog;
  initialDisplayMode: NotationDisplayMode;
  initialLanguage: LanguageCode;
  initialStatus: string;
  layoutMode: UiResponsiveMode;
  theme: UiThemeMode;
}) {
  const [activeDialog, setActiveDialog] = useState<StoryInitialDialog>(props.initialDialog);
  const [disclosureState, setDisclosureState] = useState<BackupDisclosureState>(
    props.initialBackupDisclosureState,
  );
  const [displayMode, setDisplayMode] = useState<NotationDisplayMode>(props.initialDisplayMode);
  const [language, setLanguage] = useState<LanguageCode>(props.initialLanguage);
  const [themePreference, setThemePreference] = useState<ThemePreference>(themePreferences.system);
  const [status, setStatus] = useState(props.initialStatus);
  const importCandidateSummary = {
    ...mkxlLocalStateSummary,
    lastExportedAt: "2026-07-14T10:00:00.000Z",
    settingsSummary: "This file contains only MKXL local data.",
  };

  return (
    <Frame contrast={props.contrast} layoutMode={props.layoutMode} theme={props.theme}>
      <main className="grid w-full max-w-3xl gap-1">
        <header className="grid gap-1 border-l-4 border-(--ui-accent) py-1 pl-3">
          <span className="text-xs font-medium text-(--ui-accent-strong)">
            System configuration
          </span>
          <h1 className="font-(--ui-font-display) text-2xl font-semibold tracking-[-0.01em]">
            Settings
          </h1>
          <p className="text-sm text-(--ui-muted-text)">
            Interface, notation reference, and local data controls.
          </p>
        </header>
        <LanguageSwitcher
          label="Language"
          selectedLanguage={language}
          sourceSurface="storybook-settings"
          availableLanguages={languageOptions}
          onRequestSelectLanguage={({ value }) => {
            setLanguage(value);
            setStatus(`Language selected: ${value}`);
          }}
        />
        <DisplayModeSwitcher
          label="Notation display mode"
          selectedDisplayMode={displayMode}
          sourceSurface="storybook-settings"
          availableDisplayModes={displayModeOptions}
          onRequestSelectDisplayMode={({ value }) => {
            setDisplayMode(value);
            setStatus(`Display mode selected: ${value}`);
          }}
        />
        <ThemePreferenceSwitcher
          label="Theme"
          sourceSurface="storybook-settings"
          selectedThemePreference={themePreference}
          availableThemePreferences={themePreferenceOptions}
          onRequestSelectThemePreference={({ value }) => {
            setThemePreference(value);
            setStatus(`Theme preference selected: ${value}`);
          }}
        />
        <NotationLegendTable
          modeHeaderLabel="Mode"
          caption="Notation legend"
          markersHeaderLabel="Markers"
          legendRows={createNotationLegendRows([
            notationDisplayModes.FGC,
            notationDisplayModes.PlayStation,
            notationDisplayModes.Xbox,
          ])}
          layout={
            props.layoutMode === uiResponsiveModes.mobile
              ? notationLegendTableLayouts.compact
              : props.layoutMode === uiResponsiveModes.tablet
                ? notationLegendTableLayouts.stacked
                : notationLegendTableLayouts.table
          }
        />
        <BackupCollapsibleBlock
          title="MKXL"
          exportLabel="Create backup"
          disclosureState={disclosureState}
          importLabel="Restore from backup"
          sourceSurface="storybook-settings"
          sourceFocusTarget="storybook-backup"
          exportAvailability={{ available: true }}
          importAvailability={{ available: true }}
          localStateSummary={mkxlLocalStateSummary}
          operationState={props.initialBackupOperationState}
          validationResult={{ status: backupValidationStatuses.none }}
          exportDialog={{
            cancelLabel: "Cancel",
            confirmLabel: "Download file",
            description: "Download this game's local data as a file.",
            exportAvailability: { available: true },
            localStateSummary: mkxlLocalStateSummary,
            onRequestAction: ({ action }) => {
              setActiveDialog("none");
              setStatus(
                action === exportDialogActions.confirmExport
                  ? "Backup download confirmed"
                  : "Backup download cancelled",
              );
            },
            open: activeDialog === "export",
            sourceFocusTarget: "storybook-export",
            sourceSurface: "storybook-settings",
            title: "Create a MKXL backup",
          }}
          onRequestAction={({ action }) => {
            if (
              action === backupCollapsibleBlockActions.expand ||
              action === backupCollapsibleBlockActions.collapse
            ) {
              const expanded = action === backupCollapsibleBlockActions.expand;
              setDisclosureState(
                expanded ? backupDisclosureStates.expanded : backupDisclosureStates.collapsed,
              );
              setStatus(
                `Backup block ${
                  expanded ? backupDisclosureStates.expanded : backupDisclosureStates.collapsed
                }`,
              );
              return;
            }
            if (action === backupCollapsibleBlockActions.export) {
              setActiveDialog("export");
              return;
            }
            setActiveDialog("import");
          }}
          importPreviewDialog={{
            backupCandidateId: "storybook-candidate",
            cancelLabel: "Cancel",
            confirmLabel: "Replace MKXL data",
            confirmationAvailability: { available: true },
            description: "Review the file before replacing MKXL data in this browser.",
            localStateSummary: importCandidateSummary,
            onRequestAction: ({ action }) => {
              setActiveDialog("none");
              setStatus(
                action === importPreviewDialogActions.confirmReplace
                  ? "Restore confirmed"
                  : action === importPreviewDialogActions.retryFileSelection
                    ? "New file selection requested"
                    : "Restore cancelled",
              );
            },
            open: activeDialog === "import",
            replaceImpactSummary:
              "Only MKXL custom combos, named lists, and catalog context will be replaced.",
            retryLabel: "Choose another file",
            sourceFocusTarget: "storybook-import",
            sourceSurface: "storybook-settings",
            title: "Restore MKXL from this backup?",
            validationResult: {
              message: "The MKXL backup is valid",
              status: backupValidationStatuses.valid,
            },
          }}
        />
        <div aria-live="polite">
          <StatusMessage>{status}</StatusMessage>
        </div>
      </main>
    </Frame>
  );
}

function FirstLaunchStoryHarness(props: {
  contrast: UiContrastMode;
  initialActiveGameId: (typeof games)[number]["gameId"];
  initialDisplayMode: NotationDisplayMode;
  initialGameMenuOpen: boolean;
  initialLanguage: LanguageCode;
  layoutMode: UiResponsiveMode;
  theme: UiThemeMode;
}) {
  const [displayMode, setDisplayMode] = useState<NotationDisplayMode>(props.initialDisplayMode);
  const [gameId, setGameId] = useState<string>(props.initialActiveGameId);
  const gameMenu = useUiOpenState({ initialOpen: props.initialGameMenuOpen });
  const [language, setLanguage] = useState<LanguageCode>(props.initialLanguage);

  return (
    <Frame contrast={props.contrast} layoutMode={props.layoutMode} theme={props.theme}>
      <main className="w-full max-w-3xl">
        <FirstLaunchSetupForm
          confirmAvailable
          title="Your preferences"
          confirmLabel="Open catalog"
          sourceSurface="storybook-first-launch"
          description="Choose a starting game, interface language, and button labels. You can change them later."
          languageSwitcher={{
            availableLanguages: languageOptions,
            label: "Interface language",
            onRequestSelectLanguage: ({ value }) => setLanguage(value),
            selectedLanguage: language,
            sourceSurface: "storybook-first-launch",
          }}
          displayModeSwitcher={{
            availableDisplayModes: displayModeOptions,
            label: "Button labels",
            onRequestSelectDisplayMode: ({ value }) => setDisplayMode(value),
            selectedDisplayMode: displayMode,
            sourceSurface: "storybook-first-launch",
          }}
          notationLegend={{
            caption: "Preview",
            layout:
              props.layoutMode === uiResponsiveModes.desktop
                ? notationLegendTableLayouts.table
                : notationLegendTableLayouts.stacked,
            legendRows: createNotationLegendRows([displayMode]),
            markersHeaderLabel: "Buttons",
            modeHeaderLabel: "Format",
          }}
          gameSwitcher={{
            availableGames: games,
            context: gameSwitcherContexts.firstLaunch,
            label: "Starting game",
            menuOpen: gameMenu.state.open,
            onRequestMenuChange: ({ action }) =>
              gameMenu.methods.setOpen(action === gameSwitcherMenuActions.open),
            onRequestSelectGame: ({ value }) => {
              setGameId(value);
              gameMenu.methods.close();
            },
            selectedGameId: gameId,
            sourceSurface: "storybook-first-launch",
          }}
        />
      </main>
    </Frame>
  );
}

const shellControlNames = [
  "layoutMode",
  "theme",
  "contrast",
  "initialActiveBreadcrumbId",
  "initialActiveGameId",
  "initialGameMenuOpen",
  "initialHintPanelOpen",
  "initialMenuOpen",
  "initialStatus",
];

const settingsControlNames = [
  "layoutMode",
  "theme",
  "contrast",
  "initialBackupDisclosureState",
  "initialBackupOperationState",
  "initialDialog",
  "initialDisplayMode",
  "initialLanguage",
  "initialStatus",
];

const firstLaunchControlNames = [
  "layoutMode",
  "theme",
  "contrast",
  "initialActiveGameId",
  "initialDisplayMode",
  "initialGameMenuOpen",
  "initialLanguage",
];

const renderShellStory = (args: ShellSettingsStoryArgs) => (
  <ShellStoryHarness
    {...args}
    key={JSON.stringify({
      contrast: args.contrast,
      initialActiveBreadcrumbId: args.initialActiveBreadcrumbId,
      initialActiveGameId: args.initialActiveGameId,
      initialGameMenuOpen: args.initialGameMenuOpen,
      initialHintPanelOpen: args.initialHintPanelOpen,
      initialMenuOpen: args.initialMenuOpen,
      initialStatus: args.initialStatus,
      layoutMode: args.layoutMode,
      theme: args.theme,
    })}
  />
);

const renderSettingsStory = (args: ShellSettingsStoryArgs) => (
  <SettingsStoryHarness
    {...args}
    key={JSON.stringify({
      contrast: args.contrast,
      initialBackupDisclosureState: args.initialBackupDisclosureState,
      initialBackupOperationState: args.initialBackupOperationState,
      initialDialog: args.initialDialog,
      initialDisplayMode: args.initialDisplayMode,
      initialLanguage: args.initialLanguage,
      initialStatus: args.initialStatus,
      layoutMode: args.layoutMode,
      theme: args.theme,
    })}
  />
);

const renderFirstLaunchStory = (args: ShellSettingsStoryArgs) => (
  <FirstLaunchStoryHarness
    {...args}
    key={JSON.stringify({
      contrast: args.contrast,
      initialActiveGameId: args.initialActiveGameId,
      initialDisplayMode: args.initialDisplayMode,
      initialGameMenuOpen: args.initialGameMenuOpen,
      initialLanguage: args.initialLanguage,
      layoutMode: args.layoutMode,
      theme: args.theme,
    })}
  />
);

export const WideShell: Story = {
  args: { layoutMode: uiResponsiveModes.desktop },
  globals: storyViewportGlobals.desktop,
  parameters: { controls: { include: shellControlNames } },
  render: renderShellStory,
};

export const TabletShell: Story = {
  args: { layoutMode: uiResponsiveModes.tablet },
  globals: storyViewportGlobals.tablet,
  parameters: { controls: { include: shellControlNames } },
  render: renderShellStory,
};

export const MobileShell: Story = {
  args: { layoutMode: uiResponsiveModes.mobile },
  globals: storyViewportGlobals.mobile,
  parameters: { controls: { include: shellControlNames } },
  render: renderShellStory,
};

export const ControllerHintsOpen: Story = {
  args: { initialHintPanelOpen: true, layoutMode: uiResponsiveModes.desktop },
  globals: storyViewportGlobals.desktop,
  parameters: { controls: { include: shellControlNames } },
  render: renderShellStory,
};

export const SettingsControls: Story = {
  args: {
    initialStatus: "Settings are ready for interaction",
    layoutMode: uiResponsiveModes.desktop,
  },
  globals: storyViewportGlobals.desktop,
  parameters: { controls: { include: settingsControlNames } },
  render: renderSettingsStory,
};

export const BackupAccordionLocked: Story = {
  args: {
    initialBackupOperationState: backupOperationStates.replaceConfirm,
    initialStatus: "A backup operation owns the accordion; disclosure and actions are locked",
    layoutMode: uiResponsiveModes.desktop,
  },
  globals: storyViewportGlobals.desktop,
  parameters: { controls: { include: settingsControlNames } },
  render: renderSettingsStory,
};

export const MobileSettings: Story = {
  args: {
    initialStatus: "Settings are ready for interaction",
    layoutMode: uiResponsiveModes.mobile,
  },
  globals: storyViewportGlobals.mobile,
  parameters: { controls: { include: settingsControlNames } },
  render: renderSettingsStory,
};

export const TabletSettings: Story = {
  args: {
    initialStatus: "Settings are ready for interaction",
    layoutMode: uiResponsiveModes.tablet,
  },
  globals: storyViewportGlobals.tablet,
  parameters: { controls: { include: settingsControlNames } },
  render: renderSettingsStory,
};

export const LightSettings: Story = {
  args: {
    initialStatus: "Settings are ready for interaction",
    layoutMode: uiResponsiveModes.desktop,
    theme: uiThemeModes.light,
  },
  globals: storyViewportGlobals.desktop,
  parameters: { controls: { include: settingsControlNames } },
  render: renderSettingsStory,
};

export const IncreasedContrastSettings: Story = {
  args: {
    contrast: uiContrastModes.increased,
    initialStatus: "Settings are ready for interaction",
    layoutMode: uiResponsiveModes.desktop,
  },
  globals: storyViewportGlobals.desktop,
  parameters: { controls: { include: settingsControlNames } },
  render: renderSettingsStory,
};

export const FirstLaunch: Story = {
  args: { layoutMode: uiResponsiveModes.desktop },
  globals: storyViewportGlobals.desktop,
  parameters: { controls: { include: firstLaunchControlNames } },
  render: renderFirstLaunchStory,
};

export const MobileFirstLaunch: Story = {
  args: { layoutMode: uiResponsiveModes.mobile },
  globals: storyViewportGlobals.mobile,
  parameters: { controls: { include: firstLaunchControlNames } },
  render: renderFirstLaunchStory,
};

export const ControllerActivation: Story = {
  args: { layoutMode: uiResponsiveModes.mobile },
  globals: storyViewportGlobals.mobile,
  parameters: { controls: { include: ["layoutMode", "theme", "contrast"] } },
  render: (args) => (
    <Frame contrast={args.contrast} layoutMode={args.layoutMode} theme={args.theme}>
      <ControllerAccessGate
        title="Controller required"
        layoutMode={args.layoutMode}
        statusLabel="Press any controller button"
        state={controllerAccessStates.awaitingGesture}
        description="The first gesture activates Gamepad access. Release all controls before navigation begins."
        hints={[
          { inputLabel: "A / Cross", label: "Activate controller" },
          { inputLabel: "Menu", label: "Open global menu after activation" },
        ]}
      />
    </Frame>
  ),
};

export const TabletExportDialogOpen: Story = {
  args: {
    initialDialog: "export",
    initialStatus: "Export dialog is ready for interaction",
    layoutMode: uiResponsiveModes.tablet,
  },
  globals: storyViewportGlobals.tablet,
  parameters: { controls: { include: settingsControlNames } },
  render: renderSettingsStory,
};

export const MobileImportDialogOpen: Story = {
  args: {
    initialDialog: "import",
    initialStatus: "Import dialog is ready for interaction",
    layoutMode: uiResponsiveModes.mobile,
  },
  globals: storyViewportGlobals.mobile,
  parameters: { controls: { include: settingsControlNames } },
  render: renderSettingsStory,
};
