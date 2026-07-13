import { ValidationMessageSchema } from "@mk-combos/contracts/result/schema";
import { z } from "zod/v4";

import {
  BuilderMetadataSchema,
  BuilderMovePathSchema,
  BuilderPathStepIdSchema,
} from "../graph/schema";
import { BuilderRuntimeSnapshotSchema } from "../runtime/schema";
import {
  BuilderTransitionAcceptedSchema,
  BuilderTransitionRejectedSchema,
} from "../transition/schema";
import { builderReplayStatuses } from "./value";

export { builderReplayStatuses } from "./value";

export const BuilderReplayStatusSchema = z.enum(builderReplayStatuses);

export const BuilderInvalidBoundarySchema = z
  .object({
    index: z.number().int().nonnegative(),
    previousStepId: BuilderPathStepIdSchema.optional(),
    attemptedStepId: BuilderPathStepIdSchema.optional(),
  })
  .strict();

export const BuilderReplayValidSchema = z
  .object({
    ok: z.literal(true),
    status: z.literal(builderReplayStatuses.valid),
    originalPath: BuilderMovePathSchema,
    acceptedPath: BuilderMovePathSchema,
    finalRuntime: BuilderRuntimeSnapshotSchema,
    transitions: z.array(BuilderTransitionAcceptedSchema).readonly(),
    metadata: BuilderMetadataSchema.optional(),
  })
  .strict();

export const BuilderReplayInvalidSchema = z
  .object({
    ok: z.literal(false),
    status: z.literal(builderReplayStatuses.invalid),
    originalPath: BuilderMovePathSchema,
    validPrefix: BuilderMovePathSchema,
    invalidTail: BuilderMovePathSchema,
    invalidBoundary: BuilderInvalidBoundarySchema,
    reason: ValidationMessageSchema,
    lastRuntime: BuilderRuntimeSnapshotSchema.optional(),
    acceptedTransitions: z.array(BuilderTransitionAcceptedSchema).readonly().optional(),
    rejectedTransition: BuilderTransitionRejectedSchema.optional(),
    metadata: BuilderMetadataSchema.optional(),
  })
  .strict();

export const BuilderReplayResultSchema = z.discriminatedUnion("status", [
  BuilderReplayValidSchema,
  BuilderReplayInvalidSchema,
]);
