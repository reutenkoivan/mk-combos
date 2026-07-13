import { z } from "zod/v4";

import {
  Mk1IdSchema,
  Mk1LabelSchema,
  Mk1PickerSlotSchema,
  Mk1SourceIdListSchema,
} from "../shared/schema";
import { mk1CharacterReleaseKinds } from "./constants";

export const Mk1CharacterReleaseKindSchema = z.enum(mk1CharacterReleaseKinds);

export const Mk1CharacterSchema = z
  .object({
    id: Mk1IdSchema,
    label: Mk1LabelSchema,
    shortLabel: Mk1LabelSchema.optional(),
    rosterOrder: z.number().int().positive(),
    release: Mk1CharacterReleaseKindSchema,
    pickerSlot: Mk1PickerSlotSchema,
    sourceIds: Mk1SourceIdListSchema,
  })
  .strict();
