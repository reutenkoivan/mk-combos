import { BuilderMetadataSchema } from "@mk-combos/builder-core/graph/schema";
import { BuilderTransitionCandidateSchema } from "@mk-combos/builder-core/transition/schema";
import { z } from "zod/v4";

import { MkxlBuilderIdSchema } from "../context/schema";
import { mkxlBuilderMoveChoiceKinds } from "./value";

export const MkxlBuilderMoveChoiceKindSchema = z.enum(mkxlBuilderMoveChoiceKinds);

export const MkxlBuilderMoveChoiceSchema = z
  .object({
    id: MkxlBuilderIdSchema,
    kind: MkxlBuilderMoveChoiceKindSchema,
    moveId: MkxlBuilderIdSchema,
    label: z.string().min(1),
    candidates: z.array(BuilderTransitionCandidateSchema).min(1).readonly(),
    metadata: BuilderMetadataSchema.optional(),
  })
  .strict();

export const MkxlBuilderMoveChoicesSchema = z.array(MkxlBuilderMoveChoiceSchema).readonly();
