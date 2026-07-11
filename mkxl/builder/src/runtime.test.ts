import { BuilderReplayResultSchema } from "@mk-combos/builder-core/replay/schema";
import type { BuilderRuntimeSnapshot } from "@mk-combos/builder-core/runtime/type";
import { BuilderComboStateSchema } from "@mk-combos/builder-core/stale/schema";
import { BuilderTransitionResultSchema } from "@mk-combos/builder-core/transition/schema";
import {
  composeMkxlBuilderGraph,
  getMkxlBuilderValidNextMoves,
} from "@mk-combos/mkxl-builder/graph/runtime";
import {
  attemptMkxlBuilderTransition,
  createMkxlBuilderMovePath,
  replayMkxlBuilderPath,
} from "@mk-combos/mkxl-builder/replay/runtime";
import {
  createMkxlBuilderInitialRuntime,
  getMkxlBuilderComboState,
  parseMkxlBuilderRuntimeSnapshot,
} from "@mk-combos/mkxl-builder/state/runtime";
import { mkxlSeededCombos } from "@mk-combos/mkxl-data/combos/value";
import { mkxlStages } from "@mk-combos/mkxl-data/stages/value";
import { describe, expect, it } from "vitest";

const scorpionNinjutsuContext = {
  characterId: "scorpion",
  variationId: "scorpion:ninjutsu",
} as const;

const stageContext = {
  ...scorpionNinjutsuContext,
  stageId: "crossroads",
} as const;

const expectPresent = <T>(value: T | undefined, label: string): T => {
  expect(value, label).toBeDefined();
  if (!value) {
    throw new Error(`${label} should be present.`);
  }

  return value;
};

const scorpionNinjutsuCombos = mkxlSeededCombos.filter(
  (combo) =>
    combo.characterId === scorpionNinjutsuContext.characterId &&
    combo.variationId === scorpionNinjutsuContext.variationId,
);

const uniqueFirstMoveIds = (): readonly string[] => {
  const ids: string[] = [];
  const seen = new Set<string>();

  for (const combo of scorpionNinjutsuCombos) {
    const firstMoveId = combo.movePath[0];

    if (!firstMoveId || seen.has(firstMoveId)) {
      continue;
    }

    seen.add(firstMoveId);
    ids.push(firstMoveId);
  }

  return ids;
};

const duplicatedStarterMoveId = (): string => {
  const counts = new Map<string, number>();

  for (const combo of scorpionNinjutsuCombos) {
    const firstMoveId = combo.movePath[0];

    if (!firstMoveId) {
      continue;
    }

    counts.set(firstMoveId, (counts.get(firstMoveId) ?? 0) + 1);
  }

  for (const [moveId, count] of counts) {
    if (count > 1) {
      return moveId;
    }
  }

  throw new Error("Scorpion Ninjutsu should have a duplicated starter move.");
};

