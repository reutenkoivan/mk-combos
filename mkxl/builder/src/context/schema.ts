import { z } from "zod/v4";

export const MkxlBuilderIdSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9][a-z0-9:-]*$/u);

export const MkxlBuilderContextSchema = z
  .object({
    characterId: MkxlBuilderIdSchema,
    variationId: MkxlBuilderIdSchema,
    stageId: MkxlBuilderIdSchema.optional(),
  })
  .strict();
