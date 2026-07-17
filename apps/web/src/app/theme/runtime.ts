import type { ThemePreference } from "@mk-combos/contracts/settings/type";
import { themePreferences } from "@mk-combos/contracts/settings/value";
import type { UiThemeMode } from "@mk-combos/ui/tokens/type";
import { uiThemeModes } from "@mk-combos/ui/tokens/value";

export function resolveThemePreference(
  preference: ThemePreference,
  systemTheme: UiThemeMode,
): UiThemeMode {
  if (preference === themePreferences.dark) {
    return uiThemeModes.dark;
  }

  if (preference === themePreferences.light) {
    return uiThemeModes.light;
  }

  return systemTheme;
}
