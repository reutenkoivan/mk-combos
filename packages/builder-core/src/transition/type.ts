import type { z } from "zod/v4";

import type {
  BuilderFrameWindowSchema,
  BuilderTransitionAcceptedSchema,
  BuilderTransitionCandidateSchema,
  BuilderTransitionEffectSchema,
  BuilderTransitionRejectedSchema,
  BuilderTransitionResultSchema,
  BuilderTransitionStatusSchema,
} from "./schema";

export { builderTransitionStatuses } from "./value";

export type BuilderTransitionStatus = z.output<typeof BuilderTransitionStatusSchema>;

export type BuilderFrameWindow = z.output<typeof BuilderFrameWindowSchema>;

export type BuilderTransitionEffect = z.output<typeof BuilderTransitionEffectSchema>;

export type BuilderTransitionCandidate = z.output<typeof BuilderTransitionCandidateSchema>;

export type BuilderTransitionAccepted = z.output<typeof BuilderTransitionAcceptedSchema>;

export type BuilderTransitionRejected = z.output<typeof BuilderTransitionRejectedSchema>;

export type BuilderTransitionResult = z.output<typeof BuilderTransitionResultSchema>;
