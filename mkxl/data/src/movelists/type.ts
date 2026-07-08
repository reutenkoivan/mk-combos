import type { z } from "zod/v4";

import type {
  MkxlInputNotationValueSchema,
  MkxlMoveAvailabilitySchema,
  MkxlMoveCategorySchema,
  MkxlMoveFrameDataSchema,
  MkxlMovelistSchema,
  MkxlMoveNotationValueSchema,
  MkxlMoveSchema,
  MkxlMoveTreeSchema,
} from "./schema";

export type MkxlInputNotationValue = z.output<typeof MkxlInputNotationValueSchema>;

export type MkxlMoveNotationValue = z.output<typeof MkxlMoveNotationValueSchema>;

export type MkxlMoveCategory = z.output<typeof MkxlMoveCategorySchema>;

export type MkxlMoveAvailability = z.output<typeof MkxlMoveAvailabilitySchema>;

export type MkxlMoveFrameData = z.output<typeof MkxlMoveFrameDataSchema>;

export type MkxlMove = z.output<typeof MkxlMoveSchema>;

export type MkxlMoveTree = z.output<typeof MkxlMoveTreeSchema>;

export type MkxlMovelist = z.output<typeof MkxlMovelistSchema>;
