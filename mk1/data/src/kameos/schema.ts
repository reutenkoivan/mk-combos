import { z } from "zod/v4";

import {
  Mk1IdSchema,
  Mk1LabelSchema,
  Mk1PickerSlotSchema,
  Mk1SourceIdListSchema,
} from "../shared/schema";
import { mk1KameoReleaseKinds } from "./constants";

export const Mk1KameoReleaseKindSchema = z.enum(mk1KameoReleaseKinds);

export const Mk1KameoSchema = z
  .object({
    id: Mk1IdSchema,
    label: Mk1LabelSchema,
    shortLabel: Mk1LabelSchema.optional(),
    kameoOrder: z.number().int().positive(),
    release: Mk1KameoReleaseKindSchema,
    pickerSlot: Mk1PickerSlotSchema,
    sourceIds: Mk1SourceIdListSchema,
  })
  .strict();
