import { z } from "zod/v4";

import { GameIdSchema } from "../identity/schema";
import { languageCodes, notationDisplayModes } from "./value";

export { languageCodes, notationDisplayModes } from "./value";

export const LanguageCodeSchema = z.enum(languageCodes);

export const NotationDisplayModeSchema = z.enum(notationDisplayModes);

export const LocalizedTextSchema = z
  .object({
    EN: z.string().optional(),
    UA: z.string().optional(),
    default: z.string().optional(),
    fallback: z.string().optional(),
  })
  .strict();

export const AppSettingsSchema = z
  .object({
    language: LanguageCodeSchema,
    defaultGameId: GameIdSchema,
    notationDisplayMode: NotationDisplayModeSchema,
    lastActiveGameId: GameIdSchema.optional(),
  })
  .strict();

export const GameUserStateSchema = z.record(z.string(), z.unknown());

export const LocalAppStateSchema = z
  .object({
    settings: AppSettingsSchema,
    games: z.record(GameIdSchema, GameUserStateSchema),
  })
  .strict();
