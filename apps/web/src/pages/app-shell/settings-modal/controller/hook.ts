import type {
  LanguageCode,
  NotationDisplayMode,
  ThemePreference,
} from "@mk-combos/contracts/settings/type";
import { knownControllerCommandIds } from "@mk-combos/controller-bridge/command/value";
import {
  type BackupCollapsibleBlockAction,
  type BackupCollapsibleBlockProps,
  backupCollapsibleBlockActions,
} from "@mk-combos/ui/components/backup-collapsible-block";
import type { DisplayModeSwitcherProps } from "@mk-combos/ui/components/display-mode-switcher";
import {
  type ExportDialogAction,
  exportDialogActions,
} from "@mk-combos/ui/components/export-dialog";
import {
  type ImportPreviewDialogAction,
  importPreviewDialogActions,
} from "@mk-combos/ui/components/import-preview-dialog";
import type { LanguageSwitcherProps } from "@mk-combos/ui/components/language-switcher";
import type { ThemePreferenceSwitcherProps } from "@mk-combos/ui/components/theme-preference-switcher";
import type { UiResponsiveMode } from "@mk-combos/ui/components/type";
import {
  backupDisclosureStates,
  backupValidationStatuses,
  componentInteractionReasons,
  componentOptionStatuses,
  uiResponsiveModes,
} from "@mk-combos/ui/components/value";
import { uiFocusDirections } from "@mk-combos/ui/focus-navigation/type";
import { useFocusNavigation } from "@mk-combos/ui/hooks/focus-navigation";
import { useMemo } from "react";

import { useControllerCommandScope } from "../../../../app/controller-session/provider";
import {
  controllerCommandRibbonShellPolicies,
  controllerCommandScopeLayers,
} from "../../../../app/controller-session/value";
import type { AppCopy } from "../../../../app/localization/type";
import { useAppResponsiveMode } from "../../../../app/providers/provider";
import type { SettingsTab } from "../navigation/type";
import { settingsTabs } from "../navigation/value";
import {
  createSettingsControllerFocusScope,
  type SettingsControllerFocusRowTarget,
} from "./runtime";

const settingsControllerTargetIds = {
  close: "settings-close",
  dialogBarrier: "settings-dialog-barrier",
  displayModePrefix: "settings-display-mode",
  languagePrefix: "settings-language",
  tabBackup: "settings-tab-backup",
  tabInterface: "settings-tab-interface",
  themePrefix: "settings-theme",
} as const;

const navigationCommandIds = [
  knownControllerCommandIds.navUp,
  knownControllerCommandIds.navDown,
  knownControllerCommandIds.navLeft,
  knownControllerCommandIds.navRight,
] as const;

const tabCommandIds = [
  knownControllerCommandIds.previousTab,
  knownControllerCommandIds.nextTab,
] as const;

type SettingsControllerBackupBlock = Readonly<{
  gameId: string;
  props: BackupCollapsibleBlockProps;
}>;

type SettingsControllerNavigation = Readonly<{
  closeLabel: string;
  closeSettings: () => void;
  selectSection: (tab: string) => void;
}>;

type UseSettingsControllerInput = Readonly<{
  activeSection: SettingsTab;
  backup: Readonly<{
    blocks: readonly SettingsControllerBackupBlock[];
    operationActive: boolean;
  }>;
  copy: AppCopy;
  displayModeSwitcher: DisplayModeSwitcherProps;
  languageSwitcher: LanguageSwitcherProps;
  navigation: SettingsControllerNavigation;
  open: boolean;
  themePreferenceSwitcher: ThemePreferenceSwitcherProps;
}>;

type SettingsModalTargetBase = Readonly<{
  id: string;
  label: string;
  requestAction: () => void;
}>;

type SettingsModalTarget =
  | (SettingsModalTargetBase & Readonly<{ type: "close" | "tab" }>)
  | (SettingsModalTargetBase &
      Readonly<{
        backupAction: BackupCollapsibleBlockAction;
        gameId: string;
        type: "backup";
      }>)
  | (SettingsModalTargetBase &
      Readonly<{ settingValue: NotationDisplayMode; type: "display-mode" }>)
  | (SettingsModalTargetBase & Readonly<{ settingValue: LanguageCode; type: "language" }>)
  | (SettingsModalTargetBase & Readonly<{ settingValue: ThemePreference; type: "theme" }>);

