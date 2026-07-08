import { z } from "zod/v4";

import { MkxlIdSchema, MkxlLabelSchema, MkxlSourceIdListSchema } from "../shared/schema";

export const MkxlGraphNodeSchema = z
  .object({
    id: MkxlIdSchema,
    label: MkxlLabelSchema,
    kind: z.enum(["start", "move", "transition", "end", "stageInteraction"]),
  })
  .strict();

export const MkxlGraphEdgeSchema = z
  .object({
    id: MkxlIdSchema,
    fromNodeId: MkxlIdSchema,
    toNodeId: MkxlIdSchema,
    moveId: MkxlIdSchema.optional(),
    transitionId: MkxlIdSchema.optional(),
    interactableId: MkxlIdSchema.optional(),
    frameWindow: z
      .object({
        start: z.number().int(),
        end: z.number().int(),
        kind: z.string().min(1),
      })
      .strict()
      .optional(),
    tags: z.array(z.string().min(1)).readonly(),
    sourceIds: MkxlSourceIdListSchema,
  })
  .strict()
  .refine((edge) => Boolean(edge.moveId ?? edge.transitionId ?? edge.interactableId), {
    message: "Graph edges must reference a move, transition, or interactable.",
    path: ["moveId"],
  });

export const MkxlVariationGraphSchema = z
  .object({
    id: MkxlIdSchema,
    characterId: MkxlIdSchema,
    variationId: MkxlIdSchema,
    startNodeId: MkxlIdSchema,
    nodes: z.array(MkxlGraphNodeSchema).min(1).readonly(),
    edges: z.array(MkxlGraphEdgeSchema).min(1).readonly(),
    sourceIds: MkxlSourceIdListSchema,
  })
  .strict();

export const MkxlStageGraphFragmentSchema = z
  .object({
    id: MkxlIdSchema,
    stageId: MkxlIdSchema,
    nodes: z.array(MkxlGraphNodeSchema).min(1).readonly(),
    edges: z.array(MkxlGraphEdgeSchema).min(1).readonly(),
    sourceIds: MkxlSourceIdListSchema,
  })
  .strict();
