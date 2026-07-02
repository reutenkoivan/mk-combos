import * as contractEntry from "@mk-combos/builder-core/contract";
import { builderCoreContractGroups, mkCombosBuilderCore } from "@mk-combos/builder-core/contract";
import { BuilderGraphSchema } from "@mk-combos/builder-core/graph/schema";
import type {
  BuilderGraph,
  BuilderGraphEdge,
  BuilderGraphEdgeId,
  BuilderGraphNode,
  BuilderGraphNodeId,
  BuilderMetadata,
  BuilderMoveId,
  BuilderMovePath,
  BuilderPathStep,
  BuilderPathStepId,
} from "@mk-combos/builder-core/graph/type";
import { createInvalidReplay, createValidReplay } from "@mk-combos/builder-core/replay/runtime";
import {
  BuilderReplayResultSchema,
  builderReplayStatuses as replaySchemaStatuses,
} from "@mk-combos/builder-core/replay/schema";
import type {
  BuilderInvalidBoundary,
  BuilderReplayResult,
  BuilderReplayStatus,
} from "@mk-combos/builder-core/replay/type";
import { builderReplayStatuses as replayTypeStatuses } from "@mk-combos/builder-core/replay/type";
import { builderReplayStatuses as replayRuntimeStatuses } from "@mk-combos/builder-core/replay/value";
import { BuilderRuntimeSnapshotSchema } from "@mk-combos/builder-core/runtime/schema";
import type {
  BuilderRuntimeSnapshot,
  BuilderRuntimeValues,
} from "@mk-combos/builder-core/runtime/type";
import {
  createFreshComboState,
  createInvalidComboState,
  createInvalidComboStateFromReplay,
  createStaleComboState,
  createStaleComboStateFromReplay,
} from "@mk-combos/builder-core/stale/runtime";
import {
  BuilderComboStateSchema,
  builderComboStateStatuses as staleSchemaStatuses,
} from "@mk-combos/builder-core/stale/schema";
import type {
  BuilderComboState,
  BuilderComboStateStatus,
} from "@mk-combos/builder-core/stale/type";
import { builderComboStateStatuses as staleTypeStatuses } from "@mk-combos/builder-core/stale/type";
import { builderComboStateStatuses as staleRuntimeStatuses } from "@mk-combos/builder-core/stale/value";
import { acceptTransition, rejectTransition } from "@mk-combos/builder-core/transition/runtime";
import {
  BuilderTransitionResultSchema,
  builderTransitionStatuses as transitionSchemaStatuses,
} from "@mk-combos/builder-core/transition/schema";
import type {
  BuilderFrameWindow,
  BuilderTransitionResult,
  BuilderTransitionStatus,
} from "@mk-combos/builder-core/transition/type";
import { builderTransitionStatuses as transitionTypeStatuses } from "@mk-combos/builder-core/transition/type";
import { builderTransitionStatuses as transitionRuntimeStatuses } from "@mk-combos/builder-core/transition/value";
import { describe, expect, it } from "vitest";

const startRuntime = {
  values: {
    frameAdvantage: 0,
    meter: 1,
  },
} satisfies BuilderRuntimeSnapshot;

const nextRuntime = {
  values: {
    frameAdvantage: 7,
    meter: 0,
  },
} satisfies BuilderRuntimeSnapshot;

const firstStep = {
  id: "step-1",
  moveId: "future-move-1",
  edgeId: "edge-1",
  nodeId: "node-2",
} as const;

const secondStep = {
  id: "step-2",
  moveId: "future-move-2",
  edgeId: "edge-2",
  nodeId: "node-3",
} as const;

const readableReason = {
  severity: "error",
  message: "The proposed transition is not available from this runtime state.",
  code: "builder.transition_unavailable",
} as const;

const acceptsPublicTypes = (_contract: {
  metadata: BuilderMetadata;
  nodeId: BuilderGraphNodeId;
  edgeId: BuilderGraphEdgeId;
  moveId: BuilderMoveId;
  stepId: BuilderPathStepId;
  node: BuilderGraphNode;
  edge: BuilderGraphEdge;
  step: BuilderPathStep;
  runtimeValues: BuilderRuntimeValues;
  transitionStatus: BuilderTransitionStatus;
  frameWindow: BuilderFrameWindow;
  replayStatus: BuilderReplayStatus;
  invalidBoundary: BuilderInvalidBoundary;
  comboStateStatus: BuilderComboStateStatus;
}) => true;

