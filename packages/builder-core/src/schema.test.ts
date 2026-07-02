import { BuilderGraphSchema } from "@mk-combos/builder-core/graph/schema";
import {
  BuilderReplayInvalidSchema,
  BuilderReplayValidSchema,
} from "@mk-combos/builder-core/replay/schema";
import { BuilderRuntimeSnapshotSchema } from "@mk-combos/builder-core/runtime/schema";
import {
  BuilderComboFreshStateSchema,
  BuilderComboInvalidStateSchema,
  BuilderComboStaleStateSchema,
} from "@mk-combos/builder-core/stale/schema";
import {
  BuilderFrameWindowSchema,
  BuilderTransitionAcceptedSchema,
  BuilderTransitionRejectedSchema,
} from "@mk-combos/builder-core/transition/schema";
import { describe, expect, it } from "vitest";

const reason = {
  severity: "error",
  message: "Move is unavailable.",
} as const;

const runtime = {
  values: {
    meter: 1,
  },
} as const;

const step = {
  id: "step-1",
  moveId: "move-1",
} as const;

describe("@mk-combos/builder-core schemas", () => {
  it("rejects unknown fields in structured graph primitives", () => {
    expect(
      BuilderGraphSchema.parse({
        nodes: [{ id: "start" }, { id: "after-move" }],
        edges: [
          {
            id: "edge-1",
            fromNodeId: "start",
            toNodeId: "after-move",
            moveId: "move-1",
          },
        ],
      }),
    ).toEqual({
      nodes: [{ id: "start" }, { id: "after-move" }],
      edges: [
        {
          id: "edge-1",
          fromNodeId: "start",
          toNodeId: "after-move",
          moveId: "move-1",
        },
      ],
    });
    expect(
      BuilderGraphSchema.safeParse({
        nodes: [{ id: "" }],
        edges: [],
      }).success,
    ).toBe(false);
    expect(
      BuilderGraphSchema.safeParse({
        nodes: [{ id: "start", gameSpecificRule: true }],
        edges: [],
      }).success,
    ).toBe(false);
  });

  it("keeps runtime snapshots opaque but strictly wrapped", () => {
    expect(BuilderRuntimeSnapshotSchema.parse(runtime)).toEqual(runtime);
    expect(
      BuilderRuntimeSnapshotSchema.safeParse({
        values: {
          meter: 1,
        },
        extra: true,
      }).success,
    ).toBe(false);
  });

  it("validates frame windows and transition results", () => {
    expect(
      BuilderFrameWindowSchema.parse({
        start: -2,
        end: 4,
        kind: "link",
      }),
    ).toEqual({
      start: -2,
      end: 4,
      kind: "link",
    });
    expect(BuilderFrameWindowSchema.safeParse({ start: 5, end: 4 }).success).toBe(false);

    const accepted = {
      ok: true,
      status: "accepted",
      candidate: {
        moveId: "move-1",
      },
      step,
      toRuntime: runtime,
    } as const;
    const rejected = {
      ok: false,
      status: "rejected",
      attemptedMoveId: "move-2",
      reason,
    } as const;

    expect(BuilderTransitionAcceptedSchema.parse(accepted)).toEqual(accepted);
    expect(BuilderTransitionRejectedSchema.parse(rejected)).toEqual(rejected);
    expect(
      BuilderTransitionAcceptedSchema.safeParse({
        ...accepted,
        unexpected: true,
      }).success,
    ).toBe(false);
  });

  it("validates replay and stale structures with preserved invalid tails", () => {
    const validReplay = {
      ok: true,
      status: "valid",
      originalPath: [step],
      acceptedPath: [step],
      finalRuntime: runtime,
      transitions: [
        {
          ok: true,
          status: "accepted",
          candidate: {
            moveId: "move-1",
          },
          step,
          toRuntime: runtime,
        },
      ],
    } as const;
    const invalidReplay = {
      ok: false,
      status: "invalid",
      originalPath: [step, { id: "step-2", moveId: "move-2" }],
      validPrefix: [step],
      invalidTail: [{ id: "step-2", moveId: "move-2" }],
      invalidBoundary: {
        index: 1,
        previousStepId: "step-1",
        attemptedStepId: "step-2",
      },
      reason,
    } as const;

    expect(BuilderReplayValidSchema.parse(validReplay)).toEqual(validReplay);
    expect(BuilderReplayInvalidSchema.parse(invalidReplay)).toEqual(invalidReplay);
    expect(
      BuilderComboFreshStateSchema.parse({
        ok: true,
        status: "fresh",
        currentPath: [step],
        replay: validReplay,
      }),
    ).toEqual({
      ok: true,
      status: "fresh",
      currentPath: [step],
      replay: validReplay,
    });
    expect(
      BuilderComboStaleStateSchema.parse({
        ok: false,
        status: "stale",
        originalPath: invalidReplay.originalPath,
        validPrefix: invalidReplay.validPrefix,
        invalidTail: invalidReplay.invalidTail,
        invalidBoundary: invalidReplay.invalidBoundary,
        reason,
        replay: invalidReplay,
      }),
    ).toEqual({
      ok: false,
      status: "stale",
      originalPath: invalidReplay.originalPath,
      validPrefix: invalidReplay.validPrefix,
      invalidTail: invalidReplay.invalidTail,
      invalidBoundary: invalidReplay.invalidBoundary,
      reason,
      replay: invalidReplay,
    });
    expect(
      BuilderComboInvalidStateSchema.safeParse({
        ok: false,
        status: "invalid",
        originalPath: invalidReplay.originalPath,
        validPrefix: invalidReplay.validPrefix,
        invalidTail: invalidReplay.invalidTail,
        invalidBoundary: invalidReplay.invalidBoundary,
        reason,
        repairedPath: invalidReplay.validPrefix,
      }).success,
    ).toBe(false);
  });
});
