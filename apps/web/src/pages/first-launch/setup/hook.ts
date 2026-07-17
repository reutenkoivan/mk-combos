import { AppSettingsSchema } from "@mk-combos/contracts/settings/schema";
import type {
  AppSettings,
  LanguageCode,
  NotationDisplayMode,
} from "@mk-combos/contracts/settings/type";
import { knownControllerCommandIds } from "@mk-combos/controller-bridge/command/value";
import {
  type FirstLaunchSetupFormProps,
  firstLaunchSetupFormActions,
} from "@mk-combos/ui/components/first-launch-setup-form";
import {
  gameSwitcherContexts,
  gameSwitcherMenuActions,
} from "@mk-combos/ui/components/game-switcher";
import { notationLegendTableLayouts } from "@mk-combos/ui/components/notation-legend-table";
import type { UiResponsiveMode } from "@mk-combos/ui/components/type";
import { componentOptionStatuses } from "@mk-combos/ui/components/value";
import { createNotationLegendRows } from "@mk-combos/ui/notation/runtime";
import { useForm, useSelector } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { useControllerCommandScope } from "../../../app/controller-session/provider";
import {
  controllerCommandRibbonShellPolicies,
  controllerCommandScopeLayers,
} from "../../../app/controller-session/value";
import {
  useLocalStateObservableState,
  useLocalStateSource,
} from "../../../app/local-state/provider";
import {
  htmlLanguageByAppLanguage,
  localStateHydrationStatuses,
  localStatePersistenceStatuses,
} from "../../../app/local-state/value";
import { getAppCopy } from "../../../app/localization/runtime";
import type { AppCopy } from "../../../app/localization/type";
import { useAppResponsiveMode } from "../../../app/providers/provider";
import { displayModeOptions, getLanguageOptions } from "../../../app/settings-options/runtime";
import { installedGameOptions } from "../../../game-business/installed-games/presentation";
import { resolveInstalledGame } from "../../../game-business/installed-games/runtime";

type FirstLaunchFormValues = Readonly<{
  gameId: string;
  language: LanguageCode;
  notationDisplayMode: NotationDisplayMode;
}>;

const firstLaunchFocusTargets = {
  game: "first-launch-game",
  submit: "first-launch-submit",
} as const;

const firstLaunchLanguageTarget = (language: LanguageCode) => `first-launch-language-${language}`;
const firstLaunchDisplayTarget = (mode: NotationDisplayMode) => `first-launch-display-${mode}`;
const navigationCommandIds = [
  knownControllerCommandIds.navUp,
  knownControllerCommandIds.navDown,
  knownControllerCommandIds.navLeft,
  knownControllerCommandIds.navRight,
] as const;

function moveOption<T>(values: readonly T[], currentIndex: number, delta: number) {
  if (values.length === 0) {
    return undefined;
  }

  return values[Math.max(0, Math.min(values.length - 1, currentIndex + delta))];
}

function moveCircularOption<T>(values: readonly T[], currentIndex: number, delta: number) {
  if (values.length === 0) {
    return undefined;
  }

  const normalizedIndex = currentIndex < 0 ? 0 : currentIndex;
  return values[(normalizedIndex + delta + values.length) % values.length];
}

type FirstLaunchSetupModel = Readonly<{
  copy: AppCopy["firstLaunch"];
  formProps: FirstLaunchSetupFormProps;
  responsiveMode: UiResponsiveMode;
  showSetup: boolean;
}>;

function createFormValues(settings: AppSettings): FirstLaunchFormValues {
  return {
    gameId: settings.defaultGameId,
    language: settings.language,
    notationDisplayMode: settings.notationDisplayMode,
  };
}

