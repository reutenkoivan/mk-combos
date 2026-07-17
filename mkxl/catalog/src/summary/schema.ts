import { ComboRefSchema } from "@mk-combos/contracts/identity/schema";
import { comboSources } from "@mk-combos/contracts/identity/value";
import { LocalizedTextSchema } from "@mk-combos/contracts/settings/schema";
import {
  MkxlComboMetadataSchema,
  MkxlComboStageContextSchema,
} from "@mk-combos/mkxl-data/combos/schema";
import { MkxlInputNotationValueSchema } from "@mk-combos/mkxl-data/movelists/schema";
import { z } from "zod/v4";

import { MkxlCatalogSourceSchema } from "../filters/schema";
import { mkxlCatalogRouteStepEmphases, mkxlCatalogRouteStepKinds } from "./value";

const MkxlCatalogIdSchema = z.string().min(1);

export const MkxlCatalogEntityLabelSchema = z
  .object({
    id: MkxlCatalogIdSchema,
    label: LocalizedTextSchema,
  })
  .strict();

export const MkxlCatalogRouteStepKindSchema = z.enum(mkxlCatalogRouteStepKinds);
export const MkxlCatalogRouteStepEmphasisSchema = z.enum(mkxlCatalogRouteStepEmphases);

export const MkxlCatalogRouteStepSchema = z
  .object({
    kind: MkxlCatalogRouteStepKindSchema,
    notation: z.array(MkxlInputNotationValueSchema).min(1).readonly(),
    repetitionCount: z.number().int().positive(),
    emphasis: MkxlCatalogRouteStepEmphasisSchema,
  })
  .strict();

export const MkxlCatalogComboSummarySchema = z
  .object({
    ref: ComboRefSchema,
    gameId: z.literal("mkxl"),
    source: z.literal(comboSources.seeded),
    provenance: MkxlCatalogSourceSchema,
    sourceIds: z.array(z.string().min(1)).min(1).readonly(),
    title: LocalizedTextSchema,
    character: MkxlCatalogEntityLabelSchema.extend({
      shortLabel: LocalizedTextSchema.optional(),
    }).strict(),
    variation: MkxlCatalogEntityLabelSchema.extend({
      characterId: MkxlCatalogIdSchema,
    }).strict(),
    stageContext: MkxlComboStageContextSchema,
    stage: MkxlCatalogEntityLabelSchema.optional(),
    interactables: z.array(MkxlCatalogEntityLabelSchema).readonly(),
    movePath: z.array(MkxlCatalogIdSchema).min(1).readonly(),
    cachedNotation: z
      .array(z.array(MkxlInputNotationValueSchema).min(1).readonly())
      .min(1)
      .readonly(),
    routeSteps: z.array(MkxlCatalogRouteStepSchema).min(1).readonly(),
    metadata: MkxlComboMetadataSchema,
    tags: z.array(z.string().min(1)).readonly(),
    notes: LocalizedTextSchema,
    gameVersion: z.string().min(1),
  })
  .strict();
