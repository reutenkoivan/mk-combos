import type {
  MkxlComboDifficulty,
  MkxlComboMetadata,
  MkxlComboPosition,
  MkxlComboRouteStep,
  MkxlComboRouteType,
  MkxlComboStageContext,
} from "@mk-combos/mkxl-data/combos/type";
import { mkxlSeededComboIds, mkxlSeededCombos } from "@mk-combos/mkxl-data/combos/value";
import * as contractEntry from "@mk-combos/mkxl-data/contract";
import { mkCombosMkxlData, mkxlDataContractGroups } from "@mk-combos/mkxl-data/contract";
import { validateMkxlData } from "@mk-combos/mkxl-data/coverage/runtime";
import { mkxlCoverageTargets } from "@mk-combos/mkxl-data/coverage/value";
import { mkxlDataSources, mkxlGame } from "@mk-combos/mkxl-data/game/value";
import type { MkxlGraphNode } from "@mk-combos/mkxl-data/graph/type";
import { mkxlStageGraphFragments, mkxlVariationGraphs } from "@mk-combos/mkxl-data/graph/value";
import {
  MkxlInputNotationValueSchema,
  MkxlMoveNotationValueSchema,
} from "@mk-combos/mkxl-data/movelists/schema";
import type {
  MkxlInputNotationValue,
  MkxlMove,
  MkxlMoveAvailability,
  MkxlMoveCategory,
  MkxlMoveFrameData,
  MkxlMoveNotationValue,
  MkxlMoveTree,
} from "@mk-combos/mkxl-data/movelists/type";
import {
  mkxlInputNotationValues,
  mkxlInputsRegistry,
  mkxlMoveCategories,
  mkxlMovelists,
  mkxlMoveNotationValues,
  mkxlMoves,
} from "@mk-combos/mkxl-data/movelists/value";
import { mkxlCharacters } from "@mk-combos/mkxl-data/roster/value";
import type {
  MkxlInteractable,
  MkxlStageSegment,
  MkxlStageZone,
} from "@mk-combos/mkxl-data/stages/type";
import { mkxlStages } from "@mk-combos/mkxl-data/stages/value";
import type { MkxlVariation } from "@mk-combos/mkxl-data/variations/type";
import { mkxlVariations, mkxlVariationsByCharacterId } from "@mk-combos/mkxl-data/variations/value";
import { describe, expect, it } from "vitest";
import type {
  MkxlId,
  MkxlLabel,
  MkxlPickerSlot,
  MkxlSourceId,
  MkxlSourceIdList,
} from "./shared/type";

const expectPresent = <T>(value: T | undefined, label: string): T => {
  expect(value).toBeDefined();
  if (!value) {
    throw new Error(`${label} should be present.`);
  }

  return value;
};

const acceptsPublicTypes = (_contract: {
  comboDifficulty: MkxlComboDifficulty;
  comboMetadata: MkxlComboMetadata;
  comboPosition: MkxlComboPosition;
  comboRouteStep: MkxlComboRouteStep;
  comboRouteType: MkxlComboRouteType;
  comboStageContext: MkxlComboStageContext;
  graphNode: MkxlGraphNode;
  inputNotationValue: MkxlInputNotationValue;
  move: MkxlMove;
  moveAvailability: MkxlMoveAvailability;
  moveCategory: MkxlMoveCategory;
  moveFrameData: MkxlMoveFrameData;
  moveNotationValue: MkxlMoveNotationValue;
  moveTree: MkxlMoveTree;
  id: MkxlId;
  label: MkxlLabel;
  pickerSlot: MkxlPickerSlot;
  sourceId: MkxlSourceId;
  sourceIdList: MkxlSourceIdList;
  stageSegment: MkxlStageSegment;
  stageZone: MkxlStageZone;
  interactable: MkxlInteractable;
  variation: MkxlVariation;
}) => true;

