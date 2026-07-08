import { z } from "zod/v4";

import { MkxlInputNotationValueSchema } from "../movelists/schema";
import { MkxlIdSchema, MkxlLabelSchema, MkxlSourceIdListSchema } from "../shared/schema";

const MkxlTransitionRouteStepSchema = z
  .object({
    kind: z.literal("move"),
    moveId: MkxlIdSchema,
  })
  .strict();

export const MkxlTransitionSchema = z
  .object({
    id: MkxlIdSchema,
    label: MkxlLabelSchema,
    route: z.array(MkxlTransitionRouteStepSchema).min(1).readonly(),
    movePath: z.array(MkxlIdSchema).min(1).readonly(),
    notation: z.array(z.array(MkxlInputNotationValueSchema).min(1).readonly()).min(1).readonly(),
    tags: z.array(z.string().min(1)).readonly(),
    sourceIds: MkxlSourceIdListSchema,
  })
  .strict();
