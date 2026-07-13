import type { LanguageCode, NotationDisplayMode } from "@mk-combos/contracts/settings/type";
import { languageCodes, notationDisplayModes } from "@mk-combos/contracts/settings/value";
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
import { topBarDropdownMenuChangeActions } from "../components/top-bar-dropdown-menu";
import type { BackupDisclosureState, BreadcrumbItem, UiResponsiveMode } from "../components/type";
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
import { UiRoot } from "../primitives/layout";
import { StatusMessage } from "../primitives/state";
import type { UiContrastMode, UiThemeMode } from "../tokens/type";
import { uiContrastModes, uiThemeModes } from "../tokens/value";

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

const localStateSummary = {
  gameSlices: [
    {
      customComboCount: 3,
      gameId: "mkxl",
      label: "MKXL",
      status: backupSliceStatuses.ready,
    },
    {
      customComboCount: 2,
      gameId: "mk1",
      label: "MK1",
      status: backupSliceStatuses.ready,
    },
  ],
  persistenceMode: backupPersistenceModes.persistent,
  settingsSummary: "Українська · PlayStation",
} as const;

type StoryInitialDialog = "export" | "import" | "none";

type ShellSettingsStoryArgs = {
  contrast: UiContrastMode;
  initialActiveBreadcrumbId: (typeof breadcrumbFacts)[number]["id"];
  initialActiveGameId: (typeof games)[number]["gameId"];
  initialBackupDisclosureState: BackupDisclosureState;
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
  <UiRoot
    className="grid min-h-screen content-start justify-items-center bg-[var(--ui-window)] p-4 sm:p-6"
    contrast={props.contrast}
    responsiveMode={props.layoutMode}
    theme={props.theme ?? uiThemeModes.dark}
  >
    {props.children}
  </UiRoot>
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
  const responsiveOverflow = props.layoutMode !== uiResponsiveModes.desktop;
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
          responsiveOverflow
            ? "w-full min-w-0 max-w-full"
            : props.layoutMode === uiResponsiveModes.tablet
              ? "w-full min-w-0 max-w-full"
              : "w-full min-w-0"
        }
      >
        <GlobalTopBar
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
          layoutMode={props.layoutMode}
          menu={{
            actions: [
              { available: true, id: "lists", label: "Named Lists" },
              { available: true, id: "builder", label: "Builder" },
              { available: true, id: "settings", label: "Settings" },
            ],
            breadcrumbs: responsiveOverflow ? items : undefined,
            responsiveCloseLabel: responsiveOverflow ? "Close navigation" : undefined,
            responsiveGameSwitcher: responsiveOverflow ? gameSwitcher : undefined,
            responsiveNavigationLabel: responsiveOverflow ? "Navigation" : undefined,
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
  const [status, setStatus] = useState(props.initialStatus);
  const storyLocalStateSummary = {
    ...localStateSummary,
    settingsSummary: `${language === languageCodes.UA ? "Українська" : "English"} · ${displayMode}`,
  };

  return (
    <Frame contrast={props.contrast} layoutMode={props.layoutMode} theme={props.theme}>
      <main className="grid w-full max-w-3xl gap-1">
        <header className="grid gap-1 border-l-4 border-[var(--ui-accent)] py-1 pl-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ui-accent-strong)]">
            System configuration
          </span>
          <h1 className="font-[var(--ui-font-display)] text-2xl font-bold uppercase tracking-[0.04em]">
            Settings
          </h1>
          <p className="text-sm text-[var(--ui-muted-text)]">
            Interface, notation reference, and local data controls.
          </p>
        </header>
        <LanguageSwitcher
          availableLanguages={languageOptions}
          label="Language"
          onRequestSelectLanguage={({ value }) => {
            setLanguage(value);
            setStatus(`Language selected: ${value}`);
          }}
          selectedLanguage={language}
          sourceSurface="storybook-settings"
        />
        <DisplayModeSwitcher
          availableDisplayModes={displayModeOptions}
          label="Notation display mode"
          onRequestSelectDisplayMode={({ value }) => {
            setDisplayMode(value);
            setStatus(`Display mode selected: ${value}`);
          }}
          selectedDisplayMode={displayMode}
          sourceSurface="storybook-settings"
        />
        <NotationLegendTable
          caption="Notation legend"
          legendRows={createNotationLegendRows([
            notationDisplayModes.FGC,
            notationDisplayModes.PlayStation,
            notationDisplayModes.Xbox,
          ])}
          markersHeaderLabel="Markers"
          modeHeaderLabel="Mode"
          layout={
            props.layoutMode === uiResponsiveModes.mobile
              ? notationLegendTableLayouts.compact
              : props.layoutMode === uiResponsiveModes.tablet
                ? notationLegendTableLayouts.stacked
                : notationLegendTableLayouts.table
          }
        />
        <BackupCollapsibleBlock
          disclosureState={disclosureState}
          exportAvailability={{ available: true }}
          exportDialog={{
            cancelLabel: "Cancel",
            confirmLabel: "Export backup",
            description: "Review the prepared local-state summary before export.",
            exportAvailability: { available: true },
            localStateSummary: storyLocalStateSummary,
            onRequestAction: ({ action }) => {
              setActiveDialog("none");
              setStatus(
                action === exportDialogActions.confirmExport
                  ? "Export confirmed"
                  : "Export cancelled",
              );
            },
            open: activeDialog === "export",
            sourceFocusTarget: "storybook-export",
            sourceSurface: "storybook-settings",
            title: "Export backup",
          }}
          exportLabel="Export backup"
          importAvailability={{ available: true }}
          importExternalInputNotice="Opening and using the system file picker requires touch, mouse, or keyboard input."
          importLabel="Import backup"
          importPreviewDialog={{
            backupCandidateId: "storybook-candidate",
            cancelLabel: "Cancel",
            confirmLabel: "Replace local data",
            confirmationAvailability: { available: true },
            description: "This story uses a prepared and validated backup candidate.",
            localStateSummary: storyLocalStateSummary,
            onRequestAction: ({ action }) => {
              setActiveDialog("none");
              setStatus(
                action === importPreviewDialogActions.confirmReplace
                  ? "Import replacement confirmed"
                  : action === importPreviewDialogActions.retryFileSelection
                    ? "New file selection requested"
                    : "Import cancelled",
              );
            },
            open: activeDialog === "import",
            replaceImpactSummary: "Settings and both game slices will be replaced.",
            retryLabel: "Choose another file",
            sourceFocusTarget: "storybook-import",
            sourceSurface: "storybook-settings",
            title: "Import backup",
            validationResult: {
              message: "Backup is valid",
              status: backupValidationStatuses.valid,
            },
          }}
          localStateSummary={storyLocalStateSummary}
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
          operationState={backupOperationStates.idle}
          sourceFocusTarget="storybook-backup"
          sourceSurface="storybook-settings"
          title="Backup"
          validationResult={{ status: backupValidationStatuses.none }}
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
          confirmLabel="Continue"
          description="Choose the defaults used by the controller-first interface."
          displayModeSwitcher={{
            availableDisplayModes: displayModeOptions,
            label: "Notation display mode",
            onRequestSelectDisplayMode: ({ value }) => setDisplayMode(value),
            selectedDisplayMode: displayMode,
            sourceSurface: "storybook-first-launch",
          }}
          gameSwitcher={{
            availableGames: games,
            context: gameSwitcherContexts.firstLaunch,
            label: "Choose game",
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
          languageSwitcher={{
            availableLanguages: languageOptions,
            label: "Language",
            onRequestSelectLanguage: ({ value }) => setLanguage(value),
            selectedLanguage: language,
            sourceSurface: "storybook-first-launch",
          }}
          notationLegend={{
            caption: "Notation legend",
            layout:
              props.layoutMode === uiResponsiveModes.desktop
                ? notationLegendTableLayouts.table
                : notationLegendTableLayouts.stacked,
            legendRows: createNotationLegendRows([
              notationDisplayModes.FGC,
              notationDisplayModes.PlayStation,
              notationDisplayModes.Xbox,
            ]),
            markersHeaderLabel: "Markers",
            modeHeaderLabel: "Mode",
          }}
          sourceSurface="storybook-first-launch"
          title="Initial setup"
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
  parameters: { controls: { include: shellControlNames } },
  render: renderShellStory,
};

export const TabletShell: Story = {
  args: { layoutMode: uiResponsiveModes.tablet },
  parameters: { controls: { include: shellControlNames } },
  render: renderShellStory,
};

export const MobileShell: Story = {
  args: { layoutMode: uiResponsiveModes.mobile },
  parameters: { controls: { include: shellControlNames } },
  render: renderShellStory,
};

export const ControllerHintsOpen: Story = {
  args: { initialHintPanelOpen: true, layoutMode: uiResponsiveModes.desktop },
  parameters: { controls: { include: shellControlNames } },
  render: renderShellStory,
};

export const SettingsControls: Story = {
  args: {
    initialStatus: "Settings are ready for interaction",
    layoutMode: uiResponsiveModes.desktop,
  },
  parameters: { controls: { include: settingsControlNames } },
  render: renderSettingsStory,
};

export const MobileSettings: Story = {
  args: {
    initialStatus: "Settings are ready for interaction",
    layoutMode: uiResponsiveModes.mobile,
  },
  parameters: { controls: { include: settingsControlNames } },
  render: renderSettingsStory,
};

export const TabletSettings: Story = {
  args: {
    initialStatus: "Settings are ready for interaction",
    layoutMode: uiResponsiveModes.tablet,
  },
  parameters: { controls: { include: settingsControlNames } },
  render: renderSettingsStory,
};

export const LightSettings: Story = {
  args: {
    initialStatus: "Settings are ready for interaction",
    layoutMode: uiResponsiveModes.desktop,
    theme: uiThemeModes.light,
  },
  parameters: { controls: { include: settingsControlNames } },
  render: renderSettingsStory,
};

export const IncreasedContrastSettings: Story = {
  args: {
    contrast: uiContrastModes.increased,
    initialStatus: "Settings are ready for interaction",
    layoutMode: uiResponsiveModes.desktop,
  },
  parameters: { controls: { include: settingsControlNames } },
  render: renderSettingsStory,
};

export const FirstLaunch: Story = {
  args: { layoutMode: uiResponsiveModes.desktop },
  parameters: { controls: { include: firstLaunchControlNames } },
  render: renderFirstLaunchStory,
};

export const MobileFirstLaunch: Story = {
  args: { layoutMode: uiResponsiveModes.mobile },
  parameters: { controls: { include: firstLaunchControlNames } },
  render: renderFirstLaunchStory,
};

export const ControllerActivation: Story = {
  args: { layoutMode: uiResponsiveModes.mobile },
  parameters: { controls: { include: ["layoutMode", "theme", "contrast"] } },
  render: (args) => (
    <Frame contrast={args.contrast} layoutMode={args.layoutMode} theme={args.theme}>
      <ControllerAccessGate
        description="The first gesture activates Gamepad access. Release all controls before navigation begins."
        hints={[
          { inputLabel: "A / Cross", label: "Activate controller" },
          { inputLabel: "Menu", label: "Open global menu after activation" },
        ]}
        layoutMode={args.layoutMode}
        state={controllerAccessStates.awaitingGesture}
        statusLabel="Press any controller button"
        title="Controller required"
      />
    </Frame>
  ),
};
