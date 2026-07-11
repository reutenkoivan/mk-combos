import { ValidationMessageSchema } from "@mk-combos/contracts/result/schema";
import { LocalizedTextSchema } from "@mk-combos/contracts/settings/schema";
import {
  MkxlComboDifficultySchema,
  MkxlComboPositionSchema,
  MkxlComboRouteTypeSchema,
} from "@mk-combos/mkxl-data/combos/schema";
import { z } from "zod/v4";

import { MkxlCatalogFiltersSchema } from "../filters/schema";
import {
  mkxlCatalogContextStatuses,
  mkxlCatalogRecoveryCodes,
  mkxlCatalogRouteQueryKeys,
} from "./value";

export {
  mkxlCatalogContextStatuses,
  mkxlCatalogRecoveryCodes,
  mkxlCatalogRouteQueryKeys,
} from "./value";

const MkxlCatalogIdSchema = z.string().min(1);

const MkxlCatalogQueryNumberSchema = z.string().regex(/^\d+$/u);

const MkxlCatalogQueryStringListSchema = z.array(z.string().min(1)).min(1).readonly();

const MkxlCatalogPickerSlotSchema = z
  .object({
    slotId: MkxlCatalogIdSchema,
    optionId: MkxlCatalogIdSchema.optional(),
    row: z.number().int().positive(),
    column: z.number().int().positive(),
    compactOrder: z.number().int().positive().optional(),
    status: z.enum(["selectable", "disabledNoComboData", "placeholder"]),
  })
  .strict();

export const MkxlCatalogContextStatusSchema = z.enum(mkxlCatalogContextStatuses);

export const MkxlCatalogRecoveryCodeSchema = z.enum(mkxlCatalogRecoveryCodes);

export const MkxlCatalogRouteQueryKeySchema = z.enum(mkxlCatalogRouteQueryKeys);

export const MkxlCatalogRequiredContextSchema = z
  .object({
    characterId: MkxlCatalogIdSchema,
    variationId: MkxlCatalogIdSchema,
  })
  .strict();

export const MkxlCatalogContextSchema = z
  .object({
    characterId: MkxlCatalogIdSchema.optional(),
    variationId: MkxlCatalogIdSchema.optional(),
  })
  .strict();

export const MkxlCatalogCharacterOptionSchema = z
  .object({
    id: MkxlCatalogIdSchema,
    label: LocalizedTextSchema,
    shortLabel: LocalizedTextSchema.optional(),
    rosterOrder: z.number().int().positive(),
    comboCount: z.number().int().min(0),
    availability: z.enum(["available", "disabledNoComboData"]),
  })
  .strict();

export const MkxlCatalogVariationOptionSchema = z
  .object({
    id: MkxlCatalogIdSchema,
    characterId: MkxlCatalogIdSchema,
    label: LocalizedTextSchema,
    variationOrder: z.number().int().positive(),
    pickerSlot: MkxlCatalogPickerSlotSchema,
    comboCount: z.number().int().min(0),
    availability: z.enum(["available", "disabledNoComboData"]),
  })
  .strict();

export const MkxlCatalogContextOptionsSchema = z
  .object({
    characters: z.array(MkxlCatalogCharacterOptionSchema).readonly(),
    variations: z.array(MkxlCatalogVariationOptionSchema).readonly(),
  })
  .strict();

export const MkxlCatalogRouteQuerySchema = z
  .object({
    character: MkxlCatalogIdSchema.optional(),
    variation: MkxlCatalogIdSchema.optional(),
    starter: MkxlCatalogQueryStringListSchema.optional(),
    position: z.array(MkxlComboPositionSchema).min(1).readonly().optional(),
    meter: z.array(MkxlCatalogQueryNumberSchema).min(1).readonly().optional(),
    damageMin: MkxlCatalogQueryNumberSchema.optional(),
    damageMax: MkxlCatalogQueryNumberSchema.optional(),
    difficulty: z.array(MkxlComboDifficultySchema).min(1).readonly().optional(),
    routeType: z.array(MkxlComboRouteTypeSchema).min(1).readonly().optional(),
    tag: MkxlCatalogQueryStringListSchema.optional(),
    stage: MkxlCatalogIdSchema.optional(),
    interactable: MkxlCatalogQueryStringListSchema.optional(),
  })
  .strict();

export const MkxlCatalogRecoverySchema = z
  .object({
    status: MkxlCatalogContextStatusSchema,
    context: MkxlCatalogContextSchema,
    filters: MkxlCatalogFiltersSchema,
    messages: z.array(ValidationMessageSchema).readonly(),
  })
  .strict();
