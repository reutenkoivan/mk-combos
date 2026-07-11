import { BuilderMovePathSchema } from "@mk-combos/builder-core/graph/schema";
import type { BuilderMovePath, BuilderPathStep } from "@mk-combos/builder-core/graph/type";
import { createInvalidReplay, createValidReplay } from "@mk-combos/builder-core/replay/runtime";
import type { BuilderReplayResult } from "@mk-combos/builder-core/replay/type";
import type { BuilderRuntimeSnapshot } from "@mk-combos/builder-core/runtime/type";
import type { BuilderTransitionAccepted } from "@mk-combos/builder-core/transition/type";

import { MkxlBuilderContextSchema } from "../context/schema";
import type { MkxlBuilderContext } from "../context/type";
import { createMkxlBuilderInitialRuntime } from "../internal/runtime-state";
import {
  createMkxlBuilderMovePathFromIds,
  createMkxlBuilderPathStepFromInput,
} from "../internal/steps";
import { attemptMkxlTransition } from "../internal/transitions";

export const createMkxlBuilderPathStep = (input: {
  moveId: string;
  index: number;
  edgeId?: string;
  nodeId?: string;
  label?: string;
}): BuilderPathStep => createMkxlBuilderPathStepFromInput(input);

export const createMkxlBuilderMovePath = (moveIds: readonly string[]): BuilderMovePath =>
  createMkxlBuilderMovePathFromIds(moveIds);

export const attemptMkxlBuilderTransition = (input: {
  context: MkxlBuilderContext;
  moveId: string;
  runtime?: BuilderRuntimeSnapshot;
  step?: BuilderPathStep;
  stepIndex?: number;
}) => attemptMkxlTransition(input);

export const replayMkxlBuilderPath = (input: {
  context: MkxlBuilderContext;
  path: BuilderMovePath;
  initialRuntime?: BuilderRuntimeSnapshot;
}): BuilderReplayResult => {
  const context = MkxlBuilderContextSchema.parse(input.context);
  const originalPath = BuilderMovePathSchema.parse(input.path);
  let runtime = input.initialRuntime ?? createMkxlBuilderInitialRuntime(context);
  const acceptedTransitions: BuilderTransitionAccepted[] = [];
  const acceptedPath: BuilderPathStep[] = [];

  for (const [index, step] of originalPath.entries()) {
    const transition = attemptMkxlTransition({
      context,
      runtime,
      moveId: step.moveId,
      step,
      stepIndex: index,
    });

    if (!transition.ok) {
      return createInvalidReplay({
        originalPath,
        validPrefix: acceptedPath,
        invalidTail: originalPath.slice(index),
        invalidBoundary: {
          index,
          previousStepId: acceptedPath[index - 1]?.id,
          attemptedStepId: step.id,
        },
        reason: transition.reason,
        lastRuntime: runtime,
        acceptedTransitions,
        rejectedTransition: transition,
        metadata: {
          gameId: "mkxl",
          characterId: context.characterId,
          variationId: context.variationId,
          stageId: context.stageId,
        },
      });
    }

    acceptedTransitions.push(transition);
    acceptedPath.push(transition.step);
    runtime = transition.toRuntime;
  }

  return createValidReplay({
    originalPath,
    acceptedPath,
    finalRuntime: runtime,
    transitions: acceptedTransitions,
    metadata: {
      gameId: "mkxl",
      characterId: context.characterId,
      variationId: context.variationId,
      stageId: context.stageId,
    },
  });
};
