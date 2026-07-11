import type { z } from "zod/v4";

import type {
  Mk1InputNotationValueSchema,
  Mk1MoveAvailabilitySchema,
  Mk1MoveCategorySchema,
  Mk1MoveFrameDataSchema,
  Mk1MovelistSchema,
  Mk1MoveNotationValueSchema,
  Mk1MoveOwnerKindSchema,
  Mk1MoveSchema,
  Mk1MoveTreeSchema,
} from "./schema";

export type Mk1InputNotationValue = z.output<typeof Mk1InputNotationValueSchema>;

export type Mk1MoveNotationValue = z.output<typeof Mk1MoveNotationValueSchema>;

export type Mk1MoveCategory = z.output<typeof Mk1MoveCategorySchema>;

export type Mk1MoveOwnerKind = z.output<typeof Mk1MoveOwnerKindSchema>;

export type Mk1MoveAvailability = z.output<typeof Mk1MoveAvailabilitySchema>;

export type Mk1MoveFrameData = z.output<typeof Mk1MoveFrameDataSchema>;

export type Mk1Move = z.output<typeof Mk1MoveSchema>;

export type Mk1MoveTree = z.output<typeof Mk1MoveTreeSchema>;

export type Mk1Movelist = z.output<typeof Mk1MovelistSchema>;
