import { BuilderMovePathSchema } from "@mk-combos/builder-core/graph/schema";
import { BuilderRuntimeSnapshotSchema } from "@mk-combos/builder-core/runtime/schema";
import { BuilderComboStateSchema } from "@mk-combos/builder-core/stale/schema";
import { ComboIdSchema, ComboSourceSchema } from "@mk-combos/contracts/identity/schema";
import { comboSources } from "@mk-combos/contracts/identity/value";
import { ValidationMessageSchema } from "@mk-combos/contracts/result/schema";
import { LocalizedTextSchema } from "@mk-combos/contracts/settings/schema";
import { MkxlBuilderContextSchema } from "@mk-combos/mkxl-builder/context/schema";
import { MkxlBuilderMoveChoicesSchema } from "@mk-combos/mkxl-builder/graph/schema";
import { MkxlCatalogContextSchema } from "@mk-combos/mkxl-catalog/context/schema";
import { MkxlCatalogFiltersSchema } from "@mk-combos/mkxl-catalog/filters/schema";
import { MkxlCatalogComboSummarySchema } from "@mk-combos/mkxl-catalog/summary/schema";
import {
  MkxlComboMetadataSchema,
  MkxlComboStageContextSchema,
} from "@mk-combos/mkxl-data/combos/schema";
import { MkxlInputNotationValueSchema } from "@mk-combos/mkxl-data/movelists/schema";
import { z } from "zod/v4";

const MkxlBusinessIdSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9][a-z0-9:-]*$/u);

const MkxlBusinessDateTimeSchema = z.iso.datetime();

export const MkxlBusinessComboSourceSchema = ComboSourceSchema;

export const MkxlBusinessComboRefSchema = z
  .object({
    gameId: z.literal("mkxl"),
    source: MkxlBusinessComboSourceSchema,
    comboId: ComboIdSchema,
  })
  .strict();

export const MkxlBusinessCustomComboSchema = z
  .object({
    id: ComboIdSchema,
    gameId: z.literal("mkxl"),
    source: z.literal(comboSources.custom),
    title: LocalizedTextSchema.optional(),
    characterId: MkxlBusinessIdSchema,
    variationId: MkxlBusinessIdSchema,
    stageContext: MkxlComboStageContextSchema,
    movePath: z.array(MkxlBusinessIdSchema).min(1).readonly(),
    cachedNotation: z
      .array(z.array(MkxlInputNotationValueSchema).min(1).readonly())
      .min(1)
      .readonly(),
    metadata: MkxlComboMetadataSchema.optional(),
    notes: LocalizedTextSchema.optional(),
    gameVersion: z.string().min(1),
    createdAt: MkxlBusinessDateTimeSchema,
    updatedAt: MkxlBusinessDateTimeSchema,
  })
  .strict()
  .superRefine((combo, context) => {
    if (combo.cachedNotation.length !== combo.movePath.length) {
      context.addIssue({
        code: "custom",
        message: "MKXL custom combo cachedNotation must match movePath length.",
        path: ["cachedNotation"],
      });
    }
  });

export const MkxlNamedListItemSchema = z
  .object({
    ref: MkxlBusinessComboRefSchema,
    addedAt: MkxlBusinessDateTimeSchema.optional(),
  })
  .strict();

export const MkxlNamedListSchema = z
  .object({
    id: MkxlBusinessIdSchema,
    gameId: z.literal("mkxl"),
    name: z.string().min(1),
    items: z.array(MkxlNamedListItemSchema).readonly(),
    createdAt: MkxlBusinessDateTimeSchema,
    updatedAt: MkxlBusinessDateTimeSchema,
  })
  .strict()
  .superRefine((list, context) => {
    const seenRefs = new Set<string>();

    for (const [index, item] of list.items.entries()) {
      const refKey = `${item.ref.source}\u0000${item.ref.comboId}`;

      if (seenRefs.has(refKey)) {
        context.addIssue({
          code: "custom",
          message: "MKXL named list cannot contain duplicate combo references.",
          path: ["items", index, "ref"],
        });
      }

      seenRefs.add(refKey);
    }
  });

export const MkxlBusinessLastCatalogSchema = z
  .object({
    context: MkxlCatalogContextSchema,
    filters: MkxlCatalogFiltersSchema,
  })
  .strict();

export const MkxlBusinessSliceSchema = z
  .object({
    version: z.literal(1),
    customCombos: z.array(MkxlBusinessCustomComboSchema).readonly(),
    namedLists: z.array(MkxlNamedListSchema).readonly(),
    lastCatalog: MkxlBusinessLastCatalogSchema.optional(),
  })
  .strict()
  .superRefine((slice, context) => {
    const seenCustomComboIds = new Set<string>();
    const seenNamedListIds = new Set<string>();

    for (const [index, combo] of slice.customCombos.entries()) {
      if (seenCustomComboIds.has(combo.id)) {
        context.addIssue({
          code: "custom",
          message: "MKXL custom combo ids must be unique.",
          path: ["customCombos", index, "id"],
        });
      }

      seenCustomComboIds.add(combo.id);
    }

    for (const [index, list] of slice.namedLists.entries()) {
      if (seenNamedListIds.has(list.id)) {
        context.addIssue({
          code: "custom",
          message: "MKXL named list ids must be unique.",
          path: ["namedLists", index, "id"],
        });
      }

      seenNamedListIds.add(list.id);
    }
  });

