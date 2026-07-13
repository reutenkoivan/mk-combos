import { z } from "zod/v4";

import { Mk1IdSchema, Mk1LabelSchema, Mk1SourceIdListSchema } from "../shared/schema";
import {
  mk1AttackLevels,
  mk1InputNotationValues,
  mk1MoveCategories,
  mk1MoveNotationValues,
  mk1MoveOwnerKinds,
  mk1MoveTacticalFactKinds,
} from "./constants";

export const Mk1InputNotationValueSchema = z.enum(mk1InputNotationValues);

export const Mk1MoveNotationValueSchema = z.enum(mk1MoveNotationValues);

export const Mk1MoveCategorySchema = z.enum(mk1MoveCategories);

export const Mk1MoveOwnerKindSchema = z.enum(mk1MoveOwnerKinds);

export const Mk1AttackLevelSchema = z.enum(mk1AttackLevels);

export const Mk1MoveTacticalFactKindSchema = z.enum(mk1MoveTacticalFactKinds);

const mk1MoveTacticalFactBaseShape = {
  id: Mk1IdSchema,
  sourceIds: Mk1SourceIdListSchema,
} as const;

const Mk1MoveAttackLevelFactSchema = z
  .object({
    ...mk1MoveTacticalFactBaseShape,
    kind: z.literal(mk1MoveTacticalFactKinds.attackLevel),
    value: Mk1AttackLevelSchema,
    hitIndex: z.number().int().positive().optional(),
  })
  .strict();

const Mk1MoveDuckableFactSchema = z
  .object({
    ...mk1MoveTacticalFactBaseShape,
    kind: z.literal(mk1MoveTacticalFactKinds.duckable),
    value: z.boolean(),
    hitIndex: z.number().int().positive().optional(),
  })
  .strict();

const Mk1MoveInternalGapFactSchema = z
  .object({
    ...mk1MoveTacticalFactBaseShape,
    kind: z.literal(mk1MoveTacticalFactKinds.internalGap),
    value: z.number().int().positive(),
    afterHitIndex: z.number().int().positive().optional(),
  })
  .strict();

export const Mk1MoveTacticalFactSchema = z.discriminatedUnion("kind", [
  Mk1MoveAttackLevelFactSchema,
  Mk1MoveDuckableFactSchema,
  Mk1MoveInternalGapFactSchema,
]);

export const Mk1MoveAvailabilitySchema = z.discriminatedUnion("kind", [
  z
    .object({
      kind: z.literal("character"),
      characterIds: z.array(Mk1IdSchema).min(1).readonly(),
    })
    .strict(),
  z
    .object({
      kind: z.literal("kameo"),
      kameoIds: z.array(Mk1IdSchema).min(1).readonly(),
    })
    .strict(),
  z
    .object({
      kind: z.literal("universal"),
    })
    .strict(),
]);

export const Mk1MoveFrameDataSchema = z
  .object({
    startup: z.number().int().positive().optional(),
    active: z.number().int().positive().optional(),
    recovery: z.number().int().positive().optional(),
    hitAdvantage: z.number().int().optional(),
    blockAdvantage: z.number().int().optional(),
    sourceIds: Mk1SourceIdListSchema,
  })
  .strict()
  .refine(
    (frameData) =>
      frameData.startup !== undefined ||
      frameData.active !== undefined ||
      frameData.recovery !== undefined ||
      frameData.hitAdvantage !== undefined ||
      frameData.blockAdvantage !== undefined,
    {
      message: "Frame data must provide at least one verified frame value.",
    },
  );

export const Mk1MoveSchema = z
  .object({
    id: Mk1IdSchema,
    ownerId: Mk1IdSchema,
    ownerKind: Mk1MoveOwnerKindSchema,
    label: Mk1LabelSchema,
    notation: z.array(Mk1MoveNotationValueSchema).min(1).readonly(),
    category: Mk1MoveCategorySchema,
    availability: Mk1MoveAvailabilitySchema,
    meterCost: z.number().int().min(0).optional(),
    kameoCost: z.number().int().min(0).optional(),
    tags: z.array(z.string().min(1)).readonly(),
    tacticalFacts: z.array(Mk1MoveTacticalFactSchema).min(1).readonly().optional(),
    frameData: Mk1MoveFrameDataSchema.optional(),
    sourceIds: Mk1SourceIdListSchema,
  })
  .strict();

export const Mk1MoveTreeSchema = z.record(z.string().min(1), Mk1MoveSchema);

export const Mk1MovelistSchema = z
  .object({
    ownerId: Mk1IdSchema,
    ownerKind: Mk1MoveOwnerKindSchema,
    moves: Mk1MoveTreeSchema,
    movelist: z.array(Mk1MoveSchema).min(1).readonly(),
    sourceIds: Mk1SourceIdListSchema,
  })
  .strict();
