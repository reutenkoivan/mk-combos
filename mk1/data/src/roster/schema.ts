import { z } from "zod/v4";

import {
  Mk1IdSchema,
  Mk1LabelSchema,
  Mk1PickerSlotSchema,
  Mk1SourceIdListSchema,
} from "../shared/schema";

export const Mk1CharacterSchema = z
  .object({
    id: Mk1IdSchema,
    label: Mk1LabelSchema,
    shortLabel: Mk1LabelSchema.optional(),
    rosterOrder: z.number().int().positive(),
    release: z.enum(["base", "unlockable", "preorder", "kombatPack1", "khaosReigns"]),
    pickerSlot: Mk1PickerSlotSchema,
    sourceIds: Mk1SourceIdListSchema,
  })
  .strict();
