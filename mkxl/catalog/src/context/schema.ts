import { ValidationMessageSchema } from "@mk-combos/contracts/result/schema";
import { LocalizedTextSchema } from "@mk-combos/contracts/settings/schema";
import { MkxlPickerSlotSchema } from "@mk-combos/mkxl-data/shared/schema";
import { z } from "zod/v4";

import { MkxlCatalogFiltersSchema } from "../filters/schema";
import {
  mkxlCatalogContextStatuses,
  mkxlCatalogOptionAvailabilities,
  mkxlCatalogRecoveryCodes,
} from "./value";

const MkxlCatalogIdSchema = z.string().min(1);

export const MkxlCatalogContextStatusSchema = z.enum(mkxlCatalogContextStatuses);
export const MkxlCatalogRecoveryCodeSchema = z.enum(mkxlCatalogRecoveryCodes);
export const MkxlCatalogOptionAvailabilitySchema = z.enum(mkxlCatalogOptionAvailabilities);

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
    pickerSlot: MkxlPickerSlotSchema,
    comboCount: z.number().int().min(0),
    availability: MkxlCatalogOptionAvailabilitySchema,
  })
  .strict();

export const MkxlCatalogVariationOptionSchema = z
  .object({
    id: MkxlCatalogIdSchema,
    characterId: MkxlCatalogIdSchema,
    label: LocalizedTextSchema,
    variationOrder: z.number().int().positive(),
    pickerSlot: MkxlPickerSlotSchema,
    comboCount: z.number().int().min(0),
    availability: MkxlCatalogOptionAvailabilitySchema,
  })
  .strict();

export const MkxlCatalogContextOptionsSchema = z
  .object({
    characters: z.array(MkxlCatalogCharacterOptionSchema).readonly(),
    variations: z.array(MkxlCatalogVariationOptionSchema).readonly(),
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
