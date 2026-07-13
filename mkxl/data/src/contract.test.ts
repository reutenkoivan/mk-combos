import type {
  MkxlComboDifficulty,
  MkxlComboMetadata,
  MkxlComboPosition,
  MkxlComboRouteStep,
  MkxlComboRouteType,
  MkxlComboStageContext,
} from "@mk-combos/mkxl-data/combos/type";
import {
  mkxlComboDifficulties,
  mkxlComboPositions,
  mkxlComboRouteTypes,
  mkxlSeededComboIds,
  mkxlSeededCombos,
} from "@mk-combos/mkxl-data/combos/value";
import * as contractEntry from "@mk-combos/mkxl-data/contract";
import { mkCombosMkxlData, mkxlDataContractGroups } from "@mk-combos/mkxl-data/contract";
import { validateMkxlData } from "@mk-combos/mkxl-data/coverage/runtime";
import { mkxlCoverageTargets } from "@mk-combos/mkxl-data/coverage/value";
import { MkxlDataSourceKindSchema, MkxlDataSourceSchema } from "@mk-combos/mkxl-data/game/schema";
import type { MkxlDataSourceKind } from "@mk-combos/mkxl-data/game/type";
import {
  mkxlDataSourceKinds,
  mkxlDataSources,
  mkxlExactGameplayEvidenceSourceIds,
  mkxlGame,
} from "@mk-combos/mkxl-data/game/value";
import { MkxlGraphNodeKindSchema, MkxlGraphTimingSchema } from "@mk-combos/mkxl-data/graph/schema";
import type {
  MkxlGraphNode,
  MkxlGraphNodeKind,
  MkxlGraphTiming,
  MkxlGraphTimingKind,
} from "@mk-combos/mkxl-data/graph/type";
import {
  mkxlGraphNodeKinds,
  mkxlGraphTimingKinds,
  mkxlStageGraphFragments,
  mkxlVariationGraphs,
} from "@mk-combos/mkxl-data/graph/value";
import {
  MkxlInputNotationValueSchema,
  MkxlMoveFrameDataSchema,
  MkxlMoveNotationValueSchema,
  MkxlMoveTacticalFactSchema,
} from "@mk-combos/mkxl-data/movelists/schema";
import type {
  MkxlAttackLevel,
  MkxlInputNotationValue,
  MkxlMove,
  MkxlMoveAvailability,
  MkxlMoveCategory,
  MkxlMoveFrameData,
  MkxlMoveNotationValue,
  MkxlMoveTacticalFact,
  MkxlMoveTacticalFactKind,
  MkxlMoveTree,
} from "@mk-combos/mkxl-data/movelists/type";
import {
  mkxlAttackLevels,
  mkxlInputNotationValues,
  mkxlInputsRegistry,
  mkxlMoveCategories,
  mkxlMovelists,
  mkxlMoveNotationValues,
  mkxlMoves,
  mkxlMoveTacticalFactKinds,
} from "@mk-combos/mkxl-data/movelists/value";
import { MkxlCharacterReleaseKindSchema } from "@mk-combos/mkxl-data/roster/schema";
import type { MkxlCharacterReleaseKind } from "@mk-combos/mkxl-data/roster/type";
import { mkxlCharacterReleaseKinds, mkxlCharacters } from "@mk-combos/mkxl-data/roster/value";
import { MkxlPickerSlotStatusSchema } from "@mk-combos/mkxl-data/shared/schema";
import type {
  MkxlId,
  MkxlLabel,
  MkxlPickerSlot,
  MkxlPickerSlotStatus,
  MkxlSourceId,
  MkxlSourceIdList,
} from "@mk-combos/mkxl-data/shared/type";
import { mkxlPickerSlotStatuses } from "@mk-combos/mkxl-data/shared/value";
import { MkxlInteractableUsagePolicySchema } from "@mk-combos/mkxl-data/stages/schema";
import type {
  MkxlInteractable,
  MkxlInteractableUsagePolicy,
  MkxlStageSegment,
  MkxlStageZone,
} from "@mk-combos/mkxl-data/stages/type";
import { mkxlInteractableUsagePolicies, mkxlStages } from "@mk-combos/mkxl-data/stages/value";
import type { MkxlVariation } from "@mk-combos/mkxl-data/variations/type";
import { mkxlVariations, mkxlVariationsByCharacterId } from "@mk-combos/mkxl-data/variations/value";
import { describe, expect, it } from "vitest";

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
  dataSourceKind: MkxlDataSourceKind;
  graphTiming: MkxlGraphTiming;
  graphTimingKind: MkxlGraphTimingKind;
  graphNode: MkxlGraphNode;
  graphNodeKind: MkxlGraphNodeKind;
  inputNotationValue: MkxlInputNotationValue;
  attackLevel: MkxlAttackLevel;
  move: MkxlMove;
  moveAvailability: MkxlMoveAvailability;
  moveCategory: MkxlMoveCategory;
  moveFrameData: MkxlMoveFrameData;
  moveTacticalFact: MkxlMoveTacticalFact;
  moveTacticalFactKind: MkxlMoveTacticalFactKind;
  moveNotationValue: MkxlMoveNotationValue;
  moveTree: MkxlMoveTree;
  id: MkxlId;
  label: MkxlLabel;
  pickerSlot: MkxlPickerSlot;
  pickerSlotStatus: MkxlPickerSlotStatus;
  sourceId: MkxlSourceId;
  sourceIdList: MkxlSourceIdList;
  stageSegment: MkxlStageSegment;
  stageZone: MkxlStageZone;
  interactable: MkxlInteractable;
  interactableUsagePolicy: MkxlInteractableUsagePolicy;
  characterReleaseKind: MkxlCharacterReleaseKind;
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
    expect(mkxlDataContractGroups.shared).toEqual({
      schema: "@mk-combos/mkxl-data/shared/schema",
      type: "@mk-combos/mkxl-data/shared/type",
      value: "@mk-combos/mkxl-data/shared/value",
    });
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
    expect(mkxlComboDifficulties).toEqual({ easy: "easy", hard: "hard", medium: "medium" });
    expect(mkxlComboPositions).toEqual({
      antiAir: "antiAir",
      corner: "corner",
      midscreen: "midscreen",
    });
    expect(mkxlComboRouteTypes).toEqual({
      bnb: "bnb",
      metered: "metered",
      punish: "punish",
      stage: "stage",
    });
    expect(mkxlDataSourceKinds).toEqual({
      communityComboSource: "communityComboSource",
      crossCheck: "crossCheck",
      manualVerification: "manualVerification",
      official: "official",
      reference: "reference",
    });
    expect(mkxlExactGameplayEvidenceSourceIds).toEqual([
      "in-game-practice-mode",
      "netherrealm-patch-notes",
      "testyourmight-mkx-frame-data",
    ]);
    expect(mkxlDataSources).toContainEqual({
      id: "testyourmight-mkx-frame-data",
      label: "Test Your Might MKX Frame Data Project",
      url: "https://testyourmight.com/threads/mkx-frame-data-project.55865/post-1889472",
      kind: "reference",
    });
    expect(mkxlGraphNodeKinds).toEqual({
      end: "end",
      move: "move",
      stageInteraction: "stageInteraction",
      start: "start",
    });
    expect(mkxlGraphTimingKinds).toEqual({
      cancel: "cancel",
      gap: "gap",
      juggle: "juggle",
      link: "link",
    });
    expect(mkxlAttackLevels).toEqual({
      high: "high",
      low: "low",
      mid: "mid",
      overhead: "overhead",
      throw: "throw",
      unblockable: "unblockable",
    });
    expect(mkxlMoveTacticalFactKinds).toEqual({
      attackLevel: "attackLevel",
      duckable: "duckable",
      internalGap: "internalGap",
    });
    expect(mkxlInputNotationValues).toEqual({
      amplify: "AMP",
      back: "B",
      block: "BLK",
      down: "D",
      forward: "F",
      four: "4",
      interactable: "INT",
      one: "1",
      stanceSwitch: "SS",
      three: "3",
      two: "2",
      up: "U",
    });
    expect(mkxlMoveCategories).toEqual({
      enhanced: "enhanced",
      mechanic: "mechanic",
      normal: "normal",
      special: "special",
      stage: "stage",
      string: "string",
      throw: "throw",
      variation: "variation",
      xray: "xray",
    });
    expect(mkxlCharacterReleaseKinds).toEqual({
      base: "base",
      dlc: "dlc",
      unlockable: "unlockable",
    });
    expect(mkxlInteractableUsagePolicies).toEqual({
      disabled: "disabled",
      oncePerCombo: "oncePerCombo",
      reusable: "reusable",
    });
    expect(mkxlPickerSlotStatuses).toEqual({
      disabledNoComboData: "disabledNoComboData",
      placeholder: "placeholder",
      selectable: "selectable",
    });
    expect(MkxlInputNotationValueSchema.safeParse("AMP").success).toBe(true);
    expect(MkxlInputNotationValueSchema.safeParse("RUN").success).toBe(false);
    expect(MkxlInputNotationValueSchema.safeParse("BF4+BLK").success).toBe(false);
    expect(mkxlMoveNotationValues).toBe(mkxlInputNotationValues);
    expect(MkxlMoveNotationValueSchema.safeParse("RUN").success).toBe(false);
    expect(MkxlMoveNotationValueSchema.safeParse("DASH").success).toBe(false);
    expect(MkxlMoveNotationValueSchema.safeParse("XRAY").success).toBe(false);
    expect(MkxlDataSourceKindSchema.safeParse(mkxlDataSourceKinds.reference).success).toBe(true);
    expect(MkxlDataSourceKindSchema.safeParse("generated").success).toBe(false);
    expect(MkxlGraphNodeKindSchema.safeParse(mkxlGraphNodeKinds.move).success).toBe(true);
    expect(MkxlCharacterReleaseKindSchema.safeParse(mkxlCharacterReleaseKinds.base).success).toBe(
      true,
    );
    expect(
      MkxlInteractableUsagePolicySchema.safeParse(mkxlInteractableUsagePolicies.reusable).success,
    ).toBe(true);
    expect(MkxlPickerSlotStatusSchema.safeParse(mkxlPickerSlotStatuses.selectable).success).toBe(
      true,
    );
    expect(mkCombosMkxlData.valueSets.mkxlDataSourceKinds).toBe(mkxlDataSourceKinds);
    expect(mkCombosMkxlData.valueSets.mkxlExactGameplayEvidenceSourceIds).toBe(
      mkxlExactGameplayEvidenceSourceIds,
    );
    expect(mkCombosMkxlData.valueSets.mkxlGraphNodeKinds).toBe(mkxlGraphNodeKinds);
    expect(mkCombosMkxlData.valueSets.mkxlGraphTimingKinds).toBe(mkxlGraphTimingKinds);
    expect(mkCombosMkxlData.valueSets.mkxlAttackLevels).toBe(mkxlAttackLevels);
    expect(mkCombosMkxlData.valueSets.mkxlMoveTacticalFactKinds).toBe(mkxlMoveTacticalFactKinds);
    expect(mkCombosMkxlData.valueSets.mkxlCharacterReleaseKinds).toBe(mkxlCharacterReleaseKinds);
    expect(mkCombosMkxlData.valueSets.mkxlInteractableUsagePolicies).toBe(
      mkxlInteractableUsagePolicies,
    );
    expect(mkCombosMkxlData.valueSets.mkxlPickerSlotStatuses).toBe(mkxlPickerSlotStatuses);
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
    const graphTiming = MkxlGraphTimingSchema.parse({
      kind: mkxlGraphTimingKinds.link,
      frameCount: 2,
      sourceIds: ["in-game-practice-mode"],
    });
    const moveFrameData = MkxlMoveFrameDataSchema.parse({
      startup: 7,
      blockAdvantage: -2,
      sourceIds: ["in-game-practice-mode"],
    });
    const moveTacticalFact = MkxlMoveTacticalFactSchema.parse({
      id: "fact:test:duckable",
      kind: mkxlMoveTacticalFactKinds.duckable,
      value: true,
      sourceIds: ["in-game-practice-mode"],
    });

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
        dataSourceKind: mkxlDataSourceKinds.reference,
        graphTiming,
        graphTimingKind: mkxlGraphTimingKinds.link,
        graphNode: firstGraphNode,
        graphNodeKind: mkxlGraphNodeKinds.move,
        inputNotationValue: firstInputNotationValue,
        attackLevel: mkxlAttackLevels.high,
        move: firstMove,
        moveAvailability: firstMove.availability,
        moveCategory: firstMove.category,
        moveFrameData,
        moveTacticalFact,
        moveTacticalFactKind: mkxlMoveTacticalFactKinds.duckable,
        moveNotationValue: generalRunMoveNotationValue,
        moveTree: firstMovelist.moves,
        id: firstCharacter.id,
        label: firstCharacter.label,
        pickerSlot: firstVariation.pickerSlot,
        pickerSlotStatus: mkxlPickerSlotStatuses.selectable,
        sourceId: firstSourceId,
        sourceIdList: firstCharacter.sourceIds,
        stageSegment: firstSegment,
        stageZone: firstZone,
        interactable: firstInteractable,
        interactableUsagePolicy: mkxlInteractableUsagePolicies.reusable,
        characterReleaseKind: mkxlCharacterReleaseKinds.base,
        variation: firstVariation,
      }),
    ).toBe(true);
  });

  it("keeps exact tactical, frame, timing, and URL schemas strict", () => {
    expect(
      MkxlMoveTacticalFactSchema.safeParse({
        id: "fact:test:gap",
        kind: mkxlMoveTacticalFactKinds.internalGap,
        value: 2,
        afterHitIndex: 1,
        sourceIds: ["in-game-practice-mode"],
      }).success,
    ).toBe(true);
    expect(
      MkxlMoveTacticalFactSchema.safeParse({
        id: "fact:test:gap",
        kind: mkxlMoveTacticalFactKinds.internalGap,
        value: 0,
        sourceIds: ["in-game-practice-mode"],
      }).success,
    ).toBe(false);
    expect(MkxlMoveFrameDataSchema.safeParse({ startup: 7 }).success).toBe(false);
    expect(
      MkxlMoveFrameDataSchema.safeParse({ sourceIds: ["in-game-practice-mode"] }).success,
    ).toBe(false);
    expect(
      MkxlMoveFrameDataSchema.safeParse({
        active: 0,
        sourceIds: ["in-game-practice-mode"],
      }).success,
    ).toBe(false);
    expect(
      MkxlGraphTimingSchema.safeParse({
        kind: mkxlGraphTimingKinds.gap,
        frameCount: 0,
        sourceIds: ["in-game-practice-mode"],
      }).success,
    ).toBe(false);
    expect(
      MkxlDataSourceSchema.safeParse({
        id: "invalid-url",
        label: "Invalid URL",
        url: "not-a-url",
        kind: mkxlDataSourceKinds.reference,
      }).success,
    ).toBe(false);
  });

  it("keeps validation importable from the public runtime subpath", () => {
    expect(validateMkxlData().ok).toBe(true);
  });
});
