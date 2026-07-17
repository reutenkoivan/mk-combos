import { LocalizedTextSchema } from "@mk-combos/contracts/settings/schema";
import { Mk1PickerSlotSchema } from "@mk-combos/mk1-data/shared/schema";
import { z } from "zod/v4";

import {
  mk1CatalogContextStatuses,
  mk1CatalogOptionAvailabilities,
  mk1CatalogRecoveryCodes,
} from "./value";

const CatalogIdSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9][a-z0-9:-]*$/u);

export const Mk1CatalogContextStatusSchema = z.enum(mk1CatalogContextStatuses);
export const Mk1CatalogRecoveryCodeSchema = z.enum(mk1CatalogRecoveryCodes);
export const Mk1CatalogOptionAvailabilitySchema = z.enum(mk1CatalogOptionAvailabilities);

export const Mk1CatalogContextSchema = z
  .object({
    characterId: CatalogIdSchema.optional(),
    kameoId: CatalogIdSchema.optional(),
  })
  .strict();

export const Mk1CatalogCharacterOptionSchema = z
  .object({
    id: CatalogIdSchema,
    label: LocalizedTextSchema,
    shortLabel: LocalizedTextSchema.optional(),
    rosterOrder: z.number().int().positive(),
    pickerSlot: Mk1PickerSlotSchema,
    comboCount: z.number().int().min(0),
    availability: Mk1CatalogOptionAvailabilitySchema,
  })
  .strict();

export const Mk1CatalogKameoOptionSchema = z
  .object({
    id: CatalogIdSchema,
    label: LocalizedTextSchema,
    shortLabel: LocalizedTextSchema.optional(),
    kameoOrder: z.number().int().positive(),
    pickerSlot: Mk1PickerSlotSchema,
    comboCount: z.number().int().min(0),
    availability: Mk1CatalogOptionAvailabilitySchema,
  })
  .strict();

export const Mk1CatalogContextOptionsSchema = z
  .object({
    characters: z.array(Mk1CatalogCharacterOptionSchema).readonly(),
    kameos: z.array(Mk1CatalogKameoOptionSchema).readonly(),
  })
  .strict();
