import { ValidationMessageSchema } from "@mk-combos/contracts/result/schema";
import { z } from "zod/v4";

import { BuilderMetadataSchema, BuilderMovePathSchema } from "../graph/schema";
import {
  BuilderInvalidBoundarySchema,
  BuilderReplayInvalidSchema,
  BuilderReplayValidSchema,
} from "../replay/schema";
import { builderComboStateStatuses, builderInvalidComboStateStatuses } from "./value";

export { builderComboStateStatuses } from "./value";

export const BuilderComboStateStatusSchema = z.enum(builderComboStateStatuses);
export const BuilderInvalidComboStateStatusSchema = z.enum(builderInvalidComboStateStatuses);

export const BuilderComboFreshStateSchema = z
  .object({
    ok: z.literal(true),
    status: z.literal(builderComboStateStatuses.fresh),
    currentPath: BuilderMovePathSchema,
    replay: BuilderReplayValidSchema.optional(),
    metadata: BuilderMetadataSchema.optional(),
  })
  .strict();

export const BuilderComboStaleStateSchema = z
  .object({
    ok: z.literal(false),
    status: z.literal(builderComboStateStatuses.stale),
    originalPath: BuilderMovePathSchema,
    validPrefix: BuilderMovePathSchema,
    invalidTail: BuilderMovePathSchema,
    invalidBoundary: BuilderInvalidBoundarySchema,
    reason: ValidationMessageSchema,
    replay: BuilderReplayInvalidSchema.optional(),
    metadata: BuilderMetadataSchema.optional(),
  })
  .strict();

export const BuilderComboInvalidStateSchema = z
  .object({
    ok: z.literal(false),
    status: z.literal(builderComboStateStatuses.invalid),
    originalPath: BuilderMovePathSchema,
    validPrefix: BuilderMovePathSchema,
    invalidTail: BuilderMovePathSchema,
    invalidBoundary: BuilderInvalidBoundarySchema,
    reason: ValidationMessageSchema,
    replay: BuilderReplayInvalidSchema.optional(),
    metadata: BuilderMetadataSchema.optional(),
  })
  .strict();

export const BuilderComboStateSchema = z.discriminatedUnion("status", [
  BuilderComboFreshStateSchema,
  BuilderComboStaleStateSchema,
  BuilderComboInvalidStateSchema,
]);
