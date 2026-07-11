import { ComboRefSchema } from "@mk-combos/contracts/identity/schema";
import { LocalizedTextSchema } from "@mk-combos/contracts/settings/schema";
import {
  MkxlComboMetadataSchema,
  MkxlComboStageContextSchema,
} from "@mk-combos/mkxl-data/combos/schema";
import { MkxlInputNotationValueSchema } from "@mk-combos/mkxl-data/movelists/schema";
import { z } from "zod/v4";

const MkxlCatalogIdSchema = z.string().min(1);

export const MkxlCatalogEntityLabelSchema = z
  .object({
    id: MkxlCatalogIdSchema,
    label: LocalizedTextSchema,
  })
  .strict();

export const MkxlCatalogComboSummarySchema = z
  .object({
    ref: ComboRefSchema,
    gameId: z.literal("mkxl"),
    source: z.literal("seeded"),
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
    metadata: MkxlComboMetadataSchema,
    tags: z.array(z.string().min(1)).readonly(),
    notes: LocalizedTextSchema,
    gameVersion: z.string().min(1),
  })
  .strict();
