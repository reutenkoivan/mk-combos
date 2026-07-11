import type { BuilderMovePath, BuilderPathStep } from "@mk-combos/builder-core/graph/type";
import { z } from "zod/v4";

import { MkxlBuilderIdSchema } from "../context/schema";

const MkxlBuilderPathStepInputSchema = z
  .object({
    moveId: MkxlBuilderIdSchema,
    index: z.number().int().nonnegative(),
    edgeId: z.string().min(1).optional(),
    nodeId: z.string().min(1).optional(),
    label: z.string().min(1).optional(),
  })
  .strict();

export const createMkxlBuilderPathStepFromInput = (input: {
  moveId: string;
  index: number;
  edgeId?: string;
  nodeId?: string;
  label?: string;
}): BuilderPathStep => {
  const parsedInput = MkxlBuilderPathStepInputSchema.parse(input);
  const step: BuilderPathStep = {
    id: `mkxl-step-${parsedInput.index + 1}:${parsedInput.moveId}`,
    moveId: parsedInput.moveId,
  };

  if (parsedInput.edgeId !== undefined) {
    step.edgeId = parsedInput.edgeId;
  }
  if (parsedInput.nodeId !== undefined) {
    step.nodeId = parsedInput.nodeId;
  }
  if (parsedInput.label !== undefined) {
    step.label = parsedInput.label;
  }

  return step;
};

export const createMkxlBuilderMovePathFromIds = (moveIds: readonly string[]): BuilderMovePath => {
  const parsedMoveIds = z.array(MkxlBuilderIdSchema).readonly().parse(moveIds);
  const path: BuilderPathStep[] = [];

  for (const [index, moveId] of parsedMoveIds.entries()) {
    path.push(createMkxlBuilderPathStepFromInput({ moveId, index }));
  }

  return path;
};

export const mergeMkxlBuilderStep = (
  sourceStep: BuilderPathStep | undefined,
  fallback: BuilderPathStep,
): BuilderPathStep => {
  if (!sourceStep) {
    return fallback;
  }

  const mergedStep: BuilderPathStep = {
    id: sourceStep.id,
    moveId: sourceStep.moveId,
    edgeId: fallback.edgeId,
    nodeId: fallback.nodeId,
    label: sourceStep.label ?? fallback.label,
  };

  if (sourceStep.metadata !== undefined) {
    mergedStep.metadata = sourceStep.metadata;
  }

  return mergedStep;
};
