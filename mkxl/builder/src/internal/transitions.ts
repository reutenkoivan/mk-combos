import type { BuilderPathStep } from "@mk-combos/builder-core/graph/type";
import type { BuilderRuntimeSnapshot } from "@mk-combos/builder-core/runtime/type";
import { acceptTransition, rejectTransition } from "@mk-combos/builder-core/transition/runtime";
import type {
  BuilderTransitionAccepted,
  BuilderTransitionCandidate,
  BuilderTransitionEffect,
  BuilderTransitionRejected,
  BuilderTransitionResult,
} from "@mk-combos/builder-core/transition/type";
import type { ValidationMessage } from "@mk-combos/contracts/result/type";
import type { MkxlInteractable } from "@mk-combos/mkxl-data/stages/type";

import { MkxlBuilderContextSchema } from "../context/schema";
import type { MkxlBuilderContext } from "../context/type";
import { MkxlBuilderMoveChoicesSchema } from "../graph/schema";
import type { MkxlBuilderMoveChoice, MkxlBuilderMoveChoices } from "../graph/type";
import {
  getMkxlFrameWindow,
  getMkxlInteractable,
  getMkxlMove,
  type MkxlBuilderContextResolution,
  type MkxlIndexedEdge,
  type MkxlRuntimeEdgeKind,
  resolveMkxlBuilderContext,
} from "./indexes";
import { createMkxlBuilderMessage } from "./messages";
import {
  createMkxlBuilderInitialRuntime,
  createMkxlBuilderRuntimeSnapshot,
  type MkxlBuilderRuntimeSnapshot,
  parseMkxlBuilderRuntimeSnapshot,
} from "./runtime-state";
import { createMkxlBuilderPathStepFromInput, mergeMkxlBuilderStep } from "./steps";

type ResolvedCandidate = {
  kind: MkxlRuntimeEdgeKind;
  candidate: BuilderTransitionCandidate;
  indexedEdge: MkxlIndexedEdge;
  nextActiveNodeIds: readonly string[];
  nextUsedInteractableIds: readonly string[];
  nextFrameAdvantage: number;
};

type AttemptResolution =
  | {
      ok: true;
      candidates: readonly ResolvedCandidate[];
    }
  | {
      ok: false;
      reason: ValidationMessage;
      edgeId?: string;
    };

const uniqueStrings = (values: readonly string[]): readonly string[] => {
  const seen = new Set<string>();
  const uniqueValues: string[] = [];

  for (const value of values) {
    if (seen.has(value)) {
      continue;
    }

    seen.add(value);
    uniqueValues.push(value);
  }

  return uniqueValues;
};

const getRuntime = (
  context: MkxlBuilderContext,
  runtime: BuilderRuntimeSnapshot | undefined,
): MkxlBuilderRuntimeSnapshot =>
  runtime
    ? parseMkxlBuilderRuntimeSnapshot(runtime)
    : parseMkxlBuilderRuntimeSnapshot(createMkxlBuilderInitialRuntime(context));

const frameWindowAllows = (
  candidate: BuilderTransitionCandidate,
  runtime: MkxlBuilderRuntimeSnapshot,
) =>
  !candidate.frameWindow ||
  (runtime.values.frameAdvantage >= candidate.frameWindow.start &&
    runtime.values.frameAdvantage <= candidate.frameWindow.end);

const labelFromCandidate = (moveId: string, fallback: string): string => {
  const move = getMkxlMove(moveId);
  const interactable = getMkxlInteractable(moveId);
  const label = move?.label ?? interactable?.label;

  return label?.EN ?? label?.UA ?? label?.default ?? label?.fallback ?? fallback;
};

const candidateFromEdge = (indexedEdge: MkxlIndexedEdge): BuilderTransitionCandidate => {
  const candidate: BuilderTransitionCandidate = {
    edgeId: indexedEdge.edge.id,
    fromNodeId: indexedEdge.edge.fromNodeId,
    toNodeId: indexedEdge.edge.toNodeId,
    moveId: indexedEdge.moveId,
    metadata: {
      graphId: indexedEdge.graphId,
      kind: indexedEdge.kind,
      sourceIds: indexedEdge.edge.sourceIds,
      tags: indexedEdge.edge.tags,
    },
  };
  const frameWindow = getMkxlFrameWindow(indexedEdge.edge);

  if (frameWindow !== undefined) {
    candidate.frameWindow = frameWindow;
  }

  return candidate;
};

