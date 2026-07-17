import { BuilderReplayResultSchema } from "@mk-combos/builder-core/replay/schema";
import { BuilderComboStateSchema } from "@mk-combos/builder-core/stale/schema";
import { BuilderTransitionResultSchema } from "@mk-combos/builder-core/transition/schema";
import {
  composeMk1BuilderGraph,
  getMk1BuilderValidNextMoves,
} from "@mk-combos/mk1-builder/graph/runtime";
import {
  attemptMk1BuilderTransition,
  createMk1BuilderMovePath,
  replayMk1BuilderPath,
} from "@mk-combos/mk1-builder/replay/runtime";
import {
  createMk1BuilderInitialRuntime,
  getMk1BuilderComboState,
} from "@mk-combos/mk1-builder/state/runtime";
import { mk1SeededCombos } from "@mk-combos/mk1-data/combos/value";
import { describe, expect, it } from "vitest";

const scorpionCyraxContext = {
  characterId: "scorpion",
  kameoId: "cyrax",
} as const;

const expectPresent = <T>(value: T | undefined, label: string): T => {
  expect(value).toBeDefined();
  if (!value) {
    throw new Error(`${label} should be present.`);
  }

  return value;
};

describe("@mk-combos/mk1-builder runtime", () => {
  it("composes character graph with selected kameo overlay", () => {
    const graph = composeMk1BuilderGraph(scorpionCyraxContext);

    expect(graph.metadata).toMatchObject({
      gameId: "mk1",
      characterId: "scorpion",
      kameoId: "cyrax",
    });
    expect(graph.edges.some((edge) => edge.moveId === "kameo:cyrax:assist")).toBe(true);
    expect(graph.edges.some((edge) => edge.moveId === "kameo:sub-zero:assist")).toBe(false);
  });

  it("exposes valid next moves by runtime position", () => {
    const initialChoices = getMk1BuilderValidNextMoves({
      context: scorpionCyraxContext,
    });
    const firstTransition = attemptMk1BuilderTransition({
      context: scorpionCyraxContext,
      moveId: "scorpion:quick-strike",
    });

    expect(initialChoices.map((choice) => choice.moveId)).toEqual(["scorpion:quick-strike"]);
    expect(firstTransition.ok).toBe(true);
    if (!firstTransition.ok) {
      throw new Error("First transition should be accepted.");
    }
    const secondChoices = getMk1BuilderValidNextMoves({
      context: scorpionCyraxContext,
      runtime: firstTransition.toRuntime,
    });
    expect(secondChoices.map((choice) => choice.moveId)).toEqual(["scorpion:rising-launcher"]);
  });

  it("accepts selected kameo assist and rejects another kameo assist", () => {
    const runtime = createMk1BuilderInitialRuntime(scorpionCyraxContext);
    const quickStrike = attemptMk1BuilderTransition({
      context: scorpionCyraxContext,
      runtime,
      moveId: "scorpion:quick-strike",
    });

    expect(quickStrike.ok).toBe(true);
    if (!quickStrike.ok) {
      throw new Error("Quick strike should be accepted.");
    }
    const launcher = attemptMk1BuilderTransition({
      context: scorpionCyraxContext,
      runtime: quickStrike.toRuntime,
      moveId: "scorpion:rising-launcher",
    });

    expect(launcher.ok).toBe(true);
    if (!launcher.ok) {
      throw new Error("Launcher should be accepted.");
    }
    const wrongKameo = attemptMk1BuilderTransition({
      context: scorpionCyraxContext,
      runtime: launcher.toRuntime,
      moveId: "kameo:sub-zero:assist",
    });
    const selectedKameo = attemptMk1BuilderTransition({
      context: scorpionCyraxContext,
      runtime: launcher.toRuntime,
      moveId: "kameo:cyrax:assist",
    });

    expect(wrongKameo.ok).toBe(false);
    expect(selectedKameo.ok).toBe(true);
    expect(BuilderTransitionResultSchema.parse(selectedKameo)).toEqual(selectedKameo);
  });

  it("replays a seeded combo path as valid", () => {
    const combo = expectPresent(
      mk1SeededCombos.find(
        (seededCombo) =>
          seededCombo.characterId === scorpionCyraxContext.characterId &&
          seededCombo.kameoId === scorpionCyraxContext.kameoId,
      ),
      "Scorpion Cyrax combo",
    );
    const replay = replayMk1BuilderPath({
      context: scorpionCyraxContext,
      path: createMk1BuilderMovePath(combo.movePath),
    });

    expect(replay.ok).toBe(true);
    expect(BuilderReplayResultSchema.parse(replay)).toEqual(replay);
    if (!replay.ok) {
      throw new Error("Seeded replay should be valid.");
    }
    expect(replay.originalPath.map((step) => step.label)).toEqual([
      undefined,
      undefined,
      undefined,
      undefined,
    ]);
    expect(replay.acceptedPath.map((step) => step.label)).toEqual([
      "Scorpion Quick Strike",
      "Scorpion Rising Launcher",
      "Cyrax Kameo Assist",
      "Scorpion Finisher",
    ]);
    expect(replay.transitions.map((transition) => transition.step.label)).toEqual(
      replay.acceptedPath.map((step) => step.label),
    );
  });

  it("converts invalid replay into stale or invalid combo state", () => {
    const path = createMk1BuilderMovePath([
      "scorpion:quick-strike",
      "scorpion:rising-launcher",
      "kameo:cyrax:assist",
      "kameo:cyrax:assist",
    ]);
    const staleState = getMk1BuilderComboState({
      context: scorpionCyraxContext,
      path,
    });
    const invalidState = getMk1BuilderComboState({
      context: scorpionCyraxContext,
      path,
      invalidStatus: "invalid",
    });

    expect(staleState.status).toBe("stale");
    expect(invalidState.status).toBe("invalid");
    expect(BuilderComboStateSchema.parse(staleState)).toEqual(staleState);
  });
});
