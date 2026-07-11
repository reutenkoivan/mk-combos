import { z } from "zod/v4";

import { GameIdSchema } from "../identity/schema";
import { AppSettingsSchema } from "../settings/schema";

const UnknownGameSliceSchema = z.unknown();

const createBackupEnvelopeSchemaWithSlice = <GameSliceSchema extends z.ZodType>(
  gameSliceSchema: GameSliceSchema,
) =>
  z
    .object({
      version: z.number().int().positive(),
      exportedAt: z.iso.datetime(),
      settings: AppSettingsSchema,
      games: z.record(GameIdSchema, gameSliceSchema),
    })
    .strict();

export function createBackupEnvelopeSchema(): ReturnType<
  typeof createBackupEnvelopeSchemaWithSlice<typeof UnknownGameSliceSchema>
>;
export function createBackupEnvelopeSchema<GameSliceSchema extends z.ZodType>(
  gameSliceSchema: GameSliceSchema,
): ReturnType<typeof createBackupEnvelopeSchemaWithSlice<GameSliceSchema>>;
export function createBackupEnvelopeSchema(gameSliceSchema: z.ZodType = UnknownGameSliceSchema) {
  return createBackupEnvelopeSchemaWithSlice(gameSliceSchema);
}

export const BackupEnvelopeSchema = createBackupEnvelopeSchema();
