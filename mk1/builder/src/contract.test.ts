import * as contextSchema from "@mk-combos/mk1-builder/context/schema";
import type { Mk1BuilderContext, Mk1BuilderId } from "@mk-combos/mk1-builder/context/type";
import * as contractEntry from "@mk-combos/mk1-builder/contract";
import { mk1BuilderContractGroups, mkCombosMk1Builder } from "@mk-combos/mk1-builder/contract";
import * as graphRuntime from "@mk-combos/mk1-builder/graph/runtime";
import {
  Mk1BuilderMoveChoiceKindSchema,
  Mk1BuilderMoveChoiceSchema,
} from "@mk-combos/mk1-builder/graph/schema";
import type {
  Mk1BuilderMoveChoice,
  Mk1BuilderMoveChoiceKind,
} from "@mk-combos/mk1-builder/graph/type";
import { mk1BuilderMoveChoiceKinds } from "@mk-combos/mk1-builder/graph/value";
import * as replayRuntime from "@mk-combos/mk1-builder/replay/runtime";
import * as stateRuntime from "@mk-combos/mk1-builder/state/runtime";
import { describe, expect, it } from "vitest";

const acceptsPublicTypes = (_contract: {
  id: Mk1BuilderId;
  context: Mk1BuilderContext;
  choice: Mk1BuilderMoveChoice;
  choiceKind: Mk1BuilderMoveChoiceKind;
}) => true;

describe("@mk-combos/mk1-builder contract", () => {
  it("keeps the contract entrypoint limited to contract metadata", () => {
    expect(Object.keys(contractEntry).sort()).toEqual([
      "mk1BuilderContractGroups",
      "mkCombosMk1Builder",
    ]);
    expect(mkCombosMk1Builder.packageName).toBe("@mk-combos/mk1-builder");
    expect(mkCombosMk1Builder.groups).toBe(mk1BuilderContractGroups);
    expect(mk1BuilderContractGroups.graph).toEqual({
      runtime: "@mk-combos/mk1-builder/graph/runtime",
      schema: "@mk-combos/mk1-builder/graph/schema",
      type: "@mk-combos/mk1-builder/graph/type",
      value: "@mk-combos/mk1-builder/graph/value",
    });
    expect(mk1BuilderMoveChoiceKinds).toEqual({ kameo: "kameo", move: "move" });
    expect(mkCombosMk1Builder.valueSets.mk1BuilderMoveChoiceKinds).toBe(mk1BuilderMoveChoiceKinds);
    expect(Mk1BuilderMoveChoiceKindSchema.safeParse(mk1BuilderMoveChoiceKinds.kameo).success).toBe(
      true,
    );
    expect(Mk1BuilderMoveChoiceKindSchema.safeParse("interactable").success).toBe(false);
  });

  it("keeps public subpaths importable", () => {
    const context = contextSchema.Mk1BuilderContextSchema.parse({
      characterId: "scorpion",
      kameoId: "cyrax",
    });
    const graph = graphRuntime.composeMk1BuilderGraph(context);
    const choices = graphRuntime.getMk1BuilderValidNextMoves({ context });
    const firstChoice = choices[0];

    expect(graph.nodes.length).toBeGreaterThan(0);
    expect(graph.edges.some((edge) => edge.kind === "kameo")).toBe(true);
    expect(firstChoice).toBeDefined();
    if (!firstChoice) {
      throw new Error("MK1 first choice should be present.");
    }
    expect(Mk1BuilderMoveChoiceSchema.parse(firstChoice)).toEqual(firstChoice);
    const path = replayRuntime.createMk1BuilderMovePath([
      "scorpion:quick-strike",
      "scorpion:rising-launcher",
      "kameo:cyrax:assist",
      "scorpion:finisher",
    ]);
    const step = replayRuntime.createMk1BuilderPathStep({
      moveId: "scorpion:quick-strike",
      index: 0,
    });
    const replay = replayRuntime.replayMk1BuilderPath({ context, path });
    const parsedRuntime = stateRuntime.parseMk1BuilderRuntimeSnapshot(
      stateRuntime.createMk1BuilderInitialRuntime(context),
    );
    const state = stateRuntime.getMk1BuilderComboState({ context, path });

    expect(step.moveId).toBe("scorpion:quick-strike");
    expect(parsedRuntime.values.activeNodeIds.length).toBeGreaterThan(0);
    expect(parsedRuntime.values.kameoResource).toBe(1);
    expect(replay.status).toBe("valid");
    expect(state.status).toBe("fresh");
    expect(
      acceptsPublicTypes({
        id: "scorpion",
        context,
        choice: firstChoice,
        choiceKind: firstChoice.kind,
      }),
    ).toBe(true);
  });
});
