import { BuilderMovePathSchema } from "@mk-combos/builder-core/graph/schema";
import { BuilderRuntimeSnapshotSchema } from "@mk-combos/builder-core/runtime/schema";
import { BuilderComboStateSchema } from "@mk-combos/builder-core/stale/schema";
import { ComboIdSchema, ComboSourceSchema } from "@mk-combos/contracts/identity/schema";
import { comboSources } from "@mk-combos/contracts/identity/value";
import { ValidationMessageSchema } from "@mk-combos/contracts/result/schema";
import { LocalizedTextSchema } from "@mk-combos/contracts/settings/schema";
import { Mk1BuilderContextSchema } from "@mk-combos/mk1-builder/context/schema";
import { Mk1BuilderMoveChoicesSchema } from "@mk-combos/mk1-builder/graph/schema";
import { Mk1CatalogContextSchema } from "@mk-combos/mk1-catalog/context/schema";
import { Mk1CatalogFiltersSchema } from "@mk-combos/mk1-catalog/filters/schema";
import { Mk1CatalogComboSummarySchema } from "@mk-combos/mk1-catalog/summary/schema";
import { Mk1ComboMetadataSchema } from "@mk-combos/mk1-data/combos/schema";
import { Mk1InputNotationValueSchema } from "@mk-combos/mk1-data/movelists/schema";
import { z } from "zod/v4";

const Mk1BusinessIdSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9][a-z0-9:-]*$/u);

const Mk1BusinessDateTimeSchema = z.iso.datetime();

export const Mk1BusinessComboSourceSchema = ComboSourceSchema;

export const Mk1BusinessComboRefSchema = z
  .object({
    gameId: z.literal("mk1"),
    source: Mk1BusinessComboSourceSchema,
    comboId: ComboIdSchema,
  })
  .strict();

export const Mk1BusinessCustomComboSchema = z
  .object({
    id: ComboIdSchema,
    gameId: z.literal("mk1"),
    source: z.literal(comboSources.custom),
    title: LocalizedTextSchema.optional(),
    characterId: Mk1BusinessIdSchema,
    kameoId: Mk1BusinessIdSchema,
    movePath: z.array(Mk1BusinessIdSchema).min(1).readonly(),
    cachedNotation: z
      .array(z.array(Mk1InputNotationValueSchema).min(1).readonly())
      .min(1)
      .readonly(),
    metadata: Mk1ComboMetadataSchema.optional(),
    notes: LocalizedTextSchema.optional(),
    gameVersion: z.string().min(1),
    createdAt: Mk1BusinessDateTimeSchema,
    updatedAt: Mk1BusinessDateTimeSchema,
  })
  .strict()
  .superRefine((combo, context) => {
    if (combo.cachedNotation.length !== combo.movePath.length) {
      context.addIssue({
        code: "custom",
        message: "MK1 custom combo cachedNotation must match movePath length.",
        path: ["cachedNotation"],
      });
    }
  });

export const Mk1NamedListItemSchema = z
  .object({
    ref: Mk1BusinessComboRefSchema,
    addedAt: Mk1BusinessDateTimeSchema.optional(),
  })
  .strict();

export const Mk1NamedListSchema = z
  .object({
    id: Mk1BusinessIdSchema,
    gameId: z.literal("mk1"),
    name: z.string().min(1),
    items: z.array(Mk1NamedListItemSchema).readonly(),
    createdAt: Mk1BusinessDateTimeSchema,
    updatedAt: Mk1BusinessDateTimeSchema,
  })
  .strict()
  .superRefine((list, context) => {
    const seenRefs = new Set<string>();

    for (const [index, item] of list.items.entries()) {
      const refKey = `${item.ref.source}\u0000${item.ref.comboId}`;

      if (seenRefs.has(refKey)) {
        context.addIssue({
          code: "custom",
          message: "MK1 named list cannot contain duplicate combo references.",
          path: ["items", index, "ref"],
        });
      }

      seenRefs.add(refKey);
    }
  });

export const Mk1BusinessLastCatalogSchema = z
  .object({
    context: Mk1CatalogContextSchema,
    filters: Mk1CatalogFiltersSchema,
  })
  .strict();

export const Mk1BusinessSliceSchema = z
  .object({
    version: z.literal(1),
    customCombos: z.array(Mk1BusinessCustomComboSchema).readonly(),
    namedLists: z.array(Mk1NamedListSchema).readonly(),
    lastCatalog: Mk1BusinessLastCatalogSchema.optional(),
  })
  .strict()
  .superRefine((slice, context) => {
    const seenCustomComboIds = new Set<string>();
    const seenNamedListIds = new Set<string>();

    for (const [index, combo] of slice.customCombos.entries()) {
      if (seenCustomComboIds.has(combo.id)) {
        context.addIssue({
          code: "custom",
          message: "MK1 custom combo ids must be unique.",
          path: ["customCombos", index, "id"],
        });
      }
      seenCustomComboIds.add(combo.id);
    }

    for (const [index, list] of slice.namedLists.entries()) {
      if (seenNamedListIds.has(list.id)) {
        context.addIssue({
          code: "custom",
          message: "MK1 named list ids must be unique.",
          path: ["namedLists", index, "id"],
        });
      }
      seenNamedListIds.add(list.id);
    }
  });