const nextFrameAdvantage = (kind: MkxlRuntimeEdgeKind, moveId: string, current: number): number => {
  if (kind === "interactable") {
    return current;
  }

  return getMkxlMove(moveId)?.frameData?.hitAdvantage ?? 0;
};

const resolveMoveCandidates = (
  resolution: Extract<MkxlBuilderContextResolution, { ok: true }>,
  runtime: MkxlBuilderRuntimeSnapshot,
  moveId: string,
): AttemptResolution => {
  const edgeCandidates: ResolvedCandidate[] = [];
  const missedFrameEdges: MkxlIndexedEdge[] = [];

  for (const nodeId of runtime.values.activeNodeIds) {
    const edges = resolution.runtime.edgesByFromNodeId.get(nodeId) ?? [];

    for (const indexedEdge of edges) {
      if (indexedEdge.kind !== "move" || indexedEdge.moveId !== moveId) {
        continue;
      }

      const candidate = candidateFromEdge(indexedEdge);

      if (!frameWindowAllows(candidate, runtime)) {
        missedFrameEdges.push(indexedEdge);
        continue;
      }

      edgeCandidates.push({
        kind: "move",
        candidate,
        indexedEdge,
        nextActiveNodeIds: [indexedEdge.edge.toNodeId],
        nextUsedInteractableIds: runtime.values.usedInteractableIds,
        nextFrameAdvantage: nextFrameAdvantage("move", moveId, runtime.values.frameAdvantage),
      });
    }
  }

  if (edgeCandidates.length > 0) {
    return {
      ok: true,
      candidates: edgeCandidates,
    };
  }

  const missedFrameEdge = missedFrameEdges[0];

  if (missedFrameEdge) {
    return {
      ok: false,
      edgeId: missedFrameEdge.edge.id,
      reason: createMkxlBuilderMessage(
        "mkxl.builder.frame_window_missed",
        "Move is outside the current MKXL frame window.",
        ["frameAdvantage"],
      ),
    };
  }

  return {
    ok: false,
    reason: createMkxlBuilderMessage(
      "mkxl.builder.transition_unavailable",
      "Move is not available from the current MKXL builder state.",
      ["moveId"],
    ),
  };
};

const findStageInteractableEdge = (
  resolution: Extract<MkxlBuilderContextResolution, { ok: true }>,
  interactableId: string,
): MkxlIndexedEdge | undefined => {
  if (!resolution.stageFragment) {
    return undefined;
  }

  for (const edge of resolution.stageFragment.edges) {
    if (edge.interactableId !== interactableId) {
      continue;
    }

    return {
      kind: "interactable",
      graphId: resolution.stageFragment.id,
      edge,
      moveId: interactableId,
    };
  }

  return undefined;
};

const resolveInteractableCandidate = (
  resolution: Extract<MkxlBuilderContextResolution, { ok: true }>,
  runtime: MkxlBuilderRuntimeSnapshot,
  interactable: MkxlInteractable,
): AttemptResolution => {
  if (!resolution.stage || resolution.stage.id !== interactable.stageId) {
    return {
      ok: false,
      reason: createMkxlBuilderMessage(
        "mkxl.builder.interactable_unavailable",
        "Interactable is not available for the selected MKXL stage.",
        ["stageId"],
      ),
    };
  }

  if (interactable.usagePolicy === "disabled") {
    return {
      ok: false,
      reason: createMkxlBuilderMessage(
        "mkxl.builder.interactable_disabled",
        "Interactable is disabled for MKXL builder use.",
        ["moveId"],
      ),
    };
  }

  if (
    interactable.usagePolicy === "oncePerCombo" &&
    runtime.values.usedInteractableIds.includes(interactable.id)
  ) {
    return {
      ok: false,
      reason: createMkxlBuilderMessage(
        "mkxl.builder.interactable_reused",
        "Interactable can only be used once per MKXL combo.",
        ["moveId"],
      ),
    };
  }

  const indexedEdge = findStageInteractableEdge(resolution, interactable.id);

  if (!indexedEdge) {
    return {
      ok: false,
      reason: createMkxlBuilderMessage(
        "mkxl.builder.interactable_unavailable",
        "Interactable has no selected-stage graph transition.",
        ["moveId"],
      ),
    };
  }

  const usedInteractableIds = uniqueStrings([
    ...runtime.values.usedInteractableIds,
    interactable.id,
  ]);

  return {
    ok: true,
    candidates: [
      {
        kind: "interactable",
        candidate: candidateFromEdge(indexedEdge),
        indexedEdge,
        nextActiveNodeIds: runtime.values.activeNodeIds,
        nextUsedInteractableIds: usedInteractableIds,
        nextFrameAdvantage: runtime.values.frameAdvantage,
      },
    ],
  };
};

