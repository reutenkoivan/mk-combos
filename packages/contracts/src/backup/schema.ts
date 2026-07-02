import { z } from "zod/v4";

import { GameIdSchema } from "../identity/schema";
import { AppSettingsSchema } from "../settings/schema";

export const createBackupEnvelopeSchema = <GameSliceSchema extends z.ZodType = z.ZodUnknown>(
  gameSliceSchema: GameSliceSchema = z.unknown() as unknown as GameSliceSchema,
) =>
  z
    .object({
      version: z.number().int().positive(),
      exportedAt: z.iso.datetime(),
      settings: AppSettingsSchema,
      games: z.record(GameIdSchema, gameSliceSchema),
    })
    .strict();

export const BackupEnvelopeSchema = createBackupEnvelopeSchema();
