import { BuilderMetadataSchema } from "@mk-combos/builder-core/graph/schema";
import type { BuilderRuntimeSnapshot } from "@mk-combos/builder-core/runtime/type";
import { z } from "zod/v4";

import { MkxlBuilderContextSchema } from "../context/schema";
import type { MkxlBuilderContext } from "../context/type";
import { resolveMkxlBuilderContext } from "./indexes";

const MkxlBuilderRuntimeValuesSchema = z
  .object({
    activeNodeIds: z.array(z.string().min(1)).readonly(),
    usedInteractableIds: z.array(z.string().min(1)).readonly(),
    frameAdvantage: z.number().int(),
  })
  .strict();

const MkxlBuilderRuntimeSnapshotSchema = z
  .object({
    values: MkxlBuilderRuntimeValuesSchema,
    metadata: BuilderMetadataSchema.optional(),
  })
  .strict();

export type MkxlBuilderRuntimeSnapshot = z.output<typeof MkxlBuilderRuntimeSnapshotSchema>;

export const parseMkxlBuilderRuntimeSnapshot = (
  runtime: BuilderRuntimeSnapshot,
): MkxlBuilderRuntimeSnapshot => MkxlBuilderRuntimeSnapshotSchema.parse(runtime);

export const createMkxlBuilderRuntimeSnapshot = (input: {
  activeNodeIds: readonly string[];
  usedInteractableIds?: readonly string[];
  frameAdvantage?: number;
  metadata?: BuilderRuntimeSnapshot["metadata"];
}): BuilderRuntimeSnapshot => {
  const snapshot = MkxlBuilderRuntimeSnapshotSchema.parse({
    values: {
      activeNodeIds: input.activeNodeIds,
      usedInteractableIds: input.usedInteractableIds ?? [],
      frameAdvantage: input.frameAdvantage ?? 0,
    },
    metadata: input.metadata,
  });

  return snapshot;
};

export const createMkxlBuilderInitialRuntime = (
  context: MkxlBuilderContext,
): BuilderRuntimeSnapshot => {
  const parsedContext = MkxlBuilderContextSchema.parse(context);
  const resolution = resolveMkxlBuilderContext(parsedContext);

  return createMkxlBuilderRuntimeSnapshot({
    activeNodeIds: resolution.ok ? resolution.runtime.startNodeIds : [],
    metadata: {
      gameId: "mkxl",
      characterId: parsedContext.characterId,
      variationId: parsedContext.variationId,
      stageId: parsedContext.stageId,
      status: resolution.ok ? "ready" : "invalid",
    },
  });
};
