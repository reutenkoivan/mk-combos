import { z } from "zod/v4";

import { GameIdSchema } from "../identity/schema";

const UnknownGameSliceSchema = z.json();

const createGameBackupEnvelopeSchemaWithSlice = <GameSliceSchema extends z.ZodType>(
  gameSliceSchema: GameSliceSchema,
) =>
  z
    .object({
      version: z.number().int().positive(),
      exportedAt: z.iso.datetime(),
      gameId: GameIdSchema,
      slice: gameSliceSchema.nonoptional(),
    })
    .strict();

export function createGameBackupEnvelopeSchema(): ReturnType<
  typeof createGameBackupEnvelopeSchemaWithSlice<typeof UnknownGameSliceSchema>
>;
export function createGameBackupEnvelopeSchema<GameSliceSchema extends z.ZodType>(
  gameSliceSchema: GameSliceSchema,
): ReturnType<typeof createGameBackupEnvelopeSchemaWithSlice<GameSliceSchema>>;
export function createGameBackupEnvelopeSchema(
  gameSliceSchema: z.ZodType = UnknownGameSliceSchema,
) {
  return createGameBackupEnvelopeSchemaWithSlice(gameSliceSchema);
}

export const GameBackupEnvelopeSchema = createGameBackupEnvelopeSchema();
