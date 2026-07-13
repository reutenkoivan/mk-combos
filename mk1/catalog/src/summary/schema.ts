import { ComboIdSchema } from "@mk-combos/contracts/identity/schema";
import { comboSources } from "@mk-combos/contracts/identity/value";
import { LocalizedTextSchema } from "@mk-combos/contracts/settings/schema";
import { Mk1ComboMetadataSchema } from "@mk-combos/mk1-data/combos/schema";
import { Mk1InputNotationValueSchema } from "@mk-combos/mk1-data/movelists/schema";
import { z } from "zod/v4";

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
    metadata: Mk1ComboMetadataSchema,
    tags: z.array(z.string().min(1)).readonly(),
    notes: LocalizedTextSchema,
    gameVersion: z.string().min(1),
  })
  .strict();
