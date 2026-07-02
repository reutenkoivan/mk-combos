import type { z } from "zod/v4";

import type { BuilderRuntimeSnapshotSchema, BuilderRuntimeValuesSchema } from "./schema";

export type BuilderRuntimeValues = z.output<typeof BuilderRuntimeValuesSchema>;

export type BuilderRuntimeSnapshot = z.output<typeof BuilderRuntimeSnapshotSchema>;
