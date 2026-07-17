import { notationDisplayModes } from "@mk-combos/contracts/settings/value";
import type { DisplayModeSwitcherProps } from "@mk-combos/ui/components/display-mode-switcher";
import type { LanguageSwitcherProps } from "@mk-combos/ui/components/language-switcher";
import {
  type NotationLegendTableProps,
  notationLegendTableLayouts,
} from "@mk-combos/ui/components/notation-legend-table";
import type { ThemePreferenceSwitcherProps } from "@mk-combos/ui/components/theme-preference-switcher";
import { uiResponsiveModes } from "@mk-combos/ui/components/value";
import { createNotationLegendRows } from "@mk-combos/ui/notation/runtime";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";

import {
  useLocalStateObservableState,
  useLocalStateSource,
} from "../../../../app/local-state/provider";
import { localStatePersistenceStatuses } from "../../../../app/local-state/value";
import { getAppCopy } from "../../../../app/localization/runtime";
import { useAppResponsiveMode } from "../../../../app/providers/provider";
import {
  displayModeOptions,
  getLanguageOptions,
  getThemePreferenceOptions,
} from "../../../../app/settings-options/runtime";

const settingsFormSurface = "settings-form";

export function useSettingsForm() {
  const localState = useLocalStateObservableState();
  const localStateSource = useLocalStateSource();
  const responsiveMode = useAppResponsiveMode();
  const [selectionFailed, setSelectionFailed] = useState(false);
  const form = useForm({
    defaultValues: {
      language: localState.appliedSettings.language,
      notationDisplayMode: localState.appliedSettings.notationDisplayMode,
      themePreference: localState.appliedSettings.themePreference,
    },
  });
  const appliedSettings = localState.appliedSettings;
  const copy = getAppCopy(appliedSettings.language);

  const languageSwitcher: LanguageSwitcherProps = {
    availableLanguages: getLanguageOptions(appliedSettings.language),
    label: copy.settings.languageLabel,
    onRequestSelectLanguage: ({ value }) => {
      const result = localStateSource.updateSettings({ language: value });

      if (result.ok) {
        form.setFieldValue("language", value);
      }
      setSelectionFailed(!result.ok);
    },
    selectedLanguage: appliedSettings.language,
    sourceSurface: settingsFormSurface,
  };
  const displayModeSwitcher: DisplayModeSwitcherProps = {
    availableDisplayModes: displayModeOptions,
    label: copy.settings.displayModeLabel,
    onRequestSelectDisplayMode: ({ value }) => {
      const result = localStateSource.updateSettings({ notationDisplayMode: value });

      if (result.ok) {
        form.setFieldValue("notationDisplayMode", value);
      }
      setSelectionFailed(!result.ok);
    },
    selectedDisplayMode: appliedSettings.notationDisplayMode,
    sourceSurface: settingsFormSurface,
  };
  const themePreferenceSwitcher: ThemePreferenceSwitcherProps = {
    availableThemePreferences: getThemePreferenceOptions({
      dark: copy.settings.themeDark,
      light: copy.settings.themeLight,
      system: copy.settings.themeSystem,
    }),
    label: copy.settings.themeLabel,
    onRequestSelectThemePreference: ({ value }) => {
      const result = localStateSource.updateSettings({ themePreference: value });

      if (result.ok) {
        form.setFieldValue("themePreference", value);
      }
      setSelectionFailed(!result.ok);
    },
    selectedThemePreference: appliedSettings.themePreference,
    sourceSurface: settingsFormSurface,
  };
  const notationLegend: NotationLegendTableProps = {
    caption: copy.settings.legendCaption,
    layout:
      responsiveMode === uiResponsiveModes.desktop
        ? notationLegendTableLayouts.table
        : responsiveMode === uiResponsiveModes.tablet
          ? notationLegendTableLayouts.stacked
          : notationLegendTableLayouts.compact,
    legendRows: createNotationLegendRows(Object.values(notationDisplayModes)),
    markersHeaderLabel: copy.settings.legendMarkersHeader,
    modeHeaderLabel: copy.settings.legendModeHeader,
  };
  const sessionOnly =
    localState.persistenceStatus === localStatePersistenceStatuses.sessionOnly && !selectionFailed;
  const status = selectionFailed
    ? copy.settings.persistenceError
    : sessionOnly
      ? copy.settings.sessionOnly
      : undefined;

  return {
    copy,
    displayModeSwitcher,
    languageSwitcher,
    notationLegend,
    persistenceError: selectionFailed,
    sessionOnly,
    status,
    themePreferenceSwitcher,
  };
}
