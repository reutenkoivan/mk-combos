import { LocalizedTextSchema } from "@mk-combos/contracts/settings/schema";
import {
  MkxlComboDifficultySchema,
  MkxlComboPositionSchema,
  MkxlComboRouteTypeSchema,
} from "@mk-combos/mkxl-data/combos/schema";
import { z } from "zod/v4";

import {
  mkxlCatalogFilterIds,
  mkxlCatalogFilterQueryKeys,
  mkxlCatalogMultiSelectFilterIds,
  mkxlCatalogSingleSelectFilterIds,
  mkxlCatalogSources,
} from "./value";

const MkxlCatalogIdSchema = z.string().min(1);
const PlainFilterValueSchema = z.union([z.string(), z.array(z.string()).readonly()]);

export const MkxlCatalogFilterIdSchema = z.enum(mkxlCatalogFilterIds);
export const MkxlCatalogMultiSelectFilterIdSchema = z.enum(mkxlCatalogMultiSelectFilterIds);
export const MkxlCatalogSingleSelectFilterIdSchema = z.enum(mkxlCatalogSingleSelectFilterIds);
export const MkxlCatalogSourceSchema = z.enum(mkxlCatalogSources);
export const MkxlCatalogFilterQueryKeySchema = z.enum(mkxlCatalogFilterQueryKeys);

export const MkxlCatalogFiltersSchema = z
  .object({
    positions: z.array(MkxlComboPositionSchema).min(1).readonly().optional(),
    meter: z.array(z.number().int().min(0)).min(1).readonly().optional(),
    difficulties: z.array(MkxlComboDifficultySchema).min(1).readonly().optional(),
    routeClasses: z.array(MkxlComboRouteTypeSchema).min(1).readonly().optional(),
    sources: z.array(MkxlCatalogSourceSchema).min(1).readonly().optional(),
    stageId: MkxlCatalogIdSchema.optional(),
    interactableIds: z.array(MkxlCatalogIdSchema).min(1).readonly().optional(),
  })
  .strict();

export const MkxlCatalogPlainFilterQuerySchema = z
  .object({
    position: PlainFilterValueSchema.optional(),
    meter: PlainFilterValueSchema.optional(),
    difficulty: PlainFilterValueSchema.optional(),
    routeClass: PlainFilterValueSchema.optional(),
    source: PlainFilterValueSchema.optional(),
    stage: PlainFilterValueSchema.optional(),
    interactable: PlainFilterValueSchema.optional(),
  })
  .strict();

export const MkxlCatalogFilterQuerySchema = z
  .object({
    position: z.array(MkxlComboPositionSchema).min(1).readonly().optional(),
    meter: z.array(z.string().regex(/^\d+$/u)).min(1).readonly().optional(),
    difficulty: z.array(MkxlComboDifficultySchema).min(1).readonly().optional(),
    routeClass: z.array(MkxlComboRouteTypeSchema).min(1).readonly().optional(),
    source: z.array(MkxlCatalogSourceSchema).min(1).readonly().optional(),
    stage: MkxlCatalogIdSchema.optional(),
    interactable: z.array(MkxlCatalogIdSchema).min(1).readonly().optional(),
  })
  .strict();

export const MkxlCatalogFilterOptionSchema = z
  .object({
    id: z.string().min(1),
    label: LocalizedTextSchema,
    count: z.number().int().min(0),
    selected: z.boolean(),
    disabled: z.boolean(),
    disabledReason: LocalizedTextSchema.optional(),
  })
  .strict();

const MkxlCatalogMultiSelectFacetSchema = z
  .object({
    kind: z.literal("multiSelect"),
    id: MkxlCatalogMultiSelectFilterIdSchema,
    options: z.array(MkxlCatalogFilterOptionSchema).readonly(),
  })
  .strict();

const MkxlCatalogSingleSelectFacetSchema = z
  .object({
    kind: z.literal("singleSelect"),
    id: MkxlCatalogSingleSelectFilterIdSchema,
    options: z.array(MkxlCatalogFilterOptionSchema).readonly(),
  })
  .strict();

export const MkxlCatalogFilterFacetSchema = z.discriminatedUnion("kind", [
  MkxlCatalogMultiSelectFacetSchema,
  MkxlCatalogSingleSelectFacetSchema,
]);
