import { LocalizedTextSchema } from "@mk-combos/contracts/settings/schema";
import {
  MkxlComboDifficultySchema,
  MkxlComboPositionSchema,
  MkxlComboRouteTypeSchema,
} from "@mk-combos/mkxl-data/combos/schema";
import { z } from "zod/v4";

import {
  mkxlCatalogFilterIds,
  mkxlCatalogMultiSelectFilterIds,
  mkxlCatalogRangeFilterIds,
} from "./value";

export {
  mkxlCatalogFilterIds,
  mkxlCatalogMultiSelectFilterIds,
  mkxlCatalogRangeFilterIds,
} from "./value";

const MkxlCatalogIdSchema = z.string().min(1);

const MkxlCatalogTagSchema = z.string().min(1);

export const MkxlCatalogFilterIdSchema = z.enum(mkxlCatalogFilterIds);

export const MkxlCatalogMultiSelectFilterIdSchema = z.enum(mkxlCatalogMultiSelectFilterIds);

export const MkxlCatalogRangeFilterIdSchema = z.enum(mkxlCatalogRangeFilterIds);

export const MkxlCatalogDamageRangeSchema = z
  .object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
  })
  .strict();

export const MkxlCatalogFiltersSchema = z
  .object({
    starters: z.array(z.string().min(1)).min(1).readonly().optional(),
    positions: z.array(MkxlComboPositionSchema).min(1).readonly().optional(),
    meter: z.array(z.number().int().min(0)).min(1).readonly().optional(),
    damage: MkxlCatalogDamageRangeSchema.optional(),
    difficulties: z.array(MkxlComboDifficultySchema).min(1).readonly().optional(),
    routeTypes: z.array(MkxlComboRouteTypeSchema).min(1).readonly().optional(),
    tags: z.array(MkxlCatalogTagSchema).min(1).readonly().optional(),
    stageId: MkxlCatalogIdSchema.optional(),
    interactableIds: z.array(MkxlCatalogIdSchema).min(1).readonly().optional(),
  })
  .strict();

export const MkxlCatalogFilterOptionSchema = z
  .object({
    id: z.string().min(1),
    label: LocalizedTextSchema,
    count: z.number().int().min(0),
    selected: z.boolean(),
  })
  .strict();

export const MkxlCatalogMultiSelectFacetSchema = z
  .object({
    kind: z.literal("multiSelect"),
    id: MkxlCatalogMultiSelectFilterIdSchema,
    options: z.array(MkxlCatalogFilterOptionSchema).readonly(),
  })
  .strict();

export const MkxlCatalogRangeFacetSchema = z
  .object({
    kind: z.literal("range"),
    id: MkxlCatalogRangeFilterIdSchema,
    min: z.number().min(0),
    max: z.number().min(0),
    selectedMin: z.number().min(0).optional(),
    selectedMax: z.number().min(0).optional(),
  })
  .strict();

export const MkxlCatalogFilterFacetSchema = z.discriminatedUnion("kind", [
  MkxlCatalogMultiSelectFacetSchema,
  MkxlCatalogRangeFacetSchema,
]);
