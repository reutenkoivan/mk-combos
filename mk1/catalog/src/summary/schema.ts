import { ComboIdSchema } from "@mk-combos/contracts/identity/schema";
import { comboSources } from "@mk-combos/contracts/identity/value";
import { LocalizedTextSchema } from "@mk-combos/contracts/settings/schema";
import { Mk1ComboMetadataSchema } from "@mk-combos/mk1-data/combos/schema";
import { Mk1InputNotationValueSchema } from "@mk-combos/mk1-data/movelists/schema";
import { z } from "zod/v4";

import { Mk1CatalogSourceSchema } from "../filters/schema";
import { mk1CatalogRouteStepEmphases, mk1CatalogRouteStepKinds } from "./value";

const IdSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9][a-z0-9:-]*$/u);

export const Mk1CatalogEntityLabelSchema = z
  .object({
    id: IdSchema,
    label: LocalizedTextSchema,
  })
  .strict();

export const Mk1CatalogRouteStepKindSchema = z.enum(mk1CatalogRouteStepKinds);
export const Mk1CatalogRouteStepEmphasisSchema = z.enum(mk1CatalogRouteStepEmphases);

export const Mk1CatalogRouteStepSchema = z
  .object({
    kind: Mk1CatalogRouteStepKindSchema,
    notation: z.array(Mk1InputNotationValueSchema).min(1).readonly(),
    repetitionCount: z.number().int().positive(),
    emphasis: Mk1CatalogRouteStepEmphasisSchema,
  })
  .strict();

export const Mk1CatalogComboSummarySchema = z
  .object({
    ref: z
      .object({
        gameId: z.literal("mk1"),
        source: z.literal(comboSources.seeded),
        comboId: ComboIdSchema,
      })
      .strict(),
    gameId: z.literal("mk1"),
    source: z.literal(comboSources.seeded),
    provenance: Mk1CatalogSourceSchema,
    sourceIds: z.array(z.string().min(1)).min(1).readonly(),
    title: LocalizedTextSchema,
    character: Mk1CatalogEntityLabelSchema.extend({
      shortLabel: LocalizedTextSchema.optional(),
    }).strict(),
    kameo: Mk1CatalogEntityLabelSchema.extend({
      shortLabel: LocalizedTextSchema.optional(),
    }).strict(),
    movePath: z.array(IdSchema).min(1).readonly(),
    cachedNotation: z
      .array(z.array(Mk1InputNotationValueSchema).min(1).readonly())
      .min(1)
      .readonly(),
    routeSteps: z.array(Mk1CatalogRouteStepSchema).min(1).readonly(),
    metadata: Mk1ComboMetadataSchema,
    tags: z.array(z.string().min(1)).readonly(),
    notes: LocalizedTextSchema,
    gameVersion: z.string().min(1),
  })
  .strict();
