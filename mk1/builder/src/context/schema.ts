import { z } from "zod/v4";

export const Mk1BuilderIdSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9][a-z0-9:-]*$/u);

export const Mk1BuilderContextSchema = z
  .object({
    characterId: Mk1BuilderIdSchema,
    kameoId: Mk1BuilderIdSchema,
  })
  .strict();
