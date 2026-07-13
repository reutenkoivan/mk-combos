import { z } from "zod/v4";

import { MkxlLabelSchema, MkxlSourceIdSchema } from "../shared/schema";
import { mkxlDataSourceKinds } from "./constants";

export const MkxlDataSourceKindSchema = z.enum(mkxlDataSourceKinds);

export const MkxlGameSchema = z
  .object({
    id: z.literal("mkxl"),
    label: MkxlLabelSchema,
    gameVersion: z.string().min(1),
    sourceIds: z.array(MkxlSourceIdSchema).min(1).readonly(),
  })
  .strict();

export const MkxlDataSourceSchema = z
  .object({
    id: MkxlSourceIdSchema,
    label: z.string().min(1),
    url: z.string().url().optional(),
    kind: MkxlDataSourceKindSchema,
  })
  .strict();
