import { z } from "zod/v4";

import { MkxlIdSchema, MkxlLabelSchema, MkxlSourceIdListSchema } from "../shared/schema";
import {
  mkxlAttackLevels,
  mkxlInputNotationValues,
  mkxlMoveCategories,
  mkxlMoveNotationValues,
  mkxlMoveTacticalFactKinds,
} from "./constants";

export const MkxlInputNotationValueSchema = z.enum(mkxlInputNotationValues);

export const MkxlMoveNotationValueSchema = z.enum(mkxlMoveNotationValues);

export const MkxlMoveCategorySchema = z.enum(mkxlMoveCategories);

export const MkxlAttackLevelSchema = z.enum(mkxlAttackLevels);

export const MkxlMoveTacticalFactKindSchema = z.enum(mkxlMoveTacticalFactKinds);

const mkxlMoveTacticalFactBaseShape = {
  id: MkxlIdSchema,
  sourceIds: MkxlSourceIdListSchema,
} as const;

const MkxlMoveAttackLevelFactSchema = z
  .object({
    ...mkxlMoveTacticalFactBaseShape,
    kind: z.literal(mkxlMoveTacticalFactKinds.attackLevel),
    value: MkxlAttackLevelSchema,
    hitIndex: z.number().int().positive().optional(),
  })
  .strict();

const MkxlMoveDuckableFactSchema = z
  .object({
    ...mkxlMoveTacticalFactBaseShape,
    kind: z.literal(mkxlMoveTacticalFactKinds.duckable),
    value: z.boolean(),
    hitIndex: z.number().int().positive().optional(),
  })
  .strict();

const MkxlMoveInternalGapFactSchema = z
  .object({
    ...mkxlMoveTacticalFactBaseShape,
    kind: z.literal(mkxlMoveTacticalFactKinds.internalGap),
    value: z.number().int().positive(),
    afterHitIndex: z.number().int().positive().optional(),
  })
  .strict();

export const MkxlMoveTacticalFactSchema = z.discriminatedUnion("kind", [
  MkxlMoveAttackLevelFactSchema,
  MkxlMoveDuckableFactSchema,
  MkxlMoveInternalGapFactSchema,
]);

export const MkxlMoveAvailabilitySchema = z.discriminatedUnion("kind", [
  z
    .object({
      kind: z.literal("universal"),
    })
    .strict(),
  z
    .object({
      kind: z.literal("variation"),
      variationIds: z.array(MkxlIdSchema).min(1).readonly(),
    })
    .strict(),
  z
    .object({
      kind: z.literal("stage"),
      stageIds: z.array(MkxlIdSchema).min(1).readonly(),
    })
    .strict(),
]);

export const MkxlMoveFrameDataSchema = z
  .object({
    startup: z.number().int().positive().optional(),
    active: z.number().int().positive().optional(),
    recovery: z.number().int().positive().optional(),
    hitAdvantage: z.number().int().optional(),
    blockAdvantage: z.number().int().optional(),
    sourceIds: MkxlSourceIdListSchema,
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

export const MkxlMoveSchema = z
  .object({
    id: MkxlIdSchema,
    characterId: MkxlIdSchema,
    label: MkxlLabelSchema,
    notation: z.array(MkxlMoveNotationValueSchema).min(1).readonly(),
    category: MkxlMoveCategorySchema,
    availability: MkxlMoveAvailabilitySchema,
    meterCost: z.number().int().min(0).optional(),
    meterGain: z.number().int().min(0).optional(),
    tags: z.array(z.string().min(1)).readonly(),
    tacticalFacts: z.array(MkxlMoveTacticalFactSchema).min(1).readonly().optional(),
    frameData: MkxlMoveFrameDataSchema.optional(),
    sourceIds: MkxlSourceIdListSchema,
  })
  .strict();

export const MkxlMoveTreeSchema = z.record(
  z.string().min(1),
  z.record(z.string().min(1), MkxlMoveSchema),
);

export const MkxlMovelistSchema = z
  .object({
    characterId: MkxlIdSchema,
    moves: MkxlMoveTreeSchema,
    movelist: z.array(MkxlMoveSchema).min(1).readonly(),
    sourceIds: MkxlSourceIdListSchema,
  })
  .strict();
