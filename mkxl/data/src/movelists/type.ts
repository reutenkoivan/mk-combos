import type { z } from "zod/v4";

import type {
  MkxlAttackLevelSchema,
  MkxlInputNotationValueSchema,
  MkxlMoveAvailabilitySchema,
  MkxlMoveCategorySchema,
  MkxlMoveFrameDataSchema,
  MkxlMovelistSchema,
  MkxlMoveNotationValueSchema,
  MkxlMoveSchema,
  MkxlMoveTacticalFactKindSchema,
  MkxlMoveTacticalFactSchema,
  MkxlMoveTreeSchema,
} from "./schema";

export type MkxlAttackLevel = z.output<typeof MkxlAttackLevelSchema>;

export type MkxlInputNotationValue = z.output<typeof MkxlInputNotationValueSchema>;

export type MkxlMoveNotationValue = z.output<typeof MkxlMoveNotationValueSchema>;

export type MkxlMoveCategory = z.output<typeof MkxlMoveCategorySchema>;

export type MkxlMoveAvailability = z.output<typeof MkxlMoveAvailabilitySchema>;

export type MkxlMoveTacticalFactKind = z.output<typeof MkxlMoveTacticalFactKindSchema>;

export type MkxlMoveTacticalFact = z.output<typeof MkxlMoveTacticalFactSchema>;

export type MkxlMoveFrameData = z.output<typeof MkxlMoveFrameDataSchema>;

export type MkxlMove = z.output<typeof MkxlMoveSchema>;

export type MkxlMoveTree = z.output<typeof MkxlMoveTreeSchema>;

export type MkxlMovelist = z.output<typeof MkxlMovelistSchema>;
