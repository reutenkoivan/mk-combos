import { BuilderMetadataSchema } from "@mk-combos/builder-core/graph/schema";
import type { BuilderRuntimeSnapshot } from "@mk-combos/builder-core/runtime/type";
import { z } from "zod/v4";

import { Mk1BuilderContextSchema } from "../context/schema";
import type { Mk1BuilderContext } from "../context/type";
import { resolveMk1BuilderContext } from "./indexes";

const Mk1BuilderRuntimeValuesSchema = z
  .object({
    activeNodeIds: z.array(z.string().min(1)).readonly(),
    usedKameoMoveIds: z.array(z.string().min(1)).readonly(),
    frameAdvantage: z.number().int(),
    kameoResource: z.number().int().min(0),
  })
  .strict();

const Mk1BuilderRuntimeSnapshotSchema = z
  .object({
    values: Mk1BuilderRuntimeValuesSchema,
    metadata: BuilderMetadataSchema.optional(),
  })
  .strict();

export type Mk1BuilderRuntimeSnapshot = z.output<typeof Mk1BuilderRuntimeSnapshotSchema>;

export const parseMk1BuilderRuntimeSnapshot = (
  runtime: BuilderRuntimeSnapshot,
): Mk1BuilderRuntimeSnapshot => Mk1BuilderRuntimeSnapshotSchema.parse(runtime);

export const createMk1BuilderRuntimeSnapshot = (input: {
  activeNodeIds: readonly string[];
  usedKameoMoveIds?: readonly string[];
  frameAdvantage?: number;
  kameoResource?: number;
  metadata?: BuilderRuntimeSnapshot["metadata"];
}): BuilderRuntimeSnapshot =>
  Mk1BuilderRuntimeSnapshotSchema.parse({
    values: {
      activeNodeIds: input.activeNodeIds,
      usedKameoMoveIds: input.usedKameoMoveIds ?? [],
      frameAdvantage: input.frameAdvantage ?? 0,
      kameoResource: input.kameoResource ?? 1,
    },
    metadata: input.metadata,
  });

export const createMk1BuilderInitialRuntime = (
  context: Mk1BuilderContext,
): BuilderRuntimeSnapshot => {
  const parsedContext = Mk1BuilderContextSchema.parse(context);
  const resolution = resolveMk1BuilderContext(parsedContext);

  return createMk1BuilderRuntimeSnapshot({
    activeNodeIds: resolution.ok ? resolution.runtime.startNodeIds : [],
    metadata: {
      gameId: "mk1",
      characterId: parsedContext.characterId,
      kameoId: parsedContext.kameoId,
      status: resolution.ok ? "ready" : "invalid",
    },
  });
};
