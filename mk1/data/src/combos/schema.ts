import { ComboIdSchema } from "@mk-combos/contracts/identity/schema";
import { comboSources } from "@mk-combos/contracts/identity/value";
import { z } from "zod/v4";

import { Mk1InputNotationValueSchema } from "../movelists/schema";
import { Mk1IdSchema, Mk1LabelSchema, Mk1SourceIdListSchema } from "../shared/schema";
import { mk1ComboDifficulties, mk1ComboPositions, mk1ComboRouteTypes } from "./constants";

export const Mk1ComboDifficultySchema = z.enum(mk1ComboDifficulties);

export const Mk1ComboPositionSchema = z.enum(mk1ComboPositions);

export const Mk1ComboRouteTypeSchema = z.enum(mk1ComboRouteTypes);

export const Mk1ComboRouteStepSchema = z.discriminatedUnion("kind", [
  z
    .object({
      kind: z.literal("move"),
      moveId: Mk1IdSchema,
    })
    .strict(),
]);

export const Mk1ComboMetadataSchema = z
  .object({
    damage: z.number().min(0),
    meter: z.number().int().min(0),
    position: Mk1ComboPositionSchema,
    starter: z.string().min(1),
    routeType: Mk1ComboRouteTypeSchema,
    difficulty: Mk1ComboDifficultySchema,
    tags: z.array(z.string().min(1)).readonly(),
  })
  .strict();

export const Mk1SeededComboSchema = z
  .object({
    id: ComboIdSchema,
    source: z.literal(comboSources.seeded),
    gameId: z.literal("mk1"),
    title: Mk1LabelSchema,
    characterId: Mk1IdSchema,
    kameoId: Mk1IdSchema,
    route: z.array(Mk1ComboRouteStepSchema).min(1).readonly(),
    movePath: z.array(Mk1IdSchema).readonly(),
    notation: z.array(z.array(Mk1InputNotationValueSchema).min(1).readonly()).min(1).readonly(),
    metadata: Mk1ComboMetadataSchema,
    notes: Mk1LabelSchema,
    gameVersion: z.string().min(1),
    sourceIds: Mk1SourceIdListSchema,
  })
  .strict();
