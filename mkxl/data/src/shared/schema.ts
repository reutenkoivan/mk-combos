import { LocalizedTextSchema } from "@mk-combos/contracts/settings/schema";
import { z } from "zod/v4";

import { mkxlPickerSlotStatuses } from "./value";

export const MkxlPickerSlotStatusSchema = z.enum(mkxlPickerSlotStatuses);

export const MkxlIdSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9][a-z0-9:-]*$/u);

export const MkxlLabelSchema = LocalizedTextSchema.refine(
  (value) => Boolean(value.EN ?? value.UA ?? value.default ?? value.fallback),
  {
    message: "Localized labels must provide at least one readable value.",
  },
);

export const MkxlSourceIdSchema = z.string().min(1);

export const MkxlSourceIdListSchema = z.array(MkxlSourceIdSchema).min(1).readonly();

export const MkxlPickerSlotSchema = z
  .object({
    slotId: MkxlIdSchema,
    optionId: MkxlIdSchema.optional(),
    row: z.number().int().positive(),
    column: z.number().int().positive(),
    compactOrder: z.number().int().positive().optional(),
    status: MkxlPickerSlotStatusSchema,
  })
  .strict();
