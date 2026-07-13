import type { z } from "zod/v4";

import type {
  Mk1LabelSchema,
  Mk1PickerSlotSchema,
  Mk1PickerSlotStatusSchema,
  Mk1SourceIdListSchema,
} from "./schema";

export type Mk1Label = z.output<typeof Mk1LabelSchema>;

export type Mk1SourceIdList = z.output<typeof Mk1SourceIdListSchema>;

export type Mk1PickerSlotStatus = z.output<typeof Mk1PickerSlotStatusSchema>;

export type Mk1PickerSlot = z.output<typeof Mk1PickerSlotSchema>;
