import { z } from "zod/v4";

import { MkxlIdSchema, MkxlLabelSchema, MkxlSourceIdListSchema } from "../shared/schema";

export const MkxlCharacterSchema = z
  .object({
    id: MkxlIdSchema,
    label: MkxlLabelSchema,
    shortLabel: MkxlLabelSchema.optional(),
    rosterOrder: z.number().int().positive(),
    release: z.enum(["base", "unlockable", "dlc"]),
    sourceIds: MkxlSourceIdListSchema,
  })
  .strict();
