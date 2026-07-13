import type { z } from "zod/v4";

import type {
  MkxlIdSchema,
  MkxlLabelSchema,
  MkxlPickerSlotSchema,
  MkxlPickerSlotStatusSchema,
  MkxlSourceIdListSchema,
  MkxlSourceIdSchema,
} from "./schema";

export type MkxlId = z.output<typeof MkxlIdSchema>;

export type MkxlLabel = z.output<typeof MkxlLabelSchema>;

export type MkxlSourceId = z.output<typeof MkxlSourceIdSchema>;

export type MkxlSourceIdList = z.output<typeof MkxlSourceIdListSchema>;

export type MkxlPickerSlotStatus = z.output<typeof MkxlPickerSlotStatusSchema>;

export type MkxlPickerSlot = z.output<typeof MkxlPickerSlotSchema>;
