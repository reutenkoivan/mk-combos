import { BuilderMovePathSchema } from "@mk-combos/builder-core/graph/schema";
import type { BuilderMovePath, BuilderPathStep } from "@mk-combos/builder-core/graph/type";
import { createInvalidReplay, createValidReplay } from "@mk-combos/builder-core/replay/runtime";
import type { BuilderReplayResult } from "@mk-combos/builder-core/replay/type";
import type { BuilderRuntimeSnapshot } from "@mk-combos/builder-core/runtime/type";
import type { BuilderTransitionAccepted } from "@mk-combos/builder-core/transition/type";

import { Mk1BuilderContextSchema } from "../context/schema";
import type { Mk1BuilderContext } from "../context/type";
import { createMk1BuilderInitialRuntime } from "../internal/runtime-state";
import {
  createMk1BuilderMovePathFromIds,
  createMk1BuilderPathStepFromInput,
} from "../internal/steps";
import { attemptMk1Transition } from "../internal/transitions";

export const createMk1BuilderPathStep = (input: {
  moveId: string;
  index: number;
  edgeId?: string;
  nodeId?: string;
  label?: string;
}): BuilderPathStep => createMk1BuilderPathStepFromInput(input);

export const createMk1BuilderMovePath = (moveIds: readonly string[]): BuilderMovePath =>
  createMk1BuilderMovePathFromIds(moveIds);

export const attemptMk1BuilderTransition = (input: {
  context: Mk1BuilderContext;
  moveId: string;
  runtime?: BuilderRuntimeSnapshot;
  step?: BuilderPathStep;
  stepIndex?: number;
}) => attemptMk1Transition(input);

export const replayMk1BuilderPath = (input: {
  context: Mk1BuilderContext;
  path: BuilderMovePath;
  initialRuntime?: BuilderRuntimeSnapshot;
}): BuilderReplayResult => {
  const context = Mk1BuilderContextSchema.parse(input.context);
  const originalPath = BuilderMovePathSchema.parse(input.path);
  let runtime = input.initialRuntime ?? createMk1BuilderInitialRuntime(context);
  const acceptedTransitions: BuilderTransitionAccepted[] = [];
  const acceptedPath: BuilderPathStep[] = [];

  for (const [index, step] of originalPath.entries()) {
    const transition = attemptMk1Transition({
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
          gameId: "mk1",
          characterId: context.characterId,
          kameoId: context.kameoId,
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
      gameId: "mk1",
      characterId: context.characterId,
      kameoId: context.kameoId,
    },
  });
};
