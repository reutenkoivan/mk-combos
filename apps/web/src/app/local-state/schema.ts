import { GameIdSchema } from "@mk-combos/contracts/identity/schema";
import {
  GameUserStateSchema,
  LanguageCodeSchema,
  LocalAppStateSchema,
  NotationDisplayModeSchema,
  ThemePreferenceSchema,
} from "@mk-combos/contracts/settings/schema";
import { z } from "zod/v4";

import { legacyLocalStateStorageVersion, localStateStorageVersion } from "./value";

const LegacyAppSettingsV1Schema = z
  .object({
    language: LanguageCodeSchema,
    defaultGameId: GameIdSchema,
    notationDisplayMode: NotationDisplayModeSchema,
    lastActiveGameId: GameIdSchema.optional(),
  })
  .strict();

const LegacyLocalAppStateV1Schema = z
  .object({
    settings: LegacyAppSettingsV1Schema,
    games: z.record(GameIdSchema, GameUserStateSchema),
  })
  .strict();

export const PersistedLocalStateV1Schema = z
  .object({
    version: z.literal(legacyLocalStateStorageVersion),
    firstLaunchCompleted: z.boolean(),
    state: LegacyLocalAppStateV1Schema,
  })
  .strict();

export const PersistedLocalStateSchema = z
  .object({
    version: z.literal(localStateStorageVersion),
    firstLaunchCompleted: z.boolean(),
    state: LocalAppStateSchema,
  })
  .strict();

export const LocalStateSettingsUpdateSchema = z
  .object({
    language: LanguageCodeSchema.optional(),
    notationDisplayMode: NotationDisplayModeSchema.optional(),
    themePreference: ThemePreferenceSchema.optional(),
  })
  .strict();

export const BrowserLocalePreferencesSchema = z
  .object({
    language: z.string().optional(),
    languages: z.array(z.string()).readonly().optional(),
  })
  .strict();