describe("@mk-combos/builder-core contract", () => {
  it("keeps the contract entrypoint limited to contract metadata", () => {
    expect(Object.keys(contractEntry).sort()).toEqual([
      "builderCoreContractGroups",
      "mkCombosBuilderCore",
    ]);
    expect(mkCombosBuilderCore.packageName).toBe("@mk-combos/builder-core");
    expect(mkCombosBuilderCore.groups).toBe(builderCoreContractGroups);
    expect(builderCoreContractGroups.graph).toEqual({
      schema: "@mk-combos/builder-core/graph/schema",
      type: "@mk-combos/builder-core/graph/type",
    });
    expect(builderCoreContractGroups.runtime).toEqual({
      schema: "@mk-combos/builder-core/runtime/schema",
      type: "@mk-combos/builder-core/runtime/type",
    });
    expect(builderCoreContractGroups.transition).toEqual({
      runtime: "@mk-combos/builder-core/transition/runtime",
      schema: "@mk-combos/builder-core/transition/schema",
      type: "@mk-combos/builder-core/transition/type",
      value: "@mk-combos/builder-core/transition/value",
    });
    expect(builderCoreContractGroups.replay).toEqual({
      runtime: "@mk-combos/builder-core/replay/runtime",
      schema: "@mk-combos/builder-core/replay/schema",
      type: "@mk-combos/builder-core/replay/type",
      value: "@mk-combos/builder-core/replay/value",
    });
    expect(builderCoreContractGroups.stale).toEqual({
      runtime: "@mk-combos/builder-core/stale/runtime",
      schema: "@mk-combos/builder-core/stale/schema",
      type: "@mk-combos/builder-core/stale/type",
      value: "@mk-combos/builder-core/stale/value",
    });
  });

  it("keeps public value-set re-exports intentional", () => {
    expect(transitionRuntimeStatuses).toEqual(["accepted", "rejected"]);
    expect(transitionSchemaStatuses).toBe(transitionRuntimeStatuses);
    expect(transitionTypeStatuses).toBe(transitionRuntimeStatuses);
    expect(replayRuntimeStatuses).toEqual(["valid", "invalid"]);
    expect(replaySchemaStatuses).toBe(replayRuntimeStatuses);
    expect(replayTypeStatuses).toBe(replayRuntimeStatuses);
    expect(staleRuntimeStatuses).toEqual(["fresh", "stale", "invalid"]);
    expect(staleSchemaStatuses).toBe(staleRuntimeStatuses);
    expect(staleTypeStatuses).toBe(staleRuntimeStatuses);
    expect(mkCombosBuilderCore.valueSets.builderTransitionStatuses).toBe(transitionRuntimeStatuses);
    expect(mkCombosBuilderCore.valueSets.builderReplayStatuses).toBe(replayRuntimeStatuses);
    expect(mkCombosBuilderCore.valueSets.builderComboStateStatuses).toBe(staleRuntimeStatuses);
  });

  it("keeps graph and runtime primitives open and game agnostic", () => {
    const firstNode = { id: "future-game:start", kind: "start" } satisfies BuilderGraphNode;
    const secondNode = {
      id: "future-game:after-first-hit",
      kind: "runtime-state",
    } satisfies BuilderGraphNode;
    const firstEdge = {
      id: "future-game:edge-1",
      fromNodeId: "future-game:start",
      toNodeId: "future-game:after-first-hit",
      moveId: "future-game:starter",
    } satisfies BuilderGraphEdge;
    const graph = {
      nodes: [firstNode, secondNode],
      edges: [firstEdge],
      startNodeId: "future-game:start",
    } satisfies BuilderGraph;

    expect(BuilderGraphSchema.parse(graph)).toEqual(graph);
    expect(BuilderRuntimeSnapshotSchema.parse(startRuntime)).toEqual(startRuntime);
    expect(
      acceptsPublicTypes({
        metadata: { source: "unit-test" },
        nodeId: "node-1",
        edgeId: "edge-1",
        moveId: "move-1",
        stepId: "step-1",
        node: firstNode,
        edge: firstEdge,
        step: firstStep,
        runtimeValues: startRuntime.values,
        transitionStatus: "accepted",
        frameWindow: { start: 0, end: 1 },
        replayStatus: "valid",
        invalidBoundary: { index: 0 },
        comboStateStatus: "fresh",
      }),
    ).toBe(true);
  });

  it("creates transition helper results with stable discriminants", () => {
    const accepted = acceptTransition({
      candidate: {
        edgeId: "edge-1",
        fromNodeId: "node-1",
        toNodeId: "node-2",
        moveId: firstStep.moveId,
        frameWindow: {
          start: 3,
          end: 8,
        },
      },
      step: firstStep,
      fromRuntime: startRuntime,
      toRuntime: nextRuntime,
      effects: [
        {
          target: "meter",
          operation: "spend",
          value: 1,
        },
      ],
    });
    const rejected = rejectTransition({
      attemptedMoveId: secondStep.moveId,
      edgeId: secondStep.edgeId,
      fromRuntime: nextRuntime,
      reason: readableReason,
    });

    expect(BuilderTransitionResultSchema.parse(accepted)).toEqual(accepted);
    expect(BuilderTransitionResultSchema.parse(rejected)).toEqual(rejected);
    expect((accepted satisfies BuilderTransitionResult).status).toBe("accepted");
    expect((rejected satisfies BuilderTransitionResult).status).toBe("rejected");
  });

  it("creates replay and combo state helper results without truncating source paths", () => {
    const accepted = acceptTransition({
      candidate: {
        edgeId: firstStep.edgeId,
        moveId: firstStep.moveId,
      },
      step: firstStep,
      toRuntime: nextRuntime,
    });
    const originalPath = [firstStep, secondStep] satisfies BuilderMovePath;
    const validReplay = createValidReplay({
      originalPath: [firstStep],
      finalRuntime: nextRuntime,
      transitions: [accepted],
    });
    const rejected = rejectTransition({
      attemptedMoveId: secondStep.moveId,
      edgeId: secondStep.edgeId,
      reason: readableReason,
    });
    const invalidReplay = createInvalidReplay({
      originalPath,
      validPrefix: [firstStep],
      invalidTail: [secondStep],
      invalidBoundary: {
        index: 1,
        previousStepId: firstStep.id,
        attemptedStepId: secondStep.id,
      },
      reason: readableReason,
      rejectedTransition: rejected,
    });
    const freshState = createFreshComboState({
      currentPath: [firstStep],
      replay: validReplay,
    });
    const directStaleState = createStaleComboState({
      originalPath,
      validPrefix: [firstStep],
      invalidTail: [secondStep],
      invalidBoundary: {
        index: 1,
        previousStepId: firstStep.id,
        attemptedStepId: secondStep.id,
      },
      reason: readableReason,
      replay: invalidReplay,
    });
    const directInvalidState = createInvalidComboState({
      originalPath,
      validPrefix: [firstStep],
      invalidTail: [secondStep],
      invalidBoundary: {
        index: 1,
        previousStepId: firstStep.id,
        attemptedStepId: secondStep.id,
      },
      reason: readableReason,
      replay: invalidReplay,
    });
    const staleState = createStaleComboStateFromReplay(invalidReplay);
    const invalidState = createInvalidComboStateFromReplay(invalidReplay);

    expect(BuilderReplayResultSchema.parse(validReplay)).toEqual(validReplay);
    expect(BuilderReplayResultSchema.parse(invalidReplay)).toEqual(invalidReplay);
    expect(BuilderComboStateSchema.parse(freshState)).toEqual(freshState);
    expect(BuilderComboStateSchema.parse(directStaleState)).toEqual(directStaleState);
    expect(BuilderComboStateSchema.parse(directInvalidState)).toEqual(directInvalidState);
    expect(BuilderComboStateSchema.parse(staleState)).toEqual(staleState);
    expect(BuilderComboStateSchema.parse(invalidState)).toEqual(invalidState);
    expect((invalidReplay satisfies BuilderReplayResult).originalPath).toEqual(originalPath);
    expect((staleState satisfies BuilderComboState).originalPath).toEqual(originalPath);
    expect(invalidState.invalidTail).toEqual([secondStep]);
  });
});
