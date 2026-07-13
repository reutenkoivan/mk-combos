import { ComboIdSchema } from "@mk-combos/contracts/identity/schema";
import { comboSources } from "@mk-combos/contracts/identity/value";
import { z } from "zod/v4";

import { MkxlInputNotationValueSchema } from "../movelists/schema";
import { MkxlIdSchema, MkxlLabelSchema, MkxlSourceIdListSchema } from "../shared/schema";
import { mkxlComboDifficulties, mkxlComboPositions, mkxlComboRouteTypes } from "./constants";

export const MkxlComboDifficultySchema = z.enum(mkxlComboDifficulties);

export const MkxlComboPositionSchema = z.enum(mkxlComboPositions);

export const MkxlComboRouteTypeSchema = z.enum(mkxlComboRouteTypes);

export const MkxlComboStageContextSchema = z.discriminatedUnion("kind", [
  z
    .object({
      kind: z.literal("stageAgnostic"),
    })
    .strict(),
  z
    .object({
      kind: z.literal("stageSpecific"),
      stageId: MkxlIdSchema,
      zoneId: MkxlIdSchema.optional(),
      segmentId: MkxlIdSchema.optional(),
      interactableIds: z.array(MkxlIdSchema).readonly(),
    })
    .strict(),
]);

export const MkxlComboRouteStepSchema = z.discriminatedUnion("kind", [
  z
    .object({
      kind: z.literal("move"),
      moveId: MkxlIdSchema,
    })
    .strict(),
]);

export const MkxlComboMetadataSchema = z
  .object({
    damage: z.number().min(0),
    meter: z.number().int().min(0),
    position: MkxlComboPositionSchema,
    starter: z.string().min(1),
    routeType: MkxlComboRouteTypeSchema,
    difficulty: MkxlComboDifficultySchema,
    tags: z.array(z.string().min(1)).readonly(),
  })
  .strict();

export const MkxlSeededComboSchema = z
  .object({
    id: ComboIdSchema,
    source: z.literal(comboSources.seeded),
    gameId: z.literal("mkxl"),
    title: MkxlLabelSchema,
    characterId: MkxlIdSchema,
    variationId: MkxlIdSchema,
    stageContext: MkxlComboStageContextSchema,
    route: z.array(MkxlComboRouteStepSchema).min(1).readonly(),
    movePath: z.array(MkxlIdSchema).readonly(),
    notation: z.array(z.array(MkxlInputNotationValueSchema).min(1).readonly()).min(1).readonly(),
    metadata: MkxlComboMetadataSchema,
    notes: MkxlLabelSchema,
    gameVersion: z.string().min(1),
    sourceIds: MkxlSourceIdListSchema,
  })
  .strict();
