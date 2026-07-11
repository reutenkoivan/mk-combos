import { LocalizedTextSchema } from "@mk-combos/contracts/settings/schema";
import { z } from "zod/v4";

export const Mk1IdSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9][a-z0-9:-]*$/u);

export const Mk1LabelSchema = LocalizedTextSchema.refine(
  (value) => Boolean(value.EN ?? value.UA ?? value.default ?? value.fallback),
  {
    message: "Localized labels must provide at least one readable value.",
  },
);

const Mk1SourceIdSchema = z.string().min(1);

export const Mk1SourceIdListSchema = z.array(Mk1SourceIdSchema).min(1).readonly();

export const Mk1PickerSlotSchema = z
  .object({
    slotId: Mk1IdSchema,
    optionId: Mk1IdSchema.optional(),
    row: z.number().int().positive(),
    column: z.number().int().positive(),
    compactOrder: z.number().int().positive().optional(),
    status: z.enum(["selectable", "disabledNoComboData", "placeholder"]),
  })
  .strict();