type SettingsDialogTarget = Readonly<{
  action: ExportDialogAction | ImportPreviewDialogAction;
  id: string;
  label: string;
  requestAction: () => void;
}>;

type SettingsDialogModel = Readonly<{
  busy: boolean;
  cancel: () => void;
  entryTargetId: string;
  kind: "export" | "import";
  rows: readonly (readonly SettingsControllerFocusRowTarget[])[];
  targets: ReadonlyMap<string, SettingsDialogTarget>;
}>;

function tabTargetId(tab: SettingsTab): string {
  return tab === settingsTabs.backup
    ? settingsControllerTargetIds.tabBackup
    : settingsControllerTargetIds.tabInterface;
}

function optionTargetId(prefix: string, value: string): string {
  return `${prefix}:${value}`;
}

function createIntentBase(sourceFocusTarget: string | undefined, sourceSurface: string) {
  return {
    reason: componentInteractionReasons.imperativeAction,
    sourceFocusTarget,
    sourceSurface,
  } as const;
}

function dialogRows(
  targets: readonly SettingsDialogTarget[],
  responsiveMode: UiResponsiveMode,
  busy: boolean,
): readonly (readonly SettingsControllerFocusRowTarget[])[] {
  const focusTargets = targets.map((target) => ({ disabled: busy, id: target.id }));

  return responsiveMode === uiResponsiveModes.mobile
    ? focusTargets
        .slice()
        .reverse()
        .map((target) => [target])
    : [focusTargets];
}

function createDialogModel(
  blocks: readonly SettingsControllerBackupBlock[],
  responsiveMode: UiResponsiveMode,
): SettingsDialogModel | undefined {
  const exportBlock = blocks.find((block) => block.props.exportDialog !== undefined);
  const exportDialog = exportBlock?.props.exportDialog;

  if (exportDialog !== undefined) {
    const prefix = exportDialog.sourceFocusTarget ?? "export-dialog";
    const busy = Boolean(exportDialog.busy);
    const targets: SettingsDialogTarget[] = [
      {
        action: exportDialogActions.cancelExport,
        id: `${prefix}:cancel`,
        label: exportDialog.cancelLabel,
        requestAction: () =>
          exportDialog.onRequestAction?.({
            action: exportDialogActions.cancelExport,
            ...createIntentBase(exportDialog.sourceFocusTarget, exportDialog.sourceSurface),
          }),
      },
    ];

    if (exportDialog.exportAvailability.available) {
      targets.push({
        action: exportDialogActions.confirmExport,
        id: `${prefix}:confirm`,
        label: exportDialog.confirmLabel,
        requestAction: () =>
          exportDialog.onRequestAction?.({
            action: exportDialogActions.confirmExport,
            ...createIntentBase(exportDialog.sourceFocusTarget, exportDialog.sourceSurface),
          }),
      });
    }

    return {
      busy,
      cancel: targets[0]?.requestAction ?? (() => undefined),
      entryTargetId: targets[0]?.id ?? `${prefix}:cancel`,
      kind: "export",
      rows: dialogRows(targets, responsiveMode, busy),
      targets: new Map(targets.map((target) => [target.id, target])),
    };
  }

  const importBlock = blocks.find((block) => block.props.importPreviewDialog !== undefined);
  const importDialog = importBlock?.props.importPreviewDialog;

  if (importDialog === undefined) {
    return undefined;
  }

  const prefix = importDialog.sourceFocusTarget ?? "import-dialog";
  const busy = Boolean(importDialog.busy);
  const emit = (action: ImportPreviewDialogAction) =>
    importDialog.onRequestAction?.({
      action,
      backupCandidateId: importDialog.backupCandidateId,
      ...createIntentBase(importDialog.sourceFocusTarget, importDialog.sourceSurface),
    });
  const targets: SettingsDialogTarget[] = [
    {
      action: importPreviewDialogActions.cancelImport,
      id: `${prefix}:cancel`,
      label: importDialog.cancelLabel,
      requestAction: () => emit(importPreviewDialogActions.cancelImport),
    },
    {
      action: importPreviewDialogActions.retryFileSelection,
      id: `${prefix}:retry`,
      label: importDialog.retryLabel,
      requestAction: () => emit(importPreviewDialogActions.retryFileSelection),
    },
  ];
  const canReplace =
    importDialog.confirmationAvailability.available &&
    (importDialog.validationResult.status === backupValidationStatuses.valid ||
      importDialog.validationResult.status === backupValidationStatuses.warning);

  if (canReplace) {
    targets.push({
      action: importPreviewDialogActions.confirmReplace,
      id: `${prefix}:confirm`,
      label: importDialog.confirmLabel,
      requestAction: () => emit(importPreviewDialogActions.confirmReplace),
    });
  }

  return {
    busy,
    cancel: targets[0]?.requestAction ?? (() => undefined),
    entryTargetId: targets[0]?.id ?? `${prefix}:cancel`,
    kind: "import",
    rows: dialogRows(targets, responsiveMode, busy),
    targets: new Map(targets.map((target) => [target.id, target])),
  };
}