const resolveAttempt = (
  resolution: MkxlBuilderContextResolution,
  runtime: MkxlBuilderRuntimeSnapshot,
  moveId: string,
): AttemptResolution => {
  if (!resolution.ok) {
    return {
      ok: false,
      reason: resolution.reason,
    };
  }

  if (getMkxlMove(moveId)) {
    return resolveMoveCandidates(resolution, runtime, moveId);
  }

  const interactable = getMkxlInteractable(moveId);

  if (interactable) {
    return resolveInteractableCandidate(resolution, runtime, interactable);
  }

  return {
    ok: false,
    reason: createMkxlBuilderMessage(
      "mkxl.builder.unknown_move",
      "Move or interactable does not exist in MKXL data.",
      ["moveId"],
    ),
  };
};

const transitionEffects = (input: {
  activeNodeIds: readonly string[];
  usedInteractableIds: readonly string[];
  frameAdvantage: number;
}): readonly BuilderTransitionEffect[] => [
  {
    target: "activeNodeIds",
    operation: "replace",
    value: input.activeNodeIds,
  },
  {
    target: "usedInteractableIds",
    operation: "replace",
    value: input.usedInteractableIds,
  },
  {
    target: "frameAdvantage",
    operation: "set",
    value: input.frameAdvantage,
  },
];

const acceptResolvedCandidates = (input: {
  context: MkxlBuilderContext;
  runtime: MkxlBuilderRuntimeSnapshot;
  step?: BuilderPathStep;
  stepIndex: number;
  candidates: readonly ResolvedCandidate[];
}): BuilderTransitionAccepted => {
  const primaryCandidate = input.candidates[0];

  if (!primaryCandidate) {
    throw new Error("MKXL builder cannot accept an empty candidate set.");
  }

  const nextActiveNodeIds = uniqueStrings(
    input.candidates.flatMap((candidate) => candidate.nextActiveNodeIds),
  );
  const nextUsedInteractableIds = uniqueStrings(
    input.candidates.flatMap((candidate) => candidate.nextUsedInteractableIds),
  );
  const toRuntime = createMkxlBuilderRuntimeSnapshot({
    activeNodeIds: nextActiveNodeIds,
    usedInteractableIds: nextUsedInteractableIds,
    frameAdvantage: primaryCandidate.nextFrameAdvantage,
    metadata: {
      gameId: "mkxl",
      characterId: input.context.characterId,
      variationId: input.context.variationId,
      stageId: input.context.stageId,
    },
  });
  const fallbackStep = createMkxlBuilderPathStepFromInput({
    moveId: primaryCandidate.candidate.moveId,
    index: input.stepIndex,
    edgeId: primaryCandidate.candidate.edgeId,
    nodeId: primaryCandidate.candidate.toNodeId,
    label: labelFromCandidate(primaryCandidate.candidate.moveId, primaryCandidate.candidate.moveId),
  });

  return acceptTransition({
    candidate: {
      ...primaryCandidate.candidate,
      metadata: {
        ...primaryCandidate.candidate.metadata,
        candidateEdgeIds: input.candidates.map((candidate) => candidate.indexedEdge.edge.id),
        candidateCount: input.candidates.length,
      },
    },
    step: mergeMkxlBuilderStep(input.step, fallbackStep),
    fromRuntime: input.runtime,
    toRuntime,
    effects: transitionEffects({
      activeNodeIds: nextActiveNodeIds,
      usedInteractableIds: nextUsedInteractableIds,
      frameAdvantage: primaryCandidate.nextFrameAdvantage,
    }),
    metadata: {
      gameId: "mkxl",
      kind: primaryCandidate.kind,
      candidateEdgeIds: input.candidates.map((candidate) => candidate.indexedEdge.edge.id),
      candidateCount: input.candidates.length,
    },
  });
};

