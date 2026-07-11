import { z } from "zod/v4";

import { Mk1IdSchema, Mk1SourceIdListSchema } from "../shared/schema";

export const Mk1DataSourceSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().min(1),
    kind: z.enum(["official", "reference", "manual", "curated"]),
  })
  .strict();

export const Mk1GameSchema = z
  .object({
    id: z.literal("mk1"),
    label: z.literal("MK1"),
    title: z.string().min(1),
    gameVersion: z.string().min(1),
    sourceIds: Mk1SourceIdListSchema,
    defaultCharacterId: Mk1IdSchema,
    defaultKameoId: Mk1IdSchema,
  })
  .strict();
