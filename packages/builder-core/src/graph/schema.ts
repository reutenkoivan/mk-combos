import { z } from "zod/v4";

export const BuilderMetadataSchema = z.record(z.string(), z.unknown());

export const BuilderGraphNodeIdSchema = z.string().min(1);

export const BuilderGraphEdgeIdSchema = z.string().min(1);

export const BuilderMoveIdSchema = z.string().min(1);

export const BuilderPathStepIdSchema = z.string().min(1);

export const BuilderGraphNodeSchema = z
  .object({
    id: BuilderGraphNodeIdSchema,
    kind: z.string().min(1).optional(),
    label: z.string().min(1).optional(),
    metadata: BuilderMetadataSchema.optional(),
  })
  .strict();

export const BuilderGraphEdgeSchema = z
  .object({
    id: BuilderGraphEdgeIdSchema,
    fromNodeId: BuilderGraphNodeIdSchema,
    toNodeId: BuilderGraphNodeIdSchema,
    moveId: BuilderMoveIdSchema,
    kind: z.string().min(1).optional(),
    label: z.string().min(1).optional(),
    metadata: BuilderMetadataSchema.optional(),
  })
  .strict();

export const BuilderPathStepSchema = z
  .object({
    id: BuilderPathStepIdSchema,
    moveId: BuilderMoveIdSchema,
    edgeId: BuilderGraphEdgeIdSchema.optional(),
    nodeId: BuilderGraphNodeIdSchema.optional(),
    label: z.string().min(1).optional(),
    metadata: BuilderMetadataSchema.optional(),
  })
  .strict();

export const BuilderMovePathSchema = z.array(BuilderPathStepSchema).readonly();

export const BuilderGraphSchema = z
  .object({
    nodes: z.array(BuilderGraphNodeSchema).readonly(),
    edges: z.array(BuilderGraphEdgeSchema).readonly(),
    startNodeId: BuilderGraphNodeIdSchema.optional(),
    metadata: BuilderMetadataSchema.optional(),
  })
  .strict();
