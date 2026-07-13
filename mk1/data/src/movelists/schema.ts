import { z } from "zod/v4";

import { Mk1IdSchema, Mk1LabelSchema, Mk1SourceIdListSchema } from "../shared/schema";
import {
  mk1InputNotationValues,
  mk1MoveCategories,
  mk1MoveNotationValues,
  mk1MoveOwnerKinds,
} from "./constants";

export const Mk1InputNotationValueSchema = z.enum(mk1InputNotationValues);

export const Mk1MoveNotationValueSchema = z.enum(mk1MoveNotationValues);

export const Mk1MoveCategorySchema = z.enum(mk1MoveCategories);

export const Mk1MoveOwnerKindSchema = z.enum(mk1MoveOwnerKinds);

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
    startup: z.number().int().optional(),
    active: z.number().int().optional(),
    recovery: z.number().int().optional(),
    hitAdvantage: z.number().int().optional(),
    blockAdvantage: z.number().int().optional(),
  })
  .strict();

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