function commandDirection(commandId: string) {
  switch (commandId) {
    case knownControllerCommandIds.navUp:
      return uiFocusDirections.up;
    case knownControllerCommandIds.navDown:
      return uiFocusDirections.down;
    case knownControllerCommandIds.navLeft:
      return uiFocusDirections.left;
    case knownControllerCommandIds.navRight:
      return uiFocusDirections.right;
    default:
      return undefined;
  }
}

export function useSettingsController(input: UseSettingsControllerInput) {
  const responsiveMode = useAppResponsiveMode();
  const pageModel = useMemo(() => {
    const rows: SettingsModalTarget[][] = [];
    const targets: SettingsModalTarget[] = [];
    const addRow = (row: SettingsModalTarget[]) => {
      rows.push(row);
      targets.push(...row);
    };
    const closeTarget: SettingsModalTarget = {
      id: settingsControllerTargetIds.close,
      label: input.navigation.closeLabel,
      requestAction: input.navigation.closeSettings,
      type: "close",
    };
    const interfaceTabTarget: SettingsModalTarget = {
      id: settingsControllerTargetIds.tabInterface,
      label: input.copy.settings.interfaceTab,
      requestAction: () => input.navigation.selectSection(settingsTabs.interface),
      type: "tab",
    };
    const backupTabTarget: SettingsModalTarget = {
      id: settingsControllerTargetIds.tabBackup,
      label: input.copy.settings.backupTab,
      requestAction: () => input.navigation.selectSection(settingsTabs.backup),
      type: "tab",
    };

    addRow([closeTarget]);
    addRow([interfaceTabTarget, backupTabTarget]);

    if (input.activeSection === settingsTabs.interface) {
      addRow(
        input.themePreferenceSwitcher.availableThemePreferences
          .filter((option) => option.status !== componentOptionStatuses.disabledUnavailable)
          .map((option) => ({
            id: optionTargetId(settingsControllerTargetIds.themePrefix, option.preference),
            label: option.label,
            requestAction: () =>
              input.themePreferenceSwitcher.onRequestSelectThemePreference?.({
                ...createIntentBase(
                  settingsControllerTargetIds.themePrefix,
                  input.themePreferenceSwitcher.sourceSurface,
                ),
                value: option.preference,
              }),
            settingValue: option.preference,
            type: "theme" as const,
          })),
      );
      addRow(
        input.languageSwitcher.availableLanguages
          .filter((option) => option.status !== componentOptionStatuses.disabledUnavailable)
          .map((option) => ({
            id: optionTargetId(settingsControllerTargetIds.languagePrefix, option.language),
            label: option.label,
            requestAction: () =>
              input.languageSwitcher.onRequestSelectLanguage?.({
                ...createIntentBase(
                  settingsControllerTargetIds.languagePrefix,
                  input.languageSwitcher.sourceSurface,
                ),
                value: option.language,
              }),
            settingValue: option.language,
            type: "language" as const,
          })),
      );
      addRow(
        input.displayModeSwitcher.availableDisplayModes
          .filter((option) => option.status !== componentOptionStatuses.disabledUnavailable)
          .map((option) => ({
            id: optionTargetId(settingsControllerTargetIds.displayModePrefix, option.mode),
            label: option.label,
            requestAction: () =>
              input.displayModeSwitcher.onRequestSelectDisplayMode?.({
                ...createIntentBase(
                  settingsControllerTargetIds.displayModePrefix,
                  input.displayModeSwitcher.sourceSurface,
                ),
                value: option.mode,
              }),
            settingValue: option.mode,
            type: "display-mode" as const,
          })),
      );
    } else {
      for (const block of input.backup.blocks) {
        const expanded = block.props.disclosureState === backupDisclosureStates.expanded;
        const headerAction = expanded
          ? backupCollapsibleBlockActions.collapse
          : backupCollapsibleBlockActions.expand;
        const emitBlockAction = (action: BackupCollapsibleBlockAction) =>
          block.props.onRequestAction?.({
            action,
            ...createIntentBase(block.props.sourceFocusTarget, block.props.sourceSurface),
          });

        addRow([
          {
            backupAction: headerAction,
            gameId: block.gameId,
            id: block.props.sourceFocusTarget ?? `settings-backup-${block.gameId}`,
            label: block.props.title,
            requestAction: () => emitBlockAction(headerAction),
            type: "backup",
          },
        ]);

        if (!expanded) {
          continue;
        }

        const actionTargets: SettingsModalTarget[] = [];

        if (block.props.exportAvailability.available) {
          actionTargets.push({
            backupAction: backupCollapsibleBlockActions.export,
            gameId: block.gameId,
            id: `${block.props.sourceFocusTarget ?? "backup"}:export`,
            label: block.props.exportLabel,
            requestAction: () => emitBlockAction(backupCollapsibleBlockActions.export),
            type: "backup",
          });
        }

        if (block.props.importAvailability.available) {
          actionTargets.push({
            backupAction: backupCollapsibleBlockActions.openFilePicker,
            gameId: block.gameId,
            id: `${block.props.sourceFocusTarget ?? "backup"}:import`,
            label: block.props.importLabel,
            requestAction: () => emitBlockAction(backupCollapsibleBlockActions.openFilePicker),
            type: "backup",
          });
        }

        if (responsiveMode === uiResponsiveModes.mobile) {
          for (const actionTarget of actionTargets) {
            addRow([actionTarget]);
          }
        } else if (actionTargets.length > 0) {
          addRow(actionTargets);
        }
      }
    }

    const scopeRows = rows
      .filter((row) => row.length > 0)
      .map((row) => row.map(({ id }) => ({ id })));
    const activeTabTargetId = tabTargetId(input.activeSection);
    const firstControlTargetIds = scopeRows[2]?.map(({ id }) => id) ?? [];
    const firstControlTargetId = firstControlTargetIds[0];
    const baseScope = createSettingsControllerFocusScope({
      entryTargetId: settingsControllerTargetIds.close,
      fallbackTargetId: settingsControllerTargetIds.close,
      id: "settings-modal",
      rows: scopeRows,
    });

    return {
      scope: {
        ...baseScope,
        targets: baseScope.targets.map((target) => {
          if (target.id === settingsControllerTargetIds.close) {
            return { ...target, neighbors: { ...target.neighbors, down: activeTabTargetId } };
          }

          if (
            target.id === settingsControllerTargetIds.tabInterface ||
            target.id === settingsControllerTargetIds.tabBackup
          ) {
            return {
              ...target,
              neighbors: { ...target.neighbors, down: firstControlTargetId },
            };
          }

          if (firstControlTargetIds.includes(target.id)) {
            return { ...target, neighbors: { ...target.neighbors, up: activeTabTargetId } };
          }

          return target;
        }),
      },
      targets: new Map(targets.map((target) => [target.id, target])),
    };
  }, [input, responsiveMode]);
  const pageFocus = useFocusNavigation({
    initialTargetId: settingsControllerTargetIds.close,
    scope: pageModel.scope,
  });
  const focusedPageTarget = pageFocus.state.focusedTargetId
    ? pageModel.targets.get(pageFocus.state.focusedTargetId)
    : undefined;
  const otherSection =
    input.activeSection === settingsTabs.interface ? settingsTabs.backup : settingsTabs.interface;
  const otherSectionLabel =
    otherSection === settingsTabs.backup
      ? input.copy.settings.backupTab
      : input.copy.settings.interfaceTab;

  useControllerCommandScope({
    commandIds: [
      ...navigationCommandIds,
      knownControllerCommandIds.confirm,
      knownControllerCommandIds.back,
      ...tabCommandIds,
    ],
    handleCommand: (event) => {
      const direction = commandDirection(event.commandId);

      if (direction !== undefined) {
        pageFocus.methods.moveFocus(direction);
        return true;
      }

      switch (event.commandId) {
        case knownControllerCommandIds.confirm:
          if (focusedPageTarget === undefined) {
            return false;
          }
          focusedPageTarget.requestAction();
          return true;
        case knownControllerCommandIds.previousTab:
        case knownControllerCommandIds.nextTab:
          pageFocus.methods.focusTarget(tabTargetId(otherSection));
          input.navigation.selectSection(otherSection);
          return true;
        case knownControllerCommandIds.back:
          input.navigation.closeSettings();
          return true;
        default:
          return false;
      }
    },
    enabled: input.open,
    exclusive: true,
    id: "settings-modal-controller",
    layer: controllerCommandScopeLayers.overlay,
    ribbon: {
      accessibleLabel: input.copy.settings.sectionsLabel,
      commands: [
        {
          commandIds: navigationCommandIds,
          id: "settings-navigation",
          label: input.copy.catalog.navigateCommand,
        },
        ...(focusedPageTarget
          ? [
              {
                commandIds: [knownControllerCommandIds.confirm],
                id: "settings-confirm",
                label: focusedPageTarget.label,
              },
            ]
          : []),
        {
          commandIds: [knownControllerCommandIds.previousTab],
          id: "settings-previous-tab",
          label: otherSectionLabel,
        },
        {
          commandIds: [knownControllerCommandIds.nextTab],
          id: "settings-next-tab",
          label: otherSectionLabel,
        },
        {
          commandIds: [knownControllerCommandIds.back],
          id: "settings-back",
          label: input.navigation.closeLabel,
        },
      ],
      shellPolicy: controllerCommandRibbonShellPolicies.suppress,
    },
  });

  const dialog = useMemo(
    () => createDialogModel(input.backup.blocks, responsiveMode),
    [input.backup.blocks, responsiveMode],
  );
  const dialogScope = useMemo(() => {
    const rows = dialog?.rows ?? [
      [{ disabled: true, id: settingsControllerTargetIds.dialogBarrier }],
    ];
    const entryTargetId = dialog?.entryTargetId ?? settingsControllerTargetIds.dialogBarrier;

    return createSettingsControllerFocusScope({
      entryTargetId,
      fallbackTargetId: entryTargetId,
      id: "settings-dialog",
      rows,
    });
  }, [dialog]);
  const dialogFocus = useFocusNavigation({ scope: dialogScope });
  const focusedDialogTarget = dialogFocus.state.focusedTargetId
    ? dialog?.targets.get(dialogFocus.state.focusedTargetId)
    : undefined;
  const dialogCommandIds = dialog?.busy
    ? [knownControllerCommandIds.back]
    : [...navigationCommandIds, knownControllerCommandIds.confirm, knownControllerCommandIds.back];

  useControllerCommandScope({
    commandIds: dialogCommandIds,
    enabled: dialog !== undefined,
    exclusive: true,
    handleCommand: (event) => {
      if (dialog === undefined) {
        return false;
      }

      if (event.commandId === knownControllerCommandIds.back) {
        dialog.cancel();
        return true;
      }

      if (dialog.busy) {
        return false;
      }

      const direction = commandDirection(event.commandId);

      if (direction !== undefined) {
        dialogFocus.methods.moveFocus(direction);
        return true;
      }

      if (event.commandId === knownControllerCommandIds.confirm && focusedDialogTarget) {
        focusedDialogTarget.requestAction();
        return true;
      }

      return false;
    },
    id: "settings-dialog-controller",
    layer: controllerCommandScopeLayers.overlay,
    ribbon: {
      accessibleLabel: input.copy.settings.backupTab,
      commands: dialog?.busy
        ? []
        : [
            ...(dialog && dialog.targets.size > 1
              ? [
                  {
                    commandIds: navigationCommandIds,
                    id: "settings-dialog-navigation",
                    label: input.copy.catalog.navigateCommand,
                  },
                ]
              : []),
            ...(focusedDialogTarget
              ? [
                  {
                    commandIds: [knownControllerCommandIds.confirm],
                    id: "settings-dialog-confirm",
                    label: focusedDialogTarget.label,
                  },
                ]
              : []),
            ...(dialog
              ? [
                  {
                    commandIds: [knownControllerCommandIds.back],
                    id: "settings-dialog-back",
                    label: input.copy.backup.cancel,
                  },
                ]
              : []),
          ],
      shellPolicy: controllerCommandRibbonShellPolicies.suppress,
    },
  });

  useControllerCommandScope({
    commandIds: [],
    enabled: input.backup.operationActive && dialog === undefined,
    exclusive: true,
    handleCommand: () => false,
    id: "settings-backup-operation-barrier",
    layer: controllerCommandScopeLayers.overlay,
    ribbon: {
      accessibleLabel: input.copy.settings.backupTab,
      commands: [],
      shellPolicy: controllerCommandRibbonShellPolicies.suppress,
    },
  });

  const visiblyFocusedPageTarget =
    !input.backup.operationActive &&
    focusedPageTarget &&
    pageFocus.methods.isFocused(focusedPageTarget.id)
      ? focusedPageTarget
      : undefined;
  const visiblyFocusedDialogTarget =
    focusedDialogTarget && dialogFocus.methods.isFocused(focusedDialogTarget.id)
      ? focusedDialogTarget
      : undefined;
  const getPageTargetAttributes = (targetId: string) => {
    const attributes = pageFocus.methods.getTargetAttributes(targetId);

    return input.backup.operationActive
      ? { ...attributes, "data-controller-focused": undefined }
      : attributes;
  };

  return {
    backupFocusedAction: (gameId: string) =>
      visiblyFocusedPageTarget?.type === "backup" && visiblyFocusedPageTarget.gameId === gameId
        ? visiblyFocusedPageTarget.backupAction
        : undefined,
    displayModeSwitcherFocusProps: {
      controllerFocusedDisplayMode:
        visiblyFocusedPageTarget?.type === "display-mode"
          ? visiblyFocusedPageTarget.settingValue
          : undefined,
      sourceFocusTarget: settingsControllerTargetIds.displayModePrefix,
    },
    exportDialogFocusedAction:
      dialog?.kind === "export"
        ? (visiblyFocusedDialogTarget?.action as ExportDialogAction | undefined)
        : undefined,
    importDialogFocusedAction:
      dialog?.kind === "import"
        ? (visiblyFocusedDialogTarget?.action as ImportPreviewDialogAction | undefined)
        : undefined,
    languageSwitcherFocusProps: {
      controllerFocusedLanguage:
        visiblyFocusedPageTarget?.type === "language"
          ? visiblyFocusedPageTarget.settingValue
          : undefined,
      sourceFocusTarget: settingsControllerTargetIds.languagePrefix,
    },
    closeFocusProps: getPageTargetAttributes(settingsControllerTargetIds.close),
    tabBackupFocusProps: getPageTargetAttributes(settingsControllerTargetIds.tabBackup),
    tabInterfaceFocusProps: getPageTargetAttributes(settingsControllerTargetIds.tabInterface),
    themePreferenceSwitcherFocusProps: {
      controllerFocusedThemePreference:
        visiblyFocusedPageTarget?.type === "theme"
          ? visiblyFocusedPageTarget.settingValue
          : undefined,
      sourceFocusTarget: settingsControllerTargetIds.themePrefix,
    },
  };
}
