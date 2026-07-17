import { LocalizedTextSchema } from "@mk-combos/contracts/settings/schema";
import {
  Mk1ComboDifficultySchema,
  Mk1ComboPositionSchema,
  Mk1ComboRouteTypeSchema,
} from "@mk-combos/mk1-data/combos/schema";
import { z } from "zod/v4";

import {
  mk1CatalogFilterIds,
  mk1CatalogFilterQueryKeys,
  mk1CatalogMultiSelectFilterIds,
  mk1CatalogSources,
} from "./value";

const Mk1CatalogIdSchema = z.string().min(1);
const PlainFilterValueSchema = z.union([z.string(), z.array(z.string()).readonly()]);

export const Mk1CatalogFilterIdSchema = z.enum(mk1CatalogFilterIds);

export const Mk1CatalogMultiSelectFilterIdSchema = z.enum(mk1CatalogMultiSelectFilterIds);

export const Mk1CatalogSourceSchema = z.enum(mk1CatalogSources);

export const Mk1CatalogFilterQueryKeySchema = z.enum(mk1CatalogFilterQueryKeys);

export const Mk1CatalogFiltersSchema = z
  .object({
    positions: z.array(Mk1ComboPositionSchema).min(1).readonly().optional(),
    meter: z.array(z.number().int().min(0)).min(1).readonly().optional(),
    difficulties: z.array(Mk1ComboDifficultySchema).min(1).readonly().optional(),
    routeClasses: z.array(Mk1ComboRouteTypeSchema).min(1).readonly().optional(),
    sources: z.array(Mk1CatalogSourceSchema).min(1).readonly().optional(),
  })
  .strict();

export const Mk1CatalogPlainFilterQuerySchema = z
  .object({
    position: PlainFilterValueSchema.optional(),
    meter: PlainFilterValueSchema.optional(),
    difficulty: PlainFilterValueSchema.optional(),
    routeClass: PlainFilterValueSchema.optional(),
    source: PlainFilterValueSchema.optional(),
  })
  .strict();

export const Mk1CatalogFilterQuerySchema = z
  .object({
    position: z.array(Mk1ComboPositionSchema).min(1).readonly().optional(),
    meter: z.array(z.string().regex(/^\d+$/u)).min(1).readonly().optional(),
    difficulty: z.array(Mk1ComboDifficultySchema).min(1).readonly().optional(),
    routeClass: z.array(Mk1ComboRouteTypeSchema).min(1).readonly().optional(),
    source: z.array(Mk1CatalogSourceSchema).min(1).readonly().optional(),
  })
  .strict();

export const Mk1CatalogFilterOptionSchema = z
  .object({
    id: Mk1CatalogIdSchema,
    label: LocalizedTextSchema,
    count: z.number().int().min(0),
    selected: z.boolean(),
    disabled: z.boolean(),
    disabledReason: LocalizedTextSchema.optional(),
  })
  .strict();

const Mk1CatalogMultiSelectFacetSchema = z
  .object({
    kind: z.literal("multiSelect"),
    id: Mk1CatalogMultiSelectFilterIdSchema,
    options: z.array(Mk1CatalogFilterOptionSchema).readonly(),
  })
  .strict();

export const Mk1CatalogFilterFacetSchema = Mk1CatalogMultiSelectFacetSchema;