const rejectAttempt = (input: {
  moveId: string;
  runtime: MkxlBuilderRuntimeSnapshot;
  reason: ValidationMessage;
  edgeId?: string;
}): BuilderTransitionRejected =>
  rejectTransition({
    attemptedMoveId: input.moveId,
    edgeId: input.edgeId,
    fromRuntime: input.runtime,
    reason: input.reason,
  });

export const attemptMkxlTransition = (input: {
  context: MkxlBuilderContext;
  moveId: string;
  runtime?: BuilderRuntimeSnapshot;
  step?: BuilderPathStep;
  stepIndex?: number;
}): BuilderTransitionResult => {
  const context = MkxlBuilderContextSchema.parse(input.context);
  const runtime = getRuntime(context, input.runtime);
  const resolution = resolveMkxlBuilderContext(context);
  const attempt = resolveAttempt(resolution, runtime, input.moveId);

  if (!attempt.ok) {
    return rejectAttempt({
      moveId: input.moveId,
      runtime,
      reason: attempt.reason,
      edgeId: attempt.edgeId,
    });
  }

  return acceptResolvedCandidates({
    context,
    runtime,
    step: input.step,
    stepIndex: input.stepIndex ?? 0,
    candidates: attempt.candidates,
  });
};

const addChoiceCandidate = (
  choicesById: Map<string, MkxlBuilderMoveChoice>,
  candidate: ResolvedCandidate,
) => {
  const moveId = candidate.candidate.moveId;
  const existing = choicesById.get(moveId);

  if (existing) {
    choicesById.set(moveId, {
      ...existing,
      candidates: [...existing.candidates, candidate.candidate],
      metadata: {
        ...existing.metadata,
        candidateCount: existing.candidates.length + 1,
      },
    });
    return;
  }

  choicesById.set(moveId, {
    id: moveId,
    kind: candidate.kind,
    moveId,
    label: labelFromCandidate(moveId, moveId),
    candidates: [candidate.candidate],
    metadata: {
      kind: candidate.kind,
      candidateCount: 1,
    },
  });
};

const collectMoveChoices = (
  resolution: Extract<MkxlBuilderContextResolution, { ok: true }>,
  runtime: MkxlBuilderRuntimeSnapshot,
  choicesById: Map<string, MkxlBuilderMoveChoice>,
) => {
  for (const nodeId of runtime.values.activeNodeIds) {
    const edges = resolution.runtime.edgesByFromNodeId.get(nodeId) ?? [];

    for (const indexedEdge of edges) {
      if (indexedEdge.kind !== "move") {
        continue;
      }

      const candidate = candidateFromEdge(indexedEdge);

      if (!frameWindowAllows(candidate, runtime)) {
        continue;
      }

      addChoiceCandidate(choicesById, {
        kind: "move",
        candidate,
        indexedEdge,
        nextActiveNodeIds: [indexedEdge.edge.toNodeId],
        nextUsedInteractableIds: runtime.values.usedInteractableIds,
        nextFrameAdvantage: nextFrameAdvantage(
          "move",
          indexedEdge.moveId,
          runtime.values.frameAdvantage,
        ),
      });
    }
  }
};

const collectInteractableChoices = (
  resolution: Extract<MkxlBuilderContextResolution, { ok: true }>,
  runtime: MkxlBuilderRuntimeSnapshot,
  choicesById: Map<string, MkxlBuilderMoveChoice>,
) => {
  if (!resolution.stage) {
    return;
  }

  for (const interactable of resolution.stage.interactables) {
    const attempt = resolveInteractableCandidate(resolution, runtime, interactable);

    if (!attempt.ok) {
      continue;
    }

    for (const candidate of attempt.candidates) {
      addChoiceCandidate(choicesById, candidate);
    }
  }
};

export const getMkxlValidNextChoices = (input: {
  context: MkxlBuilderContext;
  runtime?: BuilderRuntimeSnapshot;
}): MkxlBuilderMoveChoices => {
  const context = MkxlBuilderContextSchema.parse(input.context);
  const runtime = getRuntime(context, input.runtime);
  const resolution = resolveMkxlBuilderContext(context);

  if (!resolution.ok) {
    return [];
  }

  const choicesById = new Map<string, MkxlBuilderMoveChoice>();

  collectMoveChoices(resolution, runtime, choicesById);
  collectInteractableChoices(resolution, runtime, choicesById);

  return MkxlBuilderMoveChoicesSchema.parse([...choicesById.values()]);
};
