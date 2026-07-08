import { z } from "zod/v4";

import { MkxlIdSchema, MkxlLabelSchema, MkxlSourceIdListSchema } from "../shared/schema";

export const MkxlStageSegmentSchema = z
  .object({
    id: MkxlIdSchema,
    label: MkxlLabelSchema,
  })
  .strict();

export const MkxlStageZoneSchema = z
  .object({
    id: MkxlIdSchema,
    label: MkxlLabelSchema,
    segments: z.array(MkxlStageSegmentSchema).min(1).readonly(),
  })
  .strict();

export const MkxlInteractableSchema = z
  .object({
    id: MkxlIdSchema,
    stageId: MkxlIdSchema,
    label: MkxlLabelSchema,
    zoneId: MkxlIdSchema.optional(),
    segmentId: MkxlIdSchema.optional(),
    usagePolicy: z.enum(["oncePerCombo", "reusable", "disabled"]),
    tags: z.array(z.string().min(1)).readonly(),
    sourceIds: MkxlSourceIdListSchema,
  })
  .strict();

export const MkxlStageSchema = z
  .object({
    id: MkxlIdSchema,
    label: MkxlLabelSchema,
    stageFatality: z.boolean().optional(),
    zones: z.array(MkxlStageZoneSchema).min(1).readonly(),
    interactables: z.array(MkxlInteractableSchema).readonly(),
    sourceIds: MkxlSourceIdListSchema,
  })
  .strict();
