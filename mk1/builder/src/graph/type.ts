import type { z } from "zod/v4";

import type {
  Mk1BuilderMoveChoiceKindSchema,
  Mk1BuilderMoveChoiceSchema,
  Mk1BuilderMoveChoicesSchema,
} from "./schema";

export type Mk1BuilderMoveChoiceKind = z.output<typeof Mk1BuilderMoveChoiceKindSchema>;

export type Mk1BuilderMoveChoice = z.output<typeof Mk1BuilderMoveChoiceSchema>;

export type Mk1BuilderMoveChoices = z.output<typeof Mk1BuilderMoveChoicesSchema>;
