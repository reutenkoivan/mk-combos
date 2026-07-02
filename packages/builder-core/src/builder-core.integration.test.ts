import { BuilderGraphSchema } from "@mk-combos/builder-core/graph/schema";
import type { BuilderMovePath } from "@mk-combos/builder-core/graph/type";
import { createInvalidReplay, createValidReplay } from "@mk-combos/builder-core/replay/runtime";
import { BuilderReplayResultSchema } from "@mk-combos/builder-core/replay/schema";
import {
  createInvalidComboStateFromReplay,
  createStaleComboStateFromReplay,
} from "@mk-combos/builder-core/stale/runtime";
import { BuilderComboStateSchema } from "@mk-combos/builder-core/stale/schema";
import { acceptTransition, rejectTransition } from "@mk-combos/builder-core/transition/runtime";
import { BuilderTransitionResultSchema } from "@mk-combos/builder-core/transition/schema";
import { describe, expect, it } from "vitest";

const reason = {
  severity: "error",
  message: "The second fake move is not valid after the first fake move.",
  code: "fake-builder.invalid-transition",
} as const;

describe("@mk-combos/builder-core integration", () => {
  it("connects graph parsing, transition helpers, and valid replay output", () => {
    const graph = BuilderGraphSchema.parse({
      nodes: [{ id: "start" }, { id: "after-launcher" }],
      edges: [
        {
          id: "edge-launcher",
          fromNodeId: "start",
          toNodeId: "after-launcher",
          moveId: "launcher",
        },
      ],
      startNodeId: "start",
      metadata: {
        graphVersion: "fake-v1",
      },
    });
    const accepted = acceptTransition({
      candidate: {
        edgeId: graph.edges[0]?.id,
        fromNodeId: graph.edges[0]?.fromNodeId,
        toNodeId: graph.edges[0]?.toNodeId,
        moveId: "launcher",
        frameWindow: {
          start: 0,
          end: 6,
        },
        effects: [
          {
            target: "juggle",
            operation: "set",
            value: true,
          },
        ],
      },
      step: {
        id: "step-launcher",
        moveId: "launcher",
        edgeId: "edge-launcher",
        nodeId: "after-launcher",
      },
      fromRuntime: {
        values: {
          juggle: false,
          meter: 1,
        },
      },
      toRuntime: {
        values: {
          juggle: true,
          meter: 1,
        },
      },
    });
    const replay = createValidReplay({
      originalPath: [accepted.step],
      finalRuntime: accepted.toRuntime,
      transitions: [accepted],
      metadata: {
        graphVersion: graph.metadata?.graphVersion,
      },
    });

    expect(BuilderTransitionResultSchema.parse(accepted)).toEqual(accepted);
    expect(BuilderReplayResultSchema.parse(replay)).toEqual(replay);
    expect(replay.acceptedPath).toEqual([accepted.step]);
    expect(replay.finalRuntime.values.juggle).toBe(true);
  });

  it("preserves original path, valid prefix, invalid tail, and boundary for invalid replay", () => {
    const firstStep = {
      id: "step-launcher",
      moveId: "launcher",
      edgeId: "edge-launcher",
      nodeId: "after-launcher",
    } as const;
    const invalidStep = {
      id: "step-impossible",
      moveId: "impossible-follow-up",
      edgeId: "edge-impossible",
      nodeId: "after-impossible",
    } as const;
    const originalPath = [firstStep, invalidStep] satisfies BuilderMovePath;
    const accepted = acceptTransition({
      candidate: {
        edgeId: "edge-launcher",
        moveId: "launcher",
      },
      step: firstStep,
      toRuntime: {
        values: {
          juggle: true,
        },
      },
    });
    const rejected = rejectTransition({
      attemptedMoveId: invalidStep.moveId,
      edgeId: invalidStep.edgeId,
      fromRuntime: accepted.toRuntime,
      reason,
    });
    const replay = createInvalidReplay({
      originalPath,
      validPrefix: [firstStep],
      invalidTail: [invalidStep],
      invalidBoundary: {
        index: 1,
        previousStepId: firstStep.id,
        attemptedStepId: invalidStep.id,
      },
      reason,
      lastRuntime: accepted.toRuntime,
      acceptedTransitions: [accepted],
      rejectedTransition: rejected,
    });

    expect(BuilderReplayResultSchema.parse(replay)).toEqual(replay);
    expect(replay.originalPath).toEqual(originalPath);
    expect(replay.validPrefix).toEqual([firstStep]);
    expect(replay.invalidTail).toEqual([invalidStep]);
    expect(replay.invalidBoundary).toEqual({
      index: 1,
      previousStepId: firstStep.id,
      attemptedStepId: invalidStep.id,
    });
    expect(replay.reason.message).toContain("not valid");
  });

  it("converts invalid replay into stale and invalid combo states without truncating user data", () => {
    const validStep = {
      id: "step-launcher",
      moveId: "launcher",
    } as const;
    const invalidStep = {
      id: "step-stale",
      moveId: "stale-follow-up",
    } as const;
    const replay = createInvalidReplay({
      originalPath: [validStep, invalidStep],
      validPrefix: [validStep],
      invalidTail: [invalidStep],
      invalidBoundary: {
        index: 1,
        previousStepId: validStep.id,
        attemptedStepId: invalidStep.id,
      },
      reason,
    });
    const staleState = createStaleComboStateFromReplay(replay, {
      source: "graph-update",
    });
    const invalidState = createInvalidComboStateFromReplay(replay, {
      source: "manual-import",
    });

    expect(BuilderComboStateSchema.parse(staleState)).toEqual(staleState);
    expect(BuilderComboStateSchema.parse(invalidState)).toEqual(invalidState);
    expect(staleState.originalPath).toEqual([validStep, invalidStep]);
    expect(staleState.validPrefix).toEqual([validStep]);
    expect(staleState.invalidTail).toEqual([invalidStep]);
    expect(invalidState.originalPath).toEqual([validStep, invalidStep]);
    expect(invalidState.validPrefix).toEqual([validStep]);
    expect(invalidState.invalidTail).toEqual([invalidStep]);
  });
});
