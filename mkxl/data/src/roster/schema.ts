import { z } from "zod/v4";

import { MkxlIdSchema, MkxlLabelSchema, MkxlSourceIdListSchema } from "../shared/schema";
import { mkxlCharacterReleaseKinds } from "./constants";

export const MkxlCharacterReleaseKindSchema = z.enum(mkxlCharacterReleaseKinds);

export const MkxlCharacterSchema = z
  .object({
    id: MkxlIdSchema,
    label: MkxlLabelSchema,
    shortLabel: MkxlLabelSchema.optional(),
    rosterOrder: z.number().int().positive(),
    release: MkxlCharacterReleaseKindSchema,
    sourceIds: MkxlSourceIdListSchema,
  })
  .strict();
