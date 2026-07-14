import { AppSettingsSchema } from "@mk-combos/contracts/settings/schema";
import type {
  AppSettings,
  LanguageCode,
  NotationDisplayMode,
} from "@mk-combos/contracts/settings/type";
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
import { createNotationLegendRows } from "@mk-combos/ui/notation/runtime";
import { useForm, useSelector } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

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
  const copy = getAppCopy(values.language).firstLaunch;
  const selectedGameAvailable = resolveInstalledGame(values.gameId) !== undefined;

  useEffect(() => {
    document.documentElement.lang = htmlLanguageByAppLanguage[values.language];

    return () => {
      document.documentElement.lang =
        htmlLanguageByAppLanguage[localState.appliedSettings.language];
    };
  }, [localState.appliedSettings.language, values.language]);

  const formProps: FirstLaunchSetupFormProps = {
    confirmAvailable: selectedGameAvailable,
    confirmDisabledReason: selectedGameAvailable ? undefined : copy.confirmDisabled,
    confirmLabel: copy.confirm,
    displayModeSwitcher: {
      availableDisplayModes: displayModeOptions,
      label: copy.displayModeLabel,
      onRequestSelectDisplayMode: ({ value }) => {
        setSubmissionError(undefined);
        form.setFieldValue("notationDisplayMode", value);
      },
      selectedDisplayMode: values.notationDisplayMode,
      sourceSurface: "first-launch",
    },
    gameSwitcher: {
      availableGames: installedGameOptions,
      context: gameSwitcherContexts.firstLaunch,
      label: copy.gameLabel,
      menuOpen: gameMenuOpen,
      onRequestMenuChange: ({ action }) => setGameMenuOpen(action === gameSwitcherMenuActions.open),
      onRequestSelectGame: ({ value }) => {
        if (resolveInstalledGame(value) === undefined) {
          setSubmissionError(copy.confirmDisabled);
          return;
        }

        setSubmissionError(undefined);
        form.setFieldValue("gameId", value);
        setGameMenuOpen(false);
      },
      selectedGameId: values.gameId,
      sourceSurface: "first-launch",
    },
    languageSwitcher: {
      availableLanguages: getLanguageOptions(values.language),
      label: copy.languageLabel,
      onRequestSelectLanguage: ({ value }) => {
        setSubmissionError(undefined);
        form.setFieldValue("language", value);
      },
      selectedLanguage: values.language,
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
    persistenceMessage:
      localState.persistenceStatus === localStatePersistenceStatuses.sessionOnly
        ? copy.sessionOnly
        : undefined,
    saving,
    sessionOnlyAcknowledgeLabel:
      localState.persistenceStatus === localStatePersistenceStatuses.sessionOnly
        ? copy.sessionOnlyAcknowledge
        : undefined,
    sourceSurface: "first-launch",
    title: copy.formTitle,
    validationMessage: submissionError,
  };

  return {
    copy,
    formProps,
    responsiveMode,
    showSetup:
      hydratedDefaultsApplied &&
      localState.hydrationStatus === localStateHydrationStatuses.ready &&
      !localState.firstLaunchCompleted,
  };
}