const EntityLabelSchema = z
  .object({
    id: Mk1BusinessIdSchema,
    label: LocalizedTextSchema,
    shortLabel: LocalizedTextSchema.optional(),
  })
  .strict();

export const Mk1BusinessCustomComboSummarySchema = z
  .object({
    ref: Mk1BusinessComboRefSchema,
    gameId: z.literal("mk1"),
    source: z.literal(comboSources.custom),
    title: LocalizedTextSchema,
    character: EntityLabelSchema,
    kameo: EntityLabelSchema,
    movePath: z.array(Mk1BusinessIdSchema).min(1).readonly(),
    cachedNotation: z
      .array(z.array(Mk1InputNotationValueSchema).min(1).readonly())
      .min(1)
      .readonly(),
    metadata: Mk1ComboMetadataSchema.optional(),
    tags: z.array(z.string().min(1)).readonly(),
    notes: LocalizedTextSchema.optional(),
    gameVersion: z.string().min(1),
    comboState: BuilderComboStateSchema,
    createdAt: Mk1BusinessDateTimeSchema,
    updatedAt: Mk1BusinessDateTimeSchema,
  })
  .strict();

export const Mk1BusinessSeededComboDetailSchema = z
  .object({
    source: z.literal(comboSources.seeded),
    ref: Mk1BusinessComboRefSchema,
    summary: Mk1CatalogComboSummarySchema,
    comboState: BuilderComboStateSchema,
  })
  .strict();

export const Mk1BusinessCustomComboDetailSchema = z
  .object({
    source: z.literal(comboSources.custom),
    ref: Mk1BusinessComboRefSchema,
    combo: Mk1BusinessCustomComboSchema,
    summary: Mk1BusinessCustomComboSummarySchema,
  })
  .strict();

export const Mk1BusinessComboDetailSchema = z.discriminatedUnion("source", [
  Mk1BusinessSeededComboDetailSchema,
  Mk1BusinessCustomComboDetailSchema,
]);

export const Mk1BusinessComboLookupSchema = z.discriminatedUnion("status", [
  z
    .object({
      status: z.literal("found"),
      detail: Mk1BusinessComboDetailSchema,
      messages: z.array(ValidationMessageSchema).readonly(),
    })
    .strict(),
  z
    .object({
      status: z.literal("notFound"),
      ref: Mk1BusinessComboRefSchema,
      reason: ValidationMessageSchema,
      messages: z.array(ValidationMessageSchema).readonly(),
    })
    .strict(),
]);

export const Mk1ResolvedNamedListItemSchema = z.discriminatedUnion("status", [
  z
    .object({
      status: z.literal("found"),
      item: Mk1NamedListItemSchema,
      detail: Mk1BusinessComboDetailSchema,
      messages: z.array(ValidationMessageSchema).readonly(),
    })
    .strict(),
  z
    .object({
      status: z.literal("unresolved"),
      item: Mk1NamedListItemSchema,
      reason: ValidationMessageSchema,
      messages: z.array(ValidationMessageSchema).readonly(),
    })
    .strict(),
]);

export const Mk1ResolvedNamedListSchema = z
  .object({
    list: Mk1NamedListSchema,
    items: z.array(Mk1ResolvedNamedListItemSchema).readonly(),
    messages: z.array(ValidationMessageSchema).readonly(),
  })
  .strict();

export const Mk1BusinessValidationReportSchema = z
  .object({
    slice: Mk1BusinessSliceSchema,
    messages: z.array(ValidationMessageSchema).readonly(),
  })
  .strict();

export const Mk1BusinessBuilderContextSchema = Mk1BuilderContextSchema;

export const Mk1BusinessBuilderStateSchema = z
  .object({
    context: Mk1BuilderContextSchema,
    movePath: z.array(Mk1BusinessIdSchema).readonly(),
    builderPath: BuilderMovePathSchema,
    cachedNotation: z.array(z.array(Mk1InputNotationValueSchema).min(1).readonly()).readonly(),
    comboState: BuilderComboStateSchema,
    runtime: BuilderRuntimeSnapshotSchema.optional(),
    validNextMoves: Mk1BuilderMoveChoicesSchema,
  })
  .strict();
