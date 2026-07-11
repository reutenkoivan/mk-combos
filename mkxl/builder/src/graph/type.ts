import type { z } from "zod/v4";

import type {
  MkxlBuilderMoveChoiceKindSchema,
  MkxlBuilderMoveChoiceSchema,
  MkxlBuilderMoveChoicesSchema,
} from "./schema";

export type MkxlBuilderMoveChoiceKind = z.output<typeof MkxlBuilderMoveChoiceKindSchema>;

export type MkxlBuilderMoveChoice = z.output<typeof MkxlBuilderMoveChoiceSchema>;

export type MkxlBuilderMoveChoices = z.output<typeof MkxlBuilderMoveChoicesSchema>;
