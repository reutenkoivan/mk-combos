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

import { Mk1BuilderContextSchema } from "../context/schema";
import type { Mk1BuilderContext } from "../context/type";
import { Mk1BuilderMoveChoicesSchema } from "../graph/schema";
import type { Mk1BuilderMoveChoice, Mk1BuilderMoveChoices } from "../graph/type";
import {
  getMk1Move,
  type Mk1BuilderContextResolution,
  type Mk1IndexedEdge,
  type Mk1RuntimeEdgeKind,
  resolveMk1BuilderContext,
} from "./indexes";
import { createMk1BuilderMessage } from "./messages";
import {
  createMk1BuilderInitialRuntime,
  createMk1BuilderRuntimeSnapshot,
  type Mk1BuilderRuntimeSnapshot,
  parseMk1BuilderRuntimeSnapshot,
} from "./runtime-state";
import { createMk1BuilderPathStepFromInput, mergeMk1BuilderStep } from "./steps";

type ResolvedCandidate = {
  kind: Mk1RuntimeEdgeKind;
  candidate: BuilderTransitionCandidate;
  indexedEdge: Mk1IndexedEdge;
  nextActiveNodeIds: readonly string[];
  nextUsedKameoMoveIds: readonly string[];
  nextFrameAdvantage: number;
  nextKameoResource: number;
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

const uniqueStrings = (values: readonly string[]): readonly string[] => [...new Set(values)];

const getRuntime = (
  context: Mk1BuilderContext,
  runtime: BuilderRuntimeSnapshot | undefined,
): Mk1BuilderRuntimeSnapshot =>
  runtime
    ? parseMk1BuilderRuntimeSnapshot(runtime)
    : parseMk1BuilderRuntimeSnapshot(createMk1BuilderInitialRuntime(context));

const labelFromMove = (moveId: string, fallback: string): string => {
  const label = getMk1Move(moveId)?.label;

  return label?.EN ?? label?.UA ?? label?.default ?? label?.fallback ?? fallback;
};

const candidateFromEdge = (indexedEdge: Mk1IndexedEdge): BuilderTransitionCandidate => ({
  edgeId: indexedEdge.edge.id,
  fromNodeId: indexedEdge.edge.fromNodeId,
  toNodeId: indexedEdge.edge.toNodeId,
  moveId: indexedEdge.moveId,
  metadata: {
    graphId: indexedEdge.graphId,
    kind: indexedEdge.kind,
    sourceIds: indexedEdge.edge.sourceIds,
    tags: indexedEdge.edge.tags,
    kameoCost: indexedEdge.edge.kameoCost,
  },
});

const nextFrameAdvantage = (moveId: string): number =>
  getMk1Move(moveId)?.frameData?.hitAdvantage ?? 0;

const resolveMoveCandidates = (
  resolution: Extract<Mk1BuilderContextResolution, { ok: true }>,
  runtime: Mk1BuilderRuntimeSnapshot,
  moveId: string,
): AttemptResolution => {
  const edgeCandidates: ResolvedCandidate[] = [];

  for (const nodeId of runtime.values.activeNodeIds) {
    const edges = resolution.runtime.edgesByFromNodeId.get(nodeId) ?? [];

    for (const indexedEdge of edges) {
      if (indexedEdge.moveId !== moveId) {
        continue;
      }

      const move = getMk1Move(moveId);

      if (!move) {
        continue;
      }

      if (
        indexedEdge.kind === "kameo" &&
        move.availability.kind === "kameo" &&
        !move.availability.kameoIds.includes(resolution.context.kameoId)
      ) {
        continue;
      }

      const kameoCost = indexedEdge.edge.kameoCost ?? 0;

      if (indexedEdge.kind === "kameo" && runtime.values.usedKameoMoveIds.includes(moveId)) {
        return {
          ok: false,
          edgeId: indexedEdge.edge.id,
          reason: createMk1BuilderMessage(
            "mk1.builder.kameo_reused",
            "MK1 kameo assist is already used in this combo runtime.",
            ["moveId"],
          ),
        };
      }
      if (runtime.values.kameoResource < kameoCost) {
        return {
          ok: false,
          edgeId: indexedEdge.edge.id,
          reason: createMk1BuilderMessage(
            "mk1.builder.kameo_resource_missing",
            "MK1 kameo assist requires unavailable kameo resource.",
            ["kameoResource"],
          ),
        };
      }

      edgeCandidates.push({
        kind: indexedEdge.kind,
        candidate: candidateFromEdge(indexedEdge),
        indexedEdge,
        nextActiveNodeIds: [indexedEdge.edge.toNodeId],
        nextUsedKameoMoveIds:
          indexedEdge.kind === "kameo"
            ? uniqueStrings([...runtime.values.usedKameoMoveIds, moveId])
            : runtime.values.usedKameoMoveIds,
        nextFrameAdvantage: nextFrameAdvantage(moveId),
        nextKameoResource: runtime.values.kameoResource - kameoCost,
      });
    }
  }

  if (edgeCandidates.length > 0) {
    return {
      ok: true,
      candidates: edgeCandidates,
    };
  }

  return {
    ok: false,
    reason: createMk1BuilderMessage(
      getMk1Move(moveId) ? "mk1.builder.transition_unavailable" : "mk1.builder.unknown_move",
      getMk1Move(moveId)
        ? "Move is not available from the current MK1 builder state."
        : "Move does not exist in MK1 data.",
      ["moveId"],
    ),
  };
};

const resolveAttempt = (
  resolution: Mk1BuilderContextResolution,
  runtime: Mk1BuilderRuntimeSnapshot,
  moveId: string,
): AttemptResolution => {
  if (!resolution.ok) {
    return {
      ok: false,
      reason: resolution.reason,
    };
  }

  return resolveMoveCandidates(resolution, runtime, moveId);
};

const transitionEffects = (input: {
  activeNodeIds: readonly string[];
  usedKameoMoveIds: readonly string[];
  frameAdvantage: number;
  kameoResource: number;
}): readonly BuilderTransitionEffect[] => [
  {
    target: "activeNodeIds",
    operation: "replace",
    value: input.activeNodeIds,
  },
  {
    target: "usedKameoMoveIds",
    operation: "replace",
    value: input.usedKameoMoveIds,
  },
  {
    target: "frameAdvantage",
    operation: "set",
    value: input.frameAdvantage,
  },
  {
    target: "kameoResource",
    operation: "set",
    value: input.kameoResource,
  },
];

const acceptResolvedCandidates = (input: {
  context: Mk1BuilderContext;
  runtime: Mk1BuilderRuntimeSnapshot;
  step?: BuilderPathStep;
  stepIndex: number;
  candidates: readonly ResolvedCandidate[];
}): BuilderTransitionAccepted => {
  const primaryCandidate = input.candidates[0];

  if (!primaryCandidate) {
    throw new Error("MK1 builder cannot accept an empty candidate set.");
  }

  const nextActiveNodeIds = uniqueStrings(
    input.candidates.flatMap((candidate) => candidate.nextActiveNodeIds),
  );
  const nextUsedKameoMoveIds = uniqueStrings(
    input.candidates.flatMap((candidate) => candidate.nextUsedKameoMoveIds),
  );
  const toRuntime = createMk1BuilderRuntimeSnapshot({
    activeNodeIds: nextActiveNodeIds,
    usedKameoMoveIds: nextUsedKameoMoveIds,
    frameAdvantage: primaryCandidate.nextFrameAdvantage,
    kameoResource: primaryCandidate.nextKameoResource,
    metadata: {
      gameId: "mk1",
      characterId: input.context.characterId,
      kameoId: input.context.kameoId,
    },
  });
  const fallbackStep = createMk1BuilderPathStepFromInput({
    moveId: primaryCandidate.candidate.moveId,
    index: input.stepIndex,
    edgeId: primaryCandidate.candidate.edgeId,
    nodeId: primaryCandidate.candidate.toNodeId,
    label: labelFromMove(primaryCandidate.candidate.moveId, primaryCandidate.candidate.moveId),
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
    step: mergeMk1BuilderStep(input.step, fallbackStep),
    fromRuntime: input.runtime,
    toRuntime,
    effects: transitionEffects({
      activeNodeIds: nextActiveNodeIds,
      usedKameoMoveIds: nextUsedKameoMoveIds,
      frameAdvantage: primaryCandidate.nextFrameAdvantage,
      kameoResource: primaryCandidate.nextKameoResource,
    }),
    metadata: {
      gameId: "mk1",
      kind: primaryCandidate.kind,
      candidateCount: input.candidates.length,
    },
  });
};

const rejectAttempt = (input: {
  moveId: string;
  runtime: Mk1BuilderRuntimeSnapshot;
  reason: ValidationMessage;
  edgeId?: string;
}): BuilderTransitionRejected =>
  rejectTransition({
    attemptedMoveId: input.moveId,
    edgeId: input.edgeId,
    fromRuntime: input.runtime,
    reason: input.reason,
  });

export const attemptMk1Transition = (input: {
  context: Mk1BuilderContext;
  moveId: string;
  runtime?: BuilderRuntimeSnapshot;
  step?: BuilderPathStep;
  stepIndex?: number;
}): BuilderTransitionResult => {
  const context = Mk1BuilderContextSchema.parse(input.context);
  const runtime = getRuntime(context, input.runtime);
  const resolution = resolveMk1BuilderContext(context);
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
  choicesById: Map<string, Mk1BuilderMoveChoice>,
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
    label: labelFromMove(moveId, moveId),
    candidates: [candidate.candidate],
    metadata: {
      kind: candidate.kind,
      candidateCount: 1,
    },
  });
};

export const getMk1ValidNextChoices = (input: {
  context: Mk1BuilderContext;
  runtime?: BuilderRuntimeSnapshot;
}): Mk1BuilderMoveChoices => {
  const context = Mk1BuilderContextSchema.parse(input.context);
  const runtime = getRuntime(context, input.runtime);
  const resolution = resolveMk1BuilderContext(context);

  if (!resolution.ok) {
    return [];
  }

  const choicesById = new Map<string, Mk1BuilderMoveChoice>();

  for (const nodeId of runtime.values.activeNodeIds) {
    const edges = resolution.runtime.edgesByFromNodeId.get(nodeId) ?? [];

    for (const indexedEdge of edges) {
      const attempt = resolveMoveCandidates(resolution, runtime, indexedEdge.moveId);

      if (!attempt.ok) {
        continue;
      }
      for (const candidate of attempt.candidates) {
        addChoiceCandidate(choicesById, candidate);
      }
    }
  }

  return Mk1BuilderMoveChoicesSchema.parse([...choicesById.values()]);
};
