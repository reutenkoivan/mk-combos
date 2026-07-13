import * as contextSchema from "@mk-combos/mkxl-builder/context/schema";
import type { MkxlBuilderContext, MkxlBuilderId } from "@mk-combos/mkxl-builder/context/type";
import * as contractEntry from "@mk-combos/mkxl-builder/contract";
import { mkCombosMkxlBuilder, mkxlBuilderContractGroups } from "@mk-combos/mkxl-builder/contract";
import * as graphRuntime from "@mk-combos/mkxl-builder/graph/runtime";
import {
  MkxlBuilderMoveChoiceKindSchema,
  MkxlBuilderMoveChoiceSchema,
} from "@mk-combos/mkxl-builder/graph/schema";
import type {
  MkxlBuilderMoveChoice,
  MkxlBuilderMoveChoiceKind,
} from "@mk-combos/mkxl-builder/graph/type";
import { mkxlBuilderMoveChoiceKinds } from "@mk-combos/mkxl-builder/graph/value";
import * as replayRuntime from "@mk-combos/mkxl-builder/replay/runtime";
import * as stateRuntime from "@mk-combos/mkxl-builder/state/runtime";
import { describe, expect, it } from "vitest";

const acceptsPublicTypes = (_contract: {
  id: MkxlBuilderId;
  context: MkxlBuilderContext;
  choice: MkxlBuilderMoveChoice;
  choiceKind: MkxlBuilderMoveChoiceKind;
}) => true;

describe("@mk-combos/mkxl-builder contract", () => {
  it("keeps the contract entrypoint limited to contract metadata", () => {
    expect(Object.keys(contractEntry).sort()).toEqual([
      "mkCombosMkxlBuilder",
      "mkxlBuilderContractGroups",
    ]);
    expect(mkCombosMkxlBuilder.packageName).toBe("@mk-combos/mkxl-builder");
    expect(mkCombosMkxlBuilder.groups).toBe(mkxlBuilderContractGroups);
    expect(mkxlBuilderContractGroups.context).toEqual({
      schema: "@mk-combos/mkxl-builder/context/schema",
      type: "@mk-combos/mkxl-builder/context/type",
    });
    expect(mkxlBuilderContractGroups.graph).toEqual({
      runtime: "@mk-combos/mkxl-builder/graph/runtime",
      schema: "@mk-combos/mkxl-builder/graph/schema",
      type: "@mk-combos/mkxl-builder/graph/type",
      value: "@mk-combos/mkxl-builder/graph/value",
    });
    expect(mkxlBuilderContractGroups.replay).toEqual({
      runtime: "@mk-combos/mkxl-builder/replay/runtime",
    });
    expect(mkxlBuilderContractGroups.state).toEqual({
      runtime: "@mk-combos/mkxl-builder/state/runtime",
    });
    expect(mkxlBuilderMoveChoiceKinds).toEqual({
      interactable: "interactable",
      move: "move",
    });
    expect(mkCombosMkxlBuilder.valueSets.mkxlBuilderMoveChoiceKinds).toBe(
      mkxlBuilderMoveChoiceKinds,
    );
    expect(
      MkxlBuilderMoveChoiceKindSchema.safeParse(mkxlBuilderMoveChoiceKinds.interactable).success,
    ).toBe(true);
    expect(MkxlBuilderMoveChoiceKindSchema.safeParse("kameo").success).toBe(false);
  });

  it("keeps public subpaths importable", () => {
    const context = contextSchema.MkxlBuilderContextSchema.parse({
      characterId: "scorpion",
      variationId: "scorpion:ninjutsu",
    });
    const graph = graphRuntime.composeMkxlBuilderGraph(context);
    const choices = graphRuntime.getMkxlBuilderValidNextMoves({ context });
    const firstChoice = choices[0] ?? {
      id: "scorpion:opening-assault",
      kind: "move",
      moveId: "scorpion:opening-assault",
      label: "Opening Assault",
      candidates: [
        {
          moveId: "scorpion:opening-assault",
        },
      ],
    };
    const firstStep = replayRuntime.createMkxlBuilderPathStep({
      moveId: firstChoice.moveId,
      index: 0,
    });
    const path = replayRuntime.createMkxlBuilderMovePath([firstStep.moveId]);
    const replay = replayRuntime.replayMkxlBuilderPath({ context, path });
    const state = stateRuntime.getMkxlBuilderComboState({ context, path });

    expect(graph.nodes.length).toBeGreaterThan(0);
    expect(MkxlBuilderMoveChoiceSchema.parse(firstChoice)).toEqual(firstChoice);
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
