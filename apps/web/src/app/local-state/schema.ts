import { GameRouteSchema } from "@mk-combos/contracts/routes/schema";
import {
  LanguageCodeSchema,
  LocalAppStateSchema,
  NotationDisplayModeSchema,
} from "@mk-combos/contracts/settings/schema";
import { z } from "zod/v4";

import { localStateStorageVersion } from "./value";

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
  })
  .strict();

export const BrowserLocalePreferencesSchema = z
  .object({
    language: z.string().optional(),
    languages: z.array(z.string()).readonly().optional(),
  })
  .strict();

export const SettingsReturnTargetSchema = GameRouteSchema;
