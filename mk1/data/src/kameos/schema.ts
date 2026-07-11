import { z } from "zod/v4";

import {
  Mk1IdSchema,
  Mk1LabelSchema,
  Mk1PickerSlotSchema,
  Mk1SourceIdListSchema,
} from "../shared/schema";

export const Mk1KameoSchema = z
  .object({
    id: Mk1IdSchema,
    label: Mk1LabelSchema,
    shortLabel: Mk1LabelSchema.optional(),
    kameoOrder: z.number().int().positive(),
    release: z.enum(["base", "unlockable", "kombatPack1", "khaosReigns"]),
    pickerSlot: Mk1PickerSlotSchema,
    sourceIds: Mk1SourceIdListSchema,
  })
  .strict();
