import { z } from "zod/v4";

import { MkxlIdSchema, MkxlLabelSchema, MkxlSourceIdListSchema } from "../shared/schema";
import { mkxlGraphNodeKinds } from "./constants";

export const MkxlGraphNodeKindSchema = z.enum(mkxlGraphNodeKinds);

export const MkxlGraphNodeSchema = z
  .object({
    id: MkxlIdSchema,
    label: MkxlLabelSchema,
    kind: MkxlGraphNodeKindSchema,
  })
  .strict();

export const MkxlGraphEdgeSchema = z
  .object({
    id: MkxlIdSchema,
    fromNodeId: MkxlIdSchema,
    toNodeId: MkxlIdSchema,
    moveId: MkxlIdSchema.optional(),
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
  .refine((edge) => Boolean(edge.moveId ?? edge.interactableId), {
    message: "Graph edges must reference a move or interactable.",
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