export const MkxlBusinessCustomComboSummarySchema = z
  .object({
    ref: MkxlBusinessComboRefSchema,
    gameId: z.literal("mkxl"),
    source: z.literal(comboSources.custom),
    title: LocalizedTextSchema,
    character: z
      .object({
        id: MkxlBusinessIdSchema,
        label: LocalizedTextSchema,
        shortLabel: LocalizedTextSchema.optional(),
      })
      .strict(),
    variation: z
      .object({
        id: MkxlBusinessIdSchema,
        characterId: MkxlBusinessIdSchema,
        label: LocalizedTextSchema,
      })
      .strict(),
    stageContext: MkxlComboStageContextSchema,
    stage: z
      .object({
        id: MkxlBusinessIdSchema,
        label: LocalizedTextSchema,
      })
      .strict()
      .optional(),
    interactables: z
      .array(
        z
          .object({
            id: MkxlBusinessIdSchema,
            label: LocalizedTextSchema,
          })
          .strict(),
      )
      .readonly(),
    movePath: z.array(MkxlBusinessIdSchema).min(1).readonly(),
    cachedNotation: z
      .array(z.array(MkxlInputNotationValueSchema).min(1).readonly())
      .min(1)
      .readonly(),
    metadata: MkxlComboMetadataSchema.optional(),
    tags: z.array(z.string().min(1)).readonly(),
    notes: LocalizedTextSchema.optional(),
    gameVersion: z.string().min(1),
    comboState: BuilderComboStateSchema,
    createdAt: MkxlBusinessDateTimeSchema,
    updatedAt: MkxlBusinessDateTimeSchema,
  })
  .strict();

export const MkxlBusinessSeededComboDetailSchema = z
  .object({
    source: z.literal(comboSources.seeded),
    ref: MkxlBusinessComboRefSchema,
    summary: MkxlCatalogComboSummarySchema,
    comboState: BuilderComboStateSchema,
  })
  .strict();

export const MkxlBusinessCustomComboDetailSchema = z
  .object({
    source: z.literal(comboSources.custom),
    ref: MkxlBusinessComboRefSchema,
    combo: MkxlBusinessCustomComboSchema,
    summary: MkxlBusinessCustomComboSummarySchema,
  })
  .strict();

export const MkxlBusinessComboDetailSchema = z.discriminatedUnion("source", [
  MkxlBusinessSeededComboDetailSchema,
  MkxlBusinessCustomComboDetailSchema,
]);

export const MkxlBusinessComboLookupSchema = z.discriminatedUnion("status", [
  z
    .object({
      status: z.literal("found"),
      detail: MkxlBusinessComboDetailSchema,
      messages: z.array(ValidationMessageSchema).readonly(),
    })
    .strict(),
  z
    .object({
      status: z.literal("notFound"),
      ref: MkxlBusinessComboRefSchema,
      reason: ValidationMessageSchema,
      messages: z.array(ValidationMessageSchema).readonly(),
    })
    .strict(),
]);

export const MkxlResolvedNamedListItemSchema = z.discriminatedUnion("status", [
  z
    .object({
      status: z.literal("found"),
      item: MkxlNamedListItemSchema,
      detail: MkxlBusinessComboDetailSchema,
      messages: z.array(ValidationMessageSchema).readonly(),
    })
    .strict(),
  z
    .object({
      status: z.literal("unresolved"),
      item: MkxlNamedListItemSchema,
      reason: ValidationMessageSchema,
      messages: z.array(ValidationMessageSchema).readonly(),
    })
    .strict(),
]);

export const MkxlResolvedNamedListSchema = z
  .object({
    list: MkxlNamedListSchema,
    items: z.array(MkxlResolvedNamedListItemSchema).readonly(),
    messages: z.array(ValidationMessageSchema).readonly(),
  })
  .strict();

export const MkxlBusinessValidationReportSchema = z
  .object({
    slice: MkxlBusinessSliceSchema,
    messages: z.array(ValidationMessageSchema).readonly(),
  })
  .strict();

export const MkxlBusinessBuilderContextSchema = MkxlBuilderContextSchema;

export const MkxlBusinessBuilderStateSchema = z
  .object({
    context: MkxlBuilderContextSchema,
    movePath: z.array(MkxlBusinessIdSchema).readonly(),
    builderPath: BuilderMovePathSchema,
    cachedNotation: z.array(z.array(MkxlInputNotationValueSchema).min(1).readonly()).readonly(),
    comboState: BuilderComboStateSchema,
    runtime: BuilderRuntimeSnapshotSchema.optional(),
    validNextMoves: MkxlBuilderMoveChoicesSchema,
  })
  .strict();
