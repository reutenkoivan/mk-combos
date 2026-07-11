import {
  Mk1ComboDifficultySchema,
  Mk1ComboPositionSchema,
  Mk1ComboRouteTypeSchema,
} from "@mk-combos/mk1-data/combos/schema";
import { z } from "zod/v4";
import {
  mk1CatalogFilterIds,
  mk1CatalogMultiSelectFilterIds,
  mk1CatalogRangeFilterIds,
} from "./value";

export const Mk1CatalogFilterIdSchema = z.enum(mk1CatalogFilterIds);

export const Mk1CatalogMultiSelectFilterIdSchema = z.enum(mk1CatalogMultiSelectFilterIds);

export const Mk1CatalogRangeFilterIdSchema = z.enum(mk1CatalogRangeFilterIds);

export const Mk1CatalogDamageRangeSchema = z
  .object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
  })
  .strict()
  .refine((range) => range.min === undefined || range.max === undefined || range.max >= range.min, {
    message: "Damage max must be greater than or equal to min.",
    path: ["max"],
  });

export const Mk1CatalogFiltersSchema = z
  .object({
    starter: z.array(z.string().min(1)).readonly().optional(),
    position: z.array(Mk1ComboPositionSchema).readonly().optional(),
    meter: z.array(z.number().int().min(0)).readonly().optional(),
    difficulty: z.array(Mk1ComboDifficultySchema).readonly().optional(),
    routeType: z.array(Mk1ComboRouteTypeSchema).readonly().optional(),
    tags: z.array(z.string().min(1)).readonly().optional(),
    damage: Mk1CatalogDamageRangeSchema.optional(),
  })
  .strict();

export {
  mk1CatalogFilterIds,
  mk1CatalogMultiSelectFilterIds,
  mk1CatalogRangeFilterIds,
} from "./value";
