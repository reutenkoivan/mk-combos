import { ValidationMessageSchema } from "@mk-combos/contracts/result/schema";
import { z } from "zod/v4";

import {
  BuilderGraphEdgeIdSchema,
  BuilderGraphNodeIdSchema,
  BuilderMetadataSchema,
  BuilderMoveIdSchema,
  BuilderPathStepSchema,
} from "../graph/schema";
import { BuilderRuntimeSnapshotSchema } from "../runtime/schema";
import { builderTransitionStatuses } from "./value";

export { builderTransitionStatuses } from "./value";

export const BuilderTransitionStatusSchema = z.enum(builderTransitionStatuses);

export const BuilderFrameWindowSchema = z
  .object({
    start: z.number().int(),
    end: z.number().int(),
    kind: z.string().min(1).optional(),
  })
  .strict()
  .refine((window) => window.end >= window.start, {
    message: "Frame window end must be greater than or equal to start.",
    path: ["end"],
  });

export const BuilderTransitionEffectSchema = z
  .object({
    target: z.string().min(1),
    operation: z.string().min(1),
    value: z.unknown().optional(),
    metadata: BuilderMetadataSchema.optional(),
  })
  .strict();

export const BuilderTransitionCandidateSchema = z
  .object({
    edgeId: BuilderGraphEdgeIdSchema.optional(),
    fromNodeId: BuilderGraphNodeIdSchema.optional(),
    toNodeId: BuilderGraphNodeIdSchema.optional(),
    moveId: BuilderMoveIdSchema,
    frameWindow: BuilderFrameWindowSchema.optional(),
    effects: z.array(BuilderTransitionEffectSchema).readonly().optional(),
    metadata: BuilderMetadataSchema.optional(),
  })
  .strict();

export const BuilderTransitionAcceptedSchema = z
  .object({
    ok: z.literal(true),
    status: z.literal(builderTransitionStatuses.accepted),
    candidate: BuilderTransitionCandidateSchema,
    step: BuilderPathStepSchema,
    fromRuntime: BuilderRuntimeSnapshotSchema.optional(),
    toRuntime: BuilderRuntimeSnapshotSchema,
    effects: z.array(BuilderTransitionEffectSchema).readonly().optional(),
    metadata: BuilderMetadataSchema.optional(),
  })
  .strict();

export const BuilderTransitionRejectedSchema = z
  .object({
    ok: z.literal(false),
    status: z.literal(builderTransitionStatuses.rejected),
    attemptedMoveId: BuilderMoveIdSchema,
    edgeId: BuilderGraphEdgeIdSchema.optional(),
    fromRuntime: BuilderRuntimeSnapshotSchema.optional(),
    reason: ValidationMessageSchema,
    metadata: BuilderMetadataSchema.optional(),
  })
  .strict();

export const BuilderTransitionResultSchema = z.discriminatedUnion("status", [
  BuilderTransitionAcceptedSchema,
  BuilderTransitionRejectedSchema,
]);
