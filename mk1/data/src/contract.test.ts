import type {
  Mk1ComboDifficulty,
  Mk1ComboMetadata,
  Mk1ComboPosition,
  Mk1ComboRouteStep,
  Mk1ComboRouteType,
} from "@mk-combos/mk1-data/combos/type";
import { mk1SeededComboIds, mk1SeededCombos } from "@mk-combos/mk1-data/combos/value";
import * as contractEntry from "@mk-combos/mk1-data/contract";
import { mk1DataContractGroups, mkCombosMk1Data } from "@mk-combos/mk1-data/contract";
import { validateMk1Data } from "@mk-combos/mk1-data/coverage/runtime";
import { mk1CoverageTargets } from "@mk-combos/mk1-data/coverage/value";
import { mk1Game } from "@mk-combos/mk1-data/game/value";
import type { Mk1GraphEdge, Mk1GraphNode } from "@mk-combos/mk1-data/graph/type";
import { mk1CharacterGraphs, mk1KameoGraphOverlays } from "@mk-combos/mk1-data/graph/value";
import { mk1Kameos } from "@mk-combos/mk1-data/kameos/value";
import {
  Mk1InputNotationValueSchema,
  Mk1MoveNotationValueSchema,
} from "@mk-combos/mk1-data/movelists/schema";
import type {
  Mk1InputNotationValue,
  Mk1Move,
  Mk1MoveAvailability,
  Mk1MoveCategory,
  Mk1MoveFrameData,
  Mk1Movelist,
  Mk1MoveNotationValue,
  Mk1MoveOwnerKind,
  Mk1MoveTree,
} from "@mk-combos/mk1-data/movelists/type";
import {
  mk1CharacterMovelists,
  mk1InputNotationValues,
  mk1KameoMovelists,
  mk1MoveCategories,
  mk1Movelists,
  mk1MoveNotationValues,
  mk1Moves,
  mk1MoveTreeRegistry,
} from "@mk-combos/mk1-data/movelists/value";
import { mk1Characters } from "@mk-combos/mk1-data/roster/value";
import { describe, expect, it } from "vitest";

const expectPresent = <T>(value: T | undefined, label: string): T => {
  expect(value).toBeDefined();
  if (!value) {
    throw new Error(`${label} should be present.`);
  }

  return value;
};

const acceptsPublicTypes = (_contract: {
  comboDifficulty: Mk1ComboDifficulty;
  comboMetadata: Mk1ComboMetadata;
  comboPosition: Mk1ComboPosition;
  comboRouteStep: Mk1ComboRouteStep;
  comboRouteType: Mk1ComboRouteType;
  edge: Mk1GraphEdge;
  graphNode: Mk1GraphNode;
  inputNotationValue: Mk1InputNotationValue;
  move: Mk1Move;
  moveAvailability: Mk1MoveAvailability;
  moveCategory: Mk1MoveCategory;
  moveFrameData: Mk1MoveFrameData;
  moveNotationValue: Mk1MoveNotationValue;
  moveOwnerKind: Mk1MoveOwnerKind;
  moveTree: Mk1MoveTree;
  movelist: Mk1Movelist;
}) => true;

describe("@mk-combos/mk1-data contract", () => {
  it("keeps the contract entrypoint limited to contract metadata", () => {
    expect(Object.keys(contractEntry).sort()).toEqual(["mk1DataContractGroups", "mkCombosMk1Data"]);
    expect(mkCombosMk1Data.packageName).toBe("@mk-combos/mk1-data");
    expect(mkCombosMk1Data.game).toBe(mk1Game);
    expect(mkCombosMk1Data.groups).toBe(mk1DataContractGroups);
    expect(mkCombosMk1Data.coverage).toBe(mk1CoverageTargets);
  });

  it("documents every public subpath group", () => {
    expect(mk1DataContractGroups.roster).toEqual({
      schema: "@mk-combos/mk1-data/roster/schema",
      type: "@mk-combos/mk1-data/roster/type",
      value: "@mk-combos/mk1-data/roster/value",
    });
    expect(mk1DataContractGroups.kameos).toEqual({
      schema: "@mk-combos/mk1-data/kameos/schema",
      type: "@mk-combos/mk1-data/kameos/type",
      value: "@mk-combos/mk1-data/kameos/value",
    });
    expect(mk1DataContractGroups.coverage.runtime).toBe("@mk-combos/mk1-data/coverage/runtime");
  });

  it("imports public data subpaths and value sets", () => {
    expect(mk1Characters).toHaveLength(35);
    expect(mk1Kameos).toHaveLength(21);
    expect(mk1SeededCombos).toHaveLength(735);
    expect(mk1SeededComboIds).toHaveLength(735);
    expect(mk1Movelists).toHaveLength(56);
    expect(mk1CharacterMovelists).toHaveLength(35);
    expect(mk1KameoMovelists).toHaveLength(21);
    expect(Object.keys(mk1MoveTreeRegistry)).toHaveLength(56);
    expect(mk1CharacterGraphs).toHaveLength(35);
    expect(mk1KameoGraphOverlays).toHaveLength(735);
    expect(mk1MoveCategories).toContain("kameo");
    expect(mk1InputNotationValues).toContain("K");
    expect(mk1MoveNotationValues).toEqual(mk1InputNotationValues);
    expect(Mk1InputNotationValueSchema.safeParse("K").success).toBe(true);
    expect(Mk1MoveNotationValueSchema.safeParse("RUN").success).toBe(false);

    const firstCombo = expectPresent(mk1SeededCombos[0], "first combo");
    const firstMove = expectPresent(mk1Moves[0], "first move");
    const firstMovelist = expectPresent(mk1Movelists[0], "first movelist");
    const firstMoveTree = expectPresent(
      mk1MoveTreeRegistry[`${firstMovelist.ownerKind}:${firstMovelist.ownerId}`],
      "first move tree",
    );
    const firstGraphNode = expectPresent(mk1CharacterGraphs[0]?.nodes[0], "first graph node");
    const firstGraphEdge = expectPresent(mk1CharacterGraphs[0]?.edges[0], "first graph edge");
    const firstInputNotationValue = Mk1InputNotationValueSchema.parse(
      expectPresent(firstMove.notation[0], "first move notation"),
    );
    const firstRouteStep = expectPresent(firstCombo.route[0], "first combo route step");

    expect(
      acceptsPublicTypes({
        comboDifficulty: firstCombo.metadata.difficulty,
        comboMetadata: firstCombo.metadata,
        comboPosition: firstCombo.metadata.position,
        comboRouteStep: firstRouteStep,
        comboRouteType: firstCombo.metadata.routeType,
        edge: firstGraphEdge,
        graphNode: firstGraphNode,
        inputNotationValue: firstInputNotationValue,
        move: firstMove,
        moveAvailability: firstMove.availability,
        moveCategory: firstMove.category,
        moveFrameData: firstMove.frameData ?? {},
        moveNotationValue: firstInputNotationValue,
        moveOwnerKind: firstMove.ownerKind,
        moveTree: firstMoveTree.moves,
        movelist: firstMovelist,
      }),
    ).toBe(true);
  });

  it("keeps validation importable from the public runtime subpath", () => {
    expect(validateMk1Data()).toMatchObject({
      ok: true,
      counts: {
        characters: 35,
        kameos: 21,
        combos: 735,
      },
      issues: [],
    });
  });
});