export function useFirstLaunchSetup(): FirstLaunchSetupModel {
  const localState = useLocalStateObservableState();
  const localStateSource = useLocalStateSource();
  const responsiveMode = useAppResponsiveMode();
  const navigate = useNavigate();
  const persistenceStatusRef = useRef(localState.persistenceStatus);
  persistenceStatusRef.current = localState.persistenceStatus;
  const [gameMenuOpen, setGameMenuOpen] = useState(false);
  const [focusedTarget, setFocusedTarget] = useState<string>(firstLaunchFocusTargets.game);
  const [focusedGameId, setFocusedGameId] = useState<string>();
  const [submissionError, setSubmissionError] = useState<string>();
  const [hydratedDefaultsApplied, setHydratedDefaultsApplied] = useState(false);
  const form = useForm({
    defaultValues: createFormValues(localState.appliedSettings),
    onSubmit: async ({ value }) => {
      const selectedGame = resolveInstalledGame(value.gameId);
      const parsedSettings = AppSettingsSchema.safeParse({
        defaultGameId: value.gameId,
        language: value.language,
        lastActiveGameId: value.gameId,
        notationDisplayMode: value.notationDisplayMode,
        themePreference: localState.appliedSettings.themePreference,
      });

      if (selectedGame === undefined || !parsedSettings.success) {
        setSubmissionError(getAppCopy(value.language).firstLaunch.confirmDisabled);
        return;
      }

      setSubmissionError(undefined);
      const persistenceStatusBeforeSubmission = persistenceStatusRef.current;
      const result = localStateSource.completeFirstLaunch(parsedSettings.data);

      if (!result.ok) {
        setSubmissionError(getAppCopy(value.language).firstLaunch.submissionError);
        return;
      }

      if (
        persistenceStatusBeforeSubmission === localStatePersistenceStatuses.persistent &&
        result.persistenceStatus === localStatePersistenceStatuses.sessionOnly
      ) {
        return;
      }

      await navigate({
        params: { gameId: selectedGame.id },
        replace: true,
        search: {},
        to: "/$gameId/catalog",
      });
    },
  });

  useEffect(() => {
    if (
      hydratedDefaultsApplied ||
      localState.hydrationStatus !== localStateHydrationStatuses.ready
    ) {
      return;
    }

    form.reset(createFormValues(localState.appliedSettings));
    setHydratedDefaultsApplied(true);
  }, [form, hydratedDefaultsApplied, localState.appliedSettings, localState.hydrationStatus]);

  const values = useSelector(form.store, (state) => state.values);
  const saving = useSelector(form.store, (state) => state.isSubmitting);
  const appCopy = getAppCopy(values.language);
  const copy = appCopy.firstLaunch;
  const selectedGameAvailable = resolveInstalledGame(values.gameId) !== undefined;
  const languageOptions = getLanguageOptions(values.language).filter(
    (option) => option.status !== componentOptionStatuses.disabledUnavailable,
  );
  const availableDisplayModes = displayModeOptions.filter(
    (option) => option.status !== componentOptionStatuses.disabledUnavailable,
  );
  const availableGames = installedGameOptions.filter(
    (option) => option.status !== componentOptionStatuses.disabledUnavailable,
  );
  const showSetup =
    hydratedDefaultsApplied &&
    localState.hydrationStatus === localStateHydrationStatuses.ready &&
    !localState.firstLaunchCompleted;
  const sessionOnly = localState.persistenceStatus === localStatePersistenceStatuses.sessionOnly;
  const submitAction = sessionOnly
    ? firstLaunchSetupFormActions.acknowledgeSessionOnly
    : firstLaunchSetupFormActions.confirm;
  const submitLabel = sessionOnly ? copy.sessionOnlyAcknowledge : copy.confirm;
  const focusedLanguage = languageOptions.find(
    (option) => firstLaunchLanguageTarget(option.language) === focusedTarget,
  );
  const focusedDisplayMode = availableDisplayModes.find(
    (option) => firstLaunchDisplayTarget(option.mode) === focusedTarget,
  );
  const focusedGame =
    availableGames.find((option) => option.gameId === focusedGameId) ?? availableGames[0];

  const selectGame = useCallback(
    (gameId: string) => {
      if (resolveInstalledGame(gameId) === undefined) {
        setSubmissionError(copy.confirmDisabled);
        return;
      }

      setSubmissionError(undefined);
      form.setFieldValue("gameId", gameId);
      setGameMenuOpen(false);
      setFocusedTarget(firstLaunchFocusTargets.game);
    },
    [copy.confirmDisabled, form],
  );
  const selectLanguage = useCallback(
    (language: LanguageCode) => {
      setSubmissionError(undefined);
      form.setFieldValue("language", language);
    },
    [form],
  );
  const selectDisplayMode = useCallback(
    (mode: NotationDisplayMode) => {
      setSubmissionError(undefined);
      form.setFieldValue("notationDisplayMode", mode);
    },
    [form],
  );
  const openGameMenu = useCallback(() => {
    setFocusedGameId(
      availableGames.find((game) => game.gameId === values.gameId)?.gameId ??
        availableGames[0]?.gameId,
    );
    setGameMenuOpen(true);
  }, [availableGames, values.gameId]);

  useEffect(() => {
    document.documentElement.lang = htmlLanguageByAppLanguage[values.language];

    return () => {
      document.documentElement.lang =
        htmlLanguageByAppLanguage[localState.appliedSettings.language];
    };
  }, [localState.appliedSettings.language, values.language]);

  useControllerCommandScope({
    commandIds: [...navigationCommandIds, knownControllerCommandIds.confirm],
    enabled: showSetup && !saving && !gameMenuOpen,
    handleCommand: (event) => {
      const languageIndex = languageOptions.findIndex(
        (option) => option.language === focusedLanguage?.language,
      );
      const displayIndex = availableDisplayModes.findIndex(
        (option) => option.mode === focusedDisplayMode?.mode,
      );
      const selectedLanguageIndex = Math.max(
        0,
        languageOptions.findIndex((option) => option.language === values.language),
      );
      const selectedDisplayIndex = Math.max(
        0,
        availableDisplayModes.findIndex((option) => option.mode === values.notationDisplayMode),
      );

      switch (event.commandId) {
        case knownControllerCommandIds.navLeft:
        case knownControllerCommandIds.navRight:
          if (focusedLanguage) {
            const next = moveOption(
              languageOptions,
              languageIndex,
              event.commandId === knownControllerCommandIds.navLeft ? -1 : 1,
            );
            if (next) {
              setFocusedTarget(firstLaunchLanguageTarget(next.language));
            }
          } else if (focusedDisplayMode) {
            const next = moveOption(
              availableDisplayModes,
              displayIndex,
              event.commandId === knownControllerCommandIds.navLeft ? -1 : 1,
            );
            if (next) {
              setFocusedTarget(firstLaunchDisplayTarget(next.mode));
            }
          }
          return true;
        case knownControllerCommandIds.navUp:
          if (focusedTarget === firstLaunchFocusTargets.game) {
            return true;
          }
          if (focusedLanguage) {
            setFocusedTarget(firstLaunchFocusTargets.game);
            return true;
          }
          if (focusedDisplayMode) {
            const target =
              languageOptions[Math.min(displayIndex, languageOptions.length - 1)] ??
              languageOptions[selectedLanguageIndex];
            if (target) {
              setFocusedTarget(firstLaunchLanguageTarget(target.language));
            }
            return true;
          }
          if (focusedTarget === firstLaunchFocusTargets.submit) {
            const target = availableDisplayModes[selectedDisplayIndex];
            if (target) {
              setFocusedTarget(firstLaunchDisplayTarget(target.mode));
            }
            return true;
          }
          setFocusedTarget(firstLaunchFocusTargets.game);
          return true;
        case knownControllerCommandIds.navDown:
          if (focusedTarget === firstLaunchFocusTargets.game) {
            const target = languageOptions[selectedLanguageIndex];
            if (target) {
              setFocusedTarget(firstLaunchLanguageTarget(target.language));
            }
            return true;
          }
          if (focusedLanguage) {
            const target =
              availableDisplayModes[Math.min(languageIndex, availableDisplayModes.length - 1)] ??
              availableDisplayModes[selectedDisplayIndex];
            if (target) {
              setFocusedTarget(firstLaunchDisplayTarget(target.mode));
            }
            return true;
          }
          if (focusedDisplayMode) {
            setFocusedTarget(firstLaunchFocusTargets.submit);
          }
          return true;
        case knownControllerCommandIds.confirm:
          if (focusedTarget === firstLaunchFocusTargets.game) {
            openGameMenu();
            return true;
          }
          if (focusedLanguage) {
            selectLanguage(focusedLanguage.language);
            return true;
          }
          if (focusedDisplayMode) {
            selectDisplayMode(focusedDisplayMode.mode);
            return true;
          }
          if (focusedTarget === firstLaunchFocusTargets.submit && selectedGameAvailable) {
            void form.handleSubmit();
            return true;
          }
          return false;
        default:
          return false;
      }
    },
    id: "first-launch-page",
    layer: controllerCommandScopeLayers.page,
    ribbon: {
      accessibleLabel: copy.formTitle,
      commands: [
        {
          commandIds: navigationCommandIds,
          id: "first-launch-navigation",
          label: appCopy.catalog.navigateCommand,
        },
        {
          commandIds: [knownControllerCommandIds.confirm],
          id: "first-launch-confirm",
          label:
            focusedTarget === firstLaunchFocusTargets.game
              ? copy.gameLabel
              : (focusedLanguage?.label ?? focusedDisplayMode?.label ?? submitLabel),
        },
      ],
      notationDisplayModeOverride: values.notationDisplayMode,
      shellPolicy: controllerCommandRibbonShellPolicies.suppress,
    },
  });

  useControllerCommandScope({
    commandIds: [
      ...navigationCommandIds,
      knownControllerCommandIds.confirm,
      knownControllerCommandIds.back,
    ],
    enabled: showSetup && !saving && gameMenuOpen,
    exclusive: true,
    handleCommand: (event) => {
      switch (event.commandId) {
        case knownControllerCommandIds.navLeft:
        case knownControllerCommandIds.navRight:
          return true;
        case knownControllerCommandIds.navUp:
        case knownControllerCommandIds.navDown: {
          const next = moveCircularOption(
            availableGames,
            availableGames.findIndex((game) => game.gameId === focusedGame?.gameId),
            event.commandId === knownControllerCommandIds.navUp ? -1 : 1,
          );
          if (next) {
            setFocusedGameId(next.gameId);
          }
          return true;
        }
        case knownControllerCommandIds.confirm:
          if (!focusedGame) {
            return false;
          }
          selectGame(focusedGame.gameId);
          return true;
        case knownControllerCommandIds.back:
          setGameMenuOpen(false);
          setFocusedTarget(firstLaunchFocusTargets.game);
          return true;
        default:
          return false;
      }
    },
    id: "first-launch-game-menu",
    layer: controllerCommandScopeLayers.overlay,
    ribbon: {
      accessibleLabel: copy.gameLabel,
      commands: [
        {
          commandIds: navigationCommandIds,
          id: "first-launch-game-navigation",
          label: appCopy.catalog.navigateCommand,
        },
        ...(focusedGame
          ? [
              {
                commandIds: [knownControllerCommandIds.confirm],
                id: "first-launch-game-confirm",
                label: focusedGame.label,
              },
            ]
          : []),
        {
          commandIds: [knownControllerCommandIds.back],
          id: "first-launch-game-back",
          label: appCopy.shell.closeNavigation,
        },
      ],
      notationDisplayModeOverride: values.notationDisplayMode,
      shellPolicy: controllerCommandRibbonShellPolicies.suppress,
    },
  });

  const formProps: FirstLaunchSetupFormProps = {
    confirmAvailable: selectedGameAvailable,
    confirmDisabledReason: selectedGameAvailable ? undefined : copy.confirmDisabled,
    confirmLabel: copy.confirm,
    controllerFocusedAction:
      !gameMenuOpen && focusedTarget === firstLaunchFocusTargets.submit ? submitAction : undefined,
    displayModeSwitcher: {
      availableDisplayModes: displayModeOptions,
      busy: saving,
      controllerFocusedDisplayMode: gameMenuOpen ? undefined : focusedDisplayMode?.mode,
      label: copy.displayModeLabel,
      onRequestSelectDisplayMode: ({ value }) => selectDisplayMode(value),
      selectedDisplayMode: values.notationDisplayMode,
      sourceFocusTarget: "first-launch-display",
      sourceSurface: "first-launch",
    },
    gameSwitcher: {
      availableGames: installedGameOptions,
      busy: saving,
      controllerFocused: !gameMenuOpen && focusedTarget === firstLaunchFocusTargets.game,
      controllerFocusedGameId: gameMenuOpen ? focusedGame?.gameId : undefined,
      context: gameSwitcherContexts.firstLaunch,
      label: copy.gameLabel,
      menuOpen: gameMenuOpen,
      onRequestMenuChange: ({ action }) =>
        action === gameSwitcherMenuActions.open ? openGameMenu() : setGameMenuOpen(false),
      onRequestSelectGame: ({ value }) => selectGame(value),
      selectedGameId: values.gameId,
      sourceFocusTarget: firstLaunchFocusTargets.game,
      sourceSurface: "first-launch",
    },
    languageSwitcher: {
      availableLanguages: getLanguageOptions(values.language),
      busy: saving,
      controllerFocusedLanguage: gameMenuOpen ? undefined : focusedLanguage?.language,
      label: copy.languageLabel,
      onRequestSelectLanguage: ({ value }) => selectLanguage(value),
      selectedLanguage: values.language,
      sourceFocusTarget: "first-launch-language",
      sourceSurface: "first-launch",
    },
    notationLegend: {
      caption: copy.legendCaption,
      layout: notationLegendTableLayouts.compact,
      legendRows: createNotationLegendRows([values.notationDisplayMode]),
      markersHeaderLabel: copy.legendMarkersHeader,
      modeHeaderLabel: copy.legendModeHeader,
    },
    onRequestAction: ({ action }) => {
      if (
        action === firstLaunchSetupFormActions.confirm ||
        action === firstLaunchSetupFormActions.acknowledgeSessionOnly
      ) {
        void form.handleSubmit();
      }
    },
    persistenceMessage: sessionOnly ? copy.sessionOnly : undefined,
    saving,
    sessionOnlyAcknowledgeLabel: sessionOnly ? copy.sessionOnlyAcknowledge : undefined,
    sourceFocusTarget: firstLaunchFocusTargets.submit,
    sourceSurface: "first-launch",
    title: copy.formTitle,
    validationMessage: submissionError,
  };

  return {
    copy,
    formProps,
    responsiveMode,
    showSetup,
  };
}
