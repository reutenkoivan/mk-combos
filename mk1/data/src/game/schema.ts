import { z } from "zod/v4";

import { Mk1IdSchema, Mk1SourceIdListSchema } from "../shared/schema";
import { mk1DataSourceKinds } from "./constants";

export const Mk1DataSourceKindSchema = z.enum(mk1DataSourceKinds);

export const Mk1DataSourceSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().min(1),
    kind: Mk1DataSourceKindSchema,
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
