import { z } from "zod/v4";

import { Mk1IdSchema, Mk1LabelSchema, Mk1SourceIdListSchema } from "../shared/schema";
import { mk1GraphNodeKinds } from "./constants";

export const Mk1GraphNodeKindSchema = z.enum(mk1GraphNodeKinds);

export const Mk1GraphNodeSchema = z
  .object({
    id: Mk1IdSchema,
    label: Mk1LabelSchema,
    kind: Mk1GraphNodeKindSchema,
  })
  .strict();

export const Mk1GraphEdgeSchema = z
  .object({
    id: Mk1IdSchema,
    fromNodeId: Mk1IdSchema,
    toNodeId: Mk1IdSchema,
    moveId: Mk1IdSchema,
    frameWindow: z
      .object({
        start: z.number().int(),
        end: z.number().int(),
        kind: z.string().min(1),
      })
      .strict()
      .optional(),
    kameoCost: z.number().int().min(0).optional(),
    tags: z.array(z.string().min(1)).readonly(),
    sourceIds: Mk1SourceIdListSchema,
  })
  .strict();

export const Mk1CharacterGraphSchema = z
  .object({
    id: Mk1IdSchema,
    characterId: Mk1IdSchema,
    startNodeId: Mk1IdSchema,
    nodes: z.array(Mk1GraphNodeSchema).min(1).readonly(),
    edges: z.array(Mk1GraphEdgeSchema).min(1).readonly(),
    sourceIds: Mk1SourceIdListSchema,
  })
  .strict();

export const Mk1KameoGraphOverlaySchema = z
  .object({
    id: Mk1IdSchema,
    characterId: Mk1IdSchema,
    kameoId: Mk1IdSchema,
    nodes: z.array(Mk1GraphNodeSchema).min(1).readonly(),
    edges: z.array(Mk1GraphEdgeSchema).min(1).readonly(),
    sourceIds: Mk1SourceIdListSchema,
  })
  .strict();