describe("@mk-combos/mkxl-builder runtime", () => {
  it("composes Scorpion Ninjutsu graph and exposes multiple valid starters", () => {
    const graph = composeMkxlBuilderGraph(scorpionNinjutsuContext);
    const choices = getMkxlBuilderValidNextMoves({
      context: scorpionNinjutsuContext,
    });
    const expectedStarterIds = uniqueFirstMoveIds();

    expect(graph.nodes.length).toBeGreaterThan(0);
    expect(graph.edges.length).toBeGreaterThan(0);
    expect(choices.length).toBeGreaterThan(1);
    expect(choices.map((choice) => choice.moveId)).toEqual(
      expect.arrayContaining(expectedStarterIds.slice(0, 2)),
    );
  });

  it("preserves branch candidates for shared starter prefixes", () => {
    const starterMoveId = duplicatedStarterMoveId();
    const choices = getMkxlBuilderValidNextMoves({
      context: scorpionNinjutsuContext,
    });
    const starterChoice = expectPresent(
      choices.find((choice) => choice.moveId === starterMoveId),
      "duplicated starter choice",
    );

    expect(starterChoice.candidates.length).toBeGreaterThan(1);
    expect(starterChoice.metadata).toMatchObject({
      candidateCount: starterChoice.candidates.length,
    });
  });

  it("replays a seeded combo path as valid", () => {
    const combo = expectPresent(scorpionNinjutsuCombos[0], "Scorpion Ninjutsu combo");
    const path = createMkxlBuilderMovePath(combo.movePath);
    const replay = replayMkxlBuilderPath({
      context: scorpionNinjutsuContext,
      path,
    });

    expect(BuilderReplayResultSchema.parse(replay)).toEqual(replay);
    expect(replay.status).toBe("valid");
    if (!replay.ok) {
      throw new Error("Replay should be valid.");
    }
    expect(replay.originalPath).toEqual(path);
    expect(replay.acceptedPath.map((step) => step.moveId)).toEqual(combo.movePath);
  });

  it("rejects impossible follow-ups with prefix, tail, and boundary", () => {
    const combo = expectPresent(scorpionNinjutsuCombos[0], "Scorpion Ninjutsu combo");
    const firstMoveId = expectPresent(combo.movePath[0], "first combo move");
    const invalidPath = createMkxlBuilderMovePath([firstMoveId, "general:run"]);
    const replay = replayMkxlBuilderPath({
      context: scorpionNinjutsuContext,
      path: invalidPath,
    });

    expect(replay.status).toBe("invalid");
    if (replay.status !== "invalid") {
      throw new Error("Replay should be invalid.");
    }
    expect(replay.validPrefix.map((step) => step.moveId)).toEqual([firstMoveId]);
    expect(replay.invalidTail).toEqual([invalidPath[1]]);
    expect(replay.invalidBoundary).toEqual({
      index: 1,
      previousStepId: invalidPath[0]?.id,
      attemptedStepId: invalidPath[1]?.id,
    });
    expect(replay.reason.code).toBe("mkxl.builder.transition_unavailable");
  });

  it("enforces frame-window misses", () => {
    const combo = expectPresent(
      scorpionNinjutsuCombos.find((entry) => entry.movePath.length > 1),
      "multi-step Scorpion Ninjutsu combo",
    );
    const firstMoveId = expectPresent(combo.movePath[0], "first combo move");
    const secondMoveId = expectPresent(combo.movePath[1], "second combo move");
    const firstTransition = attemptMkxlBuilderTransition({
      context: scorpionNinjutsuContext,
      moveId: firstMoveId,
    });

    expect(firstTransition.status).toBe("accepted");
    if (!firstTransition.ok) {
      throw new Error("First transition should be accepted.");
    }

    const runtime = parseMkxlBuilderRuntimeSnapshot(firstTransition.toRuntime);
    const missedRuntime = {
      values: {
        activeNodeIds: runtime.values.activeNodeIds,
        usedInteractableIds: runtime.values.usedInteractableIds,
        frameAdvantage: 99,
      },
      metadata: runtime.metadata,
    } satisfies BuilderRuntimeSnapshot;
    const missedTransition = attemptMkxlBuilderTransition({
      context: scorpionNinjutsuContext,
      runtime: missedRuntime,
      moveId: secondMoveId,
    });

    expect(BuilderTransitionResultSchema.parse(missedTransition)).toEqual(missedTransition);
    expect(missedTransition.status).toBe("rejected");
    if (missedTransition.status !== "rejected") {
      throw new Error("Missed transition should be rejected.");
    }
    expect(missedTransition.reason.code).toBe("mkxl.builder.frame_window_missed");
  });

  it("applies stage interactable usage policies", () => {
    const initialRuntime = createMkxlBuilderInitialRuntime(stageContext);
    const stageChoices = getMkxlBuilderValidNextMoves({
      context: stageContext,
      runtime: initialRuntime,
    });

    expect(stageChoices.map((choice) => choice.moveId)).toEqual(
      expect.arrayContaining(["crossroads:position-escape", "crossroads:corner-attack"]),
    );

    const firstReusable = attemptMkxlBuilderTransition({
      context: stageContext,
      runtime: initialRuntime,
      moveId: "crossroads:position-escape",
    });

    expect(firstReusable.status).toBe("accepted");
    if (!firstReusable.ok) {
      throw new Error("Reusable interactable should be accepted.");
    }

    const secondReusable = attemptMkxlBuilderTransition({
      context: stageContext,
      runtime: firstReusable.toRuntime,
      moveId: "crossroads:position-escape",
    });

    expect(secondReusable.status).toBe("accepted");

    const firstOnce = attemptMkxlBuilderTransition({
      context: stageContext,
      runtime: initialRuntime,
      moveId: "crossroads:corner-attack",
    });

    expect(firstOnce.status).toBe("accepted");
    if (!firstOnce.ok) {
      throw new Error("Once-per-combo interactable should be accepted once.");
    }

    const secondOnce = attemptMkxlBuilderTransition({
      context: stageContext,
      runtime: firstOnce.toRuntime,
      moveId: "crossroads:corner-attack",
    });

    expect(secondOnce.status).toBe("rejected");
    if (secondOnce.status !== "rejected") {
      throw new Error("Second once-per-combo interactable should be rejected.");
    }
    expect(secondOnce.reason.code).toBe("mkxl.builder.interactable_reused");

    const disabledInteractable = mkxlStages
      .flatMap((stage) => stage.interactables)
      .find((interactable) => interactable.usagePolicy === "disabled");

    if (disabledInteractable) {
      const disabledTransition = attemptMkxlBuilderTransition({
        context: {
          ...scorpionNinjutsuContext,
          stageId: disabledInteractable.stageId,
        },
        moveId: disabledInteractable.id,
      });

      expect(disabledTransition.status).toBe("rejected");
      if (disabledTransition.status !== "rejected") {
        throw new Error("Disabled interactable should be rejected.");
      }
      expect(disabledTransition.reason.code).toBe("mkxl.builder.interactable_disabled");
    } else {
      expect(disabledInteractable).toBeUndefined();
    }
  });

  it("converts invalid replay into stale or invalid combo state", () => {
    const combo = expectPresent(scorpionNinjutsuCombos[0], "Scorpion Ninjutsu combo");
    const firstMoveId = expectPresent(combo.movePath[0], "first combo move");
    const invalidPath = createMkxlBuilderMovePath([firstMoveId, "general:run"]);
    const staleState = getMkxlBuilderComboState({
      context: scorpionNinjutsuContext,
      path: invalidPath,
    });
    const invalidState = getMkxlBuilderComboState({
      context: scorpionNinjutsuContext,
      path: invalidPath,
      invalidStatus: "invalid",
    });

    expect(BuilderComboStateSchema.parse(staleState)).toEqual(staleState);
    expect(BuilderComboStateSchema.parse(invalidState)).toEqual(invalidState);
    expect(staleState.status).toBe("stale");
    expect(invalidState.status).toBe("invalid");
  });
});
