import type { z } from "zod/v4";

import type {
  BuilderInvalidBoundarySchema,
  BuilderReplayInvalidSchema,
  BuilderReplayResultSchema,
  BuilderReplayStatusSchema,
  BuilderReplayValidSchema,
} from "./schema";

export { builderReplayStatuses } from "./value";

export type BuilderReplayStatus = z.output<typeof BuilderReplayStatusSchema>;

export type BuilderInvalidBoundary = z.output<typeof BuilderInvalidBoundarySchema>;

export type BuilderReplayValid = z.output<typeof BuilderReplayValidSchema>;

export type BuilderReplayInvalid = z.output<typeof BuilderReplayInvalidSchema>;

export type BuilderReplayResult = z.output<typeof BuilderReplayResultSchema>;
