import { z } from "zod/v4";

import {
  MkxlIdSchema,
  MkxlLabelSchema,
  MkxlPickerSlotSchema,
  MkxlSourceIdListSchema,
} from "../shared/schema";

export const MkxlVariationSchema = z
  .object({
    id: MkxlIdSchema,
    characterId: MkxlIdSchema,
    label: MkxlLabelSchema,
    variationOrder: z.number().int().positive(),
    hidden: z.boolean().optional(),
    pickerSlot: MkxlPickerSlotSchema,
    sourceIds: MkxlSourceIdListSchema,
  })
  .strict();
