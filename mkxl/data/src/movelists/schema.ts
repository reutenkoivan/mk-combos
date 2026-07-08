import { z } from "zod/v4";

import { MkxlIdSchema, MkxlLabelSchema, MkxlSourceIdListSchema } from "../shared/schema";
import { mkxlInputNotationValues, mkxlMoveCategories, mkxlMoveNotationValues } from "./constants";

export const MkxlInputNotationValueSchema = z.enum(mkxlInputNotationValues);

export const MkxlMoveNotationValueSchema = z.enum(mkxlMoveNotationValues);

export const MkxlMoveCategorySchema = z.enum(mkxlMoveCategories);

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
    startup: z.number().int().optional(),
    active: z.number().int().optional(),
    recovery: z.number().int().optional(),
    hitAdvantage: z.number().int().optional(),
    blockAdvantage: z.number().int().optional(),
  })
  .strict();

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
