import { z } from "zod/v4";

import { BuilderMetadataSchema } from "../graph/schema";

export const BuilderRuntimeValuesSchema = z.record(z.string(), z.unknown());

export const BuilderRuntimeSnapshotSchema = z
  .object({
    values: BuilderRuntimeValuesSchema,
    metadata: BuilderMetadataSchema.optional(),
  })
  .strict();
