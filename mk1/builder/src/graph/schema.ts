import { BuilderMetadataSchema } from "@mk-combos/builder-core/graph/schema";
import { BuilderTransitionCandidateSchema } from "@mk-combos/builder-core/transition/schema";
import { z } from "zod/v4";

import { Mk1BuilderIdSchema } from "../context/schema";
import { mk1BuilderMoveChoiceKinds } from "./value";

export const Mk1BuilderMoveChoiceKindSchema = z.enum(mk1BuilderMoveChoiceKinds);

export const Mk1BuilderMoveChoiceSchema = z
  .object({
    id: Mk1BuilderIdSchema,
    kind: Mk1BuilderMoveChoiceKindSchema,
    moveId: Mk1BuilderIdSchema,
    label: z.string().min(1),
    candidates: z.array(BuilderTransitionCandidateSchema).min(1).readonly(),
    metadata: BuilderMetadataSchema.optional(),
  })
  .strict();

export const Mk1BuilderMoveChoicesSchema = z.array(Mk1BuilderMoveChoiceSchema).readonly();
