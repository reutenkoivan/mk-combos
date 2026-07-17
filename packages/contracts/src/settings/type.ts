import type { z } from "zod/v4";

import type {
  AppSettingsSchema,
  GameUserStateSchema,
  LanguageCodeSchema,
  LocalAppStateSchema,
  LocalizedTextSchema,
  NotationDisplayModeSchema,
  ThemePreferenceSchema,
} from "./schema";

export { languageCodes, notationDisplayModes, themePreferences } from "./value";

export type LanguageCode = z.output<typeof LanguageCodeSchema>;

export type NotationDisplayMode = z.output<typeof NotationDisplayModeSchema>;

export type ThemePreference = z.output<typeof ThemePreferenceSchema>;

export type LocalizedText = z.output<typeof LocalizedTextSchema>;

export type AppSettings = z.output<typeof AppSettingsSchema>;

export type GameUserState = z.output<typeof GameUserStateSchema>;

export type LocalAppState = z.output<typeof LocalAppStateSchema>;