describe("@mk-combos/mkxl-data contract", () => {
  it("keeps the contract entrypoint limited to contract metadata", () => {
    expect(Object.keys(contractEntry).sort()).toEqual([
      "mkCombosMkxlData",
      "mkxlDataContractGroups",
    ]);
    expect(mkCombosMkxlData.packageName).toBe("@mk-combos/mkxl-data");
    expect(mkCombosMkxlData.game).toBe(mkxlGame);
    expect(mkCombosMkxlData.groups).toBe(mkxlDataContractGroups);
    expect(mkCombosMkxlData.coverage).toBe(mkxlCoverageTargets);
  });

  it("documents every public subpath group", () => {
    expect(mkxlDataContractGroups.roster).toEqual({
      schema: "@mk-combos/mkxl-data/roster/schema",
      type: "@mk-combos/mkxl-data/roster/type",
      value: "@mk-combos/mkxl-data/roster/value",
    });
    expect(mkxlDataContractGroups.coverage.runtime).toBe("@mk-combos/mkxl-data/coverage/runtime");
    expect(mkxlDataContractGroups.combos.value).toBe("@mk-combos/mkxl-data/combos/value");
  });

  it("imports public data subpaths and value sets", () => {
    expect(mkxlCharacters).toHaveLength(33);
    expect(mkxlVariations).toHaveLength(100);
    expect(mkxlMovelists.length).toBeGreaterThanOrEqual(33);
    expect(mkxlVariationsByCharacterId.triborg).toHaveLength(4);
    expect(mkxlSeededCombos.length).toBeGreaterThanOrEqual(mkxlVariations.length);
    expect(mkxlSeededComboIds).toHaveLength(mkxlSeededCombos.length);
    expect(mkxlVariationGraphs).toHaveLength(mkxlSeededCombos.length);
    expect(mkxlStages).toHaveLength(14);
    expect(mkxlStageGraphFragments).toHaveLength(14);
    expect(mkxlDataSources).toContainEqual({
      id: "community-combo-source",
      label: "Community combo source",
      kind: "communityComboSource",
    });
    expect(mkxlMoveCategories).toContain("variation");
    expect(mkxlMoveCategories).toContain("mechanic");
    expect(mkxlInputNotationValues).toContain("AMP");
    expect(mkxlInputNotationValues).not.toContain("RUN");
    expect(mkxlInputNotationValues).not.toContain("BF4+BLK");
    expect(MkxlInputNotationValueSchema.safeParse("AMP").success).toBe(true);
    expect(MkxlInputNotationValueSchema.safeParse("RUN").success).toBe(false);
    expect(MkxlInputNotationValueSchema.safeParse("BF4+BLK").success).toBe(false);
    expect(mkxlMoveNotationValues).toEqual(mkxlInputNotationValues);
    expect(mkxlMoveNotationValues).toContain("AMP");
    expect(mkxlMoveNotationValues).not.toContain("RUN");
    expect(mkxlMoveNotationValues).not.toContain("DASH");
    expect(mkxlMoveNotationValues).not.toContain("XRAY");
    expect(MkxlMoveNotationValueSchema.safeParse("RUN").success).toBe(false);
    expect(MkxlMoveNotationValueSchema.safeParse("DASH").success).toBe(false);
    expect(MkxlMoveNotationValueSchema.safeParse("XRAY").success).toBe(false);
    expect(mkxlInputsRegistry).toContainEqual({ notation: "1" });
    const firstCharacter = expectPresent(mkxlCharacters[0], "first character");
    const firstCombo = expectPresent(mkxlSeededCombos[0], "first combo");
    const firstMovelist = expectPresent(mkxlMovelists[0], "first movelist");
    const firstMove = expectPresent(firstMovelist.movelist[0], "first move");
    const firstVariation = expectPresent(mkxlVariations[0], "first variation");
    const firstStage = expectPresent(mkxlStages[0], "first stage");
    const firstZone = expectPresent(firstStage.zones[0], "first stage zone");
    const firstSegment = expectPresent(firstZone.segments[0], "first stage segment");
    const firstInteractable = expectPresent(firstStage.interactables[0], "first interactable");
    const firstGraph = expectPresent(mkxlVariationGraphs[0], "first variation graph");
    const firstGraphNode = expectPresent(firstGraph.nodes[0], "first graph node");
    const firstSourceId = expectPresent(firstCharacter.sourceIds[0], "first source id");
    const firstMovePathMoveId = expectPresent(
      firstCombo.movePath[0],
      "first combo move path move id",
    );
    const firstComboRouteStep = expectPresent(firstCombo.route[0], "first combo route step");
    const firstInputNotationValue = MkxlInputNotationValueSchema.parse(
      expectPresent(firstMove.notation[0], "first move notation"),
    );
    const generalRunMove = expectPresent(
      mkxlMoves.find((move) => move.id === "general:run"),
      "general run move",
    );
    const generalRunMoveNotationValue = expectPresent(
      generalRunMove.notation[0],
      "general run notation",
    );
    const moveIds = new Set(mkxlMoves.map((move) => move.id));

    expect(Array.isArray(firstMovelist.moves)).toBe(false);
    expect(firstMove.notation).toEqual(["1", "1", "2"]);
    expect(firstComboRouteStep).toEqual({
      kind: "move",
      moveId: firstCombo.route[0]?.moveId,
    });
    expect(firstCombo.notation[0]).toEqual(["1", "1", "2"]);
    expect(typeof firstMovePathMoveId).toBe("string");
    expect(moveIds.has(firstMovePathMoveId)).toBe(true);
    expect(moveIds.has("raiden:run")).toBe(false);
    expect(moveIds.has("raiden:cansrun")).toBe(false);
    expect(moveIds.has("general:run")).toBe(true);
    expect(generalRunMove.notation).toEqual(["F", "F", "BLK"]);

    expect(
      acceptsPublicTypes({
        comboDifficulty: firstCombo.metadata.difficulty,
        comboMetadata: firstCombo.metadata,
        comboPosition: firstCombo.metadata.position,
        comboRouteStep: firstComboRouteStep,
        comboRouteType: firstCombo.metadata.routeType,
        comboStageContext: firstCombo.stageContext,
        graphNode: firstGraphNode,
        inputNotationValue: firstInputNotationValue,
        move: firstMove,
        moveAvailability: firstMove.availability,
        moveCategory: firstMove.category,
        moveFrameData: { startup: 1 },
        moveNotationValue: generalRunMoveNotationValue,
        moveTree: firstMovelist.moves,
        id: firstCharacter.id,
        label: firstCharacter.label,
        pickerSlot: firstVariation.pickerSlot,
        sourceId: firstSourceId,
        sourceIdList: firstCharacter.sourceIds,
        stageSegment: firstSegment,
        stageZone: firstZone,
        interactable: firstInteractable,
        variation: firstVariation,
      }),
    ).toBe(true);
  });

  it("keeps validation importable from the public runtime subpath", () => {
    expect(validateMkxlData().ok).toBe(true);
  });
});
