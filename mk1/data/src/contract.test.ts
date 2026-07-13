import type {
  Mk1ComboDifficulty,
  Mk1ComboMetadata,
  Mk1ComboPosition,
  Mk1ComboRouteStep,
  Mk1ComboRouteType,
} from "@mk-combos/mk1-data/combos/type";
import {
  mk1ComboDifficulties,
  mk1ComboPositions,
  mk1ComboRouteTypes,
  mk1SeededComboIds,
  mk1SeededCombos,
} from "@mk-combos/mk1-data/combos/value";
import * as contractEntry from "@mk-combos/mk1-data/contract";
import { mk1DataContractGroups, mkCombosMk1Data } from "@mk-combos/mk1-data/contract";
import { validateMk1Data } from "@mk-combos/mk1-data/coverage/runtime";
import { mk1CoverageTargets } from "@mk-combos/mk1-data/coverage/value";
import { Mk1DataSourceKindSchema, Mk1DataSourceSchema } from "@mk-combos/mk1-data/game/schema";
import type { Mk1DataSourceKind } from "@mk-combos/mk1-data/game/type";
import {
  mk1DataSourceKinds,
  mk1DataSources,
  mk1ExactGameplayEvidenceSourceIds,
  mk1Game,
} from "@mk-combos/mk1-data/game/value";
import { Mk1GraphNodeKindSchema, Mk1GraphTimingSchema } from "@mk-combos/mk1-data/graph/schema";
import type {
  Mk1GraphEdge,
  Mk1GraphNode,
  Mk1GraphNodeKind,
  Mk1GraphTiming,
  Mk1GraphTimingKind,
} from "@mk-combos/mk1-data/graph/type";
import {
  mk1CharacterGraphs,
  mk1GraphNodeKinds,
  mk1GraphTimingKinds,
  mk1KameoGraphOverlays,
} from "@mk-combos/mk1-data/graph/value";
import { Mk1KameoReleaseKindSchema } from "@mk-combos/mk1-data/kameos/schema";
import type { Mk1KameoReleaseKind } from "@mk-combos/mk1-data/kameos/type";
import { mk1KameoReleaseKinds, mk1Kameos } from "@mk-combos/mk1-data/kameos/value";
import {
  Mk1InputNotationValueSchema,
  Mk1MoveFrameDataSchema,
  Mk1MoveNotationValueSchema,
  Mk1MoveTacticalFactSchema,
} from "@mk-combos/mk1-data/movelists/schema";
import type {
  Mk1AttackLevel,
  Mk1InputNotationValue,
  Mk1Move,
  Mk1MoveAvailability,
  Mk1MoveCategory,
  Mk1MoveFrameData,
  Mk1Movelist,
  Mk1MoveNotationValue,
  Mk1MoveOwnerKind,
  Mk1MoveTacticalFact,
  Mk1MoveTacticalFactKind,
  Mk1MoveTree,
} from "@mk-combos/mk1-data/movelists/type";
import {
  mk1AttackLevels,
  mk1CharacterMovelists,
  mk1InputNotationValues,
  mk1KameoMovelists,
  mk1MoveCategories,
  mk1Movelists,
  mk1MoveNotationValues,
  mk1MoveOwnerKinds,
  mk1Moves,
  mk1MoveTacticalFactKinds,
  mk1MoveTreeRegistry,
} from "@mk-combos/mk1-data/movelists/value";
import { Mk1CharacterReleaseKindSchema } from "@mk-combos/mk1-data/roster/schema";
import type { Mk1CharacterReleaseKind } from "@mk-combos/mk1-data/roster/type";
import { mk1CharacterReleaseKinds, mk1Characters } from "@mk-combos/mk1-data/roster/value";
import { Mk1PickerSlotStatusSchema } from "@mk-combos/mk1-data/shared/schema";
import type { Mk1PickerSlotStatus } from "@mk-combos/mk1-data/shared/type";
import { mk1PickerSlotStatuses } from "@mk-combos/mk1-data/shared/value";
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
  dataSourceKind: Mk1DataSourceKind;
  edge: Mk1GraphEdge;
  graphTiming: Mk1GraphTiming;
  graphTimingKind: Mk1GraphTimingKind;
  graphNode: Mk1GraphNode;
  graphNodeKind: Mk1GraphNodeKind;
  inputNotationValue: Mk1InputNotationValue;
  move: Mk1Move;
  attackLevel: Mk1AttackLevel;
  moveAvailability: Mk1MoveAvailability;
  moveCategory: Mk1MoveCategory;
  moveFrameData: Mk1MoveFrameData;
  moveTacticalFact: Mk1MoveTacticalFact;
  moveTacticalFactKind: Mk1MoveTacticalFactKind;
  moveNotationValue: Mk1MoveNotationValue;
  moveOwnerKind: Mk1MoveOwnerKind;
  kameoReleaseKind: Mk1KameoReleaseKind;
  characterReleaseKind: Mk1CharacterReleaseKind;
  pickerSlotStatus: Mk1PickerSlotStatus;
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
    expect(mk1DataContractGroups.shared).toEqual({
      schema: "@mk-combos/mk1-data/shared/schema",
      type: "@mk-combos/mk1-data/shared/type",
      value: "@mk-combos/mk1-data/shared/value",
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
    expect(mk1ComboDifficulties).toEqual({ easy: "easy", hard: "hard", medium: "medium" });
    expect(mk1ComboPositions).toEqual({ corner: "corner", midscreen: "midscreen" });
    expect(mk1ComboRouteTypes).toEqual({ bnb: "bnb", kameo: "kameo" });
    expect(mk1DataSourceKinds).toEqual({
      curated: "curated",
      manual: "manual",
      official: "official",
      reference: "reference",
    });
    expect(mk1ExactGameplayEvidenceSourceIds).toEqual([
      "in-game-practice-mode",
      "netherrealm-patch-notes",
    ]);
    expect(mk1DataSources).toContainEqual({
      id: "netherrealm-patch-notes",
      label: "NetherRealm Studios Mortal Kombat patch notes",
      url: "https://www.mortalkombat.com/index.php/en-gb/patch-notes",
      kind: "official",
    });
    expect(mk1GraphNodeKinds).toEqual({ end: "end", kameo: "kameo", move: "move", start: "start" });
    expect(mk1GraphTimingKinds).toEqual({
      cancel: "cancel",
      gap: "gap",
      juggle: "juggle",
      link: "link",
    });
    expect(mk1AttackLevels).toEqual({
      high: "high",
      low: "low",
      mid: "mid",
      overhead: "overhead",
      throw: "throw",
      unblockable: "unblockable",
    });
    expect(mk1MoveTacticalFactKinds).toEqual({
      attackLevel: "attackLevel",
      duckable: "duckable",
      internalGap: "internalGap",
    });
    expect(mk1KameoReleaseKinds).toEqual({
      base: "base",
      khaosReigns: "khaosReigns",
      kombatPack1: "kombatPack1",
      unlockable: "unlockable",
    });
    expect(mk1InputNotationValues).toEqual({
      "1": "1",
      "2": "2",
      "3": "3",
      "4": "4",
      AMP: "AMP",
      B: "B",
      D: "D",
      F: "F",
      K: "K",
      SS: "SS",
      U: "U",
    });
    expect(mk1MoveCategories).toEqual({
      kameo: "kameo",
      mechanic: "mechanic",
      normal: "normal",
      special: "special",
    });
    expect(mk1MoveOwnerKinds).toEqual({
      character: "character",
      general: "general",
      kameo: "kameo",
    });
    expect(mk1CharacterReleaseKinds).toEqual({
      base: "base",
      khaosReigns: "khaosReigns",
      kombatPack1: "kombatPack1",
      preorder: "preorder",
      unlockable: "unlockable",
    });
    expect(mk1PickerSlotStatuses).toEqual({
      disabledNoComboData: "disabledNoComboData",
      placeholder: "placeholder",
      selectable: "selectable",
    });
    expect(mk1MoveNotationValues).toEqual(mk1InputNotationValues);
    expect(Mk1InputNotationValueSchema.safeParse("K").success).toBe(true);
    expect(Mk1MoveNotationValueSchema.safeParse("RUN").success).toBe(false);
    expect(Mk1DataSourceKindSchema.safeParse(mk1DataSourceKinds.official).success).toBe(true);
    expect(Mk1DataSourceKindSchema.safeParse("generated").success).toBe(false);
    expect(Mk1GraphNodeKindSchema.safeParse(mk1GraphNodeKinds.move).success).toBe(true);
    expect(Mk1KameoReleaseKindSchema.safeParse(mk1KameoReleaseKinds.base).success).toBe(true);
    expect(Mk1CharacterReleaseKindSchema.safeParse(mk1CharacterReleaseKinds.base).success).toBe(
      true,
    );
    expect(Mk1PickerSlotStatusSchema.safeParse(mk1PickerSlotStatuses.selectable).success).toBe(
      true,
    );

    expect(mkCombosMk1Data.valueSets.mk1DataSourceKinds).toBe(mk1DataSourceKinds);
    expect(mkCombosMk1Data.valueSets.mk1ExactGameplayEvidenceSourceIds).toBe(
      mk1ExactGameplayEvidenceSourceIds,
    );
    expect(mkCombosMk1Data.valueSets.mk1GraphNodeKinds).toBe(mk1GraphNodeKinds);
    expect(mkCombosMk1Data.valueSets.mk1GraphTimingKinds).toBe(mk1GraphTimingKinds);
    expect(mkCombosMk1Data.valueSets.mk1AttackLevels).toBe(mk1AttackLevels);
    expect(mkCombosMk1Data.valueSets.mk1MoveTacticalFactKinds).toBe(mk1MoveTacticalFactKinds);
    expect(mkCombosMk1Data.valueSets.mk1KameoReleaseKinds).toBe(mk1KameoReleaseKinds);
    expect(mkCombosMk1Data.valueSets.mk1MoveOwnerKinds).toBe(mk1MoveOwnerKinds);
    expect(mkCombosMk1Data.valueSets.mk1CharacterReleaseKinds).toBe(mk1CharacterReleaseKinds);
    expect(mkCombosMk1Data.valueSets.mk1PickerSlotStatuses).toBe(mk1PickerSlotStatuses);

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
    const graphTiming = Mk1GraphTimingSchema.parse({
      kind: mk1GraphTimingKinds.link,
      frameCount: 2,
      sourceIds: ["in-game-practice-mode"],
    });
    const moveFrameData = Mk1MoveFrameDataSchema.parse({
      startup: 7,
      blockAdvantage: -2,
      sourceIds: ["in-game-practice-mode"],
    });
    const moveTacticalFact = Mk1MoveTacticalFactSchema.parse({
      id: "fact:test:attack-level",
      kind: mk1MoveTacticalFactKinds.attackLevel,
      value: mk1AttackLevels.high,
      hitIndex: 1,
      sourceIds: ["in-game-practice-mode"],
    });

    expect(
      acceptsPublicTypes({
        comboDifficulty: firstCombo.metadata.difficulty,
        comboMetadata: firstCombo.metadata,
        comboPosition: firstCombo.metadata.position,
        comboRouteStep: firstRouteStep,
        comboRouteType: firstCombo.metadata.routeType,
        dataSourceKind: mk1DataSourceKinds.official,
        edge: firstGraphEdge,
        graphTiming,
        graphTimingKind: mk1GraphTimingKinds.link,
        graphNode: firstGraphNode,
        graphNodeKind: mk1GraphNodeKinds.move,
        inputNotationValue: firstInputNotationValue,
        attackLevel: mk1AttackLevels.high,
        move: firstMove,
        moveAvailability: firstMove.availability,
        moveCategory: firstMove.category,
        moveFrameData,
        moveTacticalFact,
        moveTacticalFactKind: mk1MoveTacticalFactKinds.attackLevel,
        moveNotationValue: firstInputNotationValue,
        moveOwnerKind: firstMove.ownerKind,
        kameoReleaseKind: mk1KameoReleaseKinds.base,
        characterReleaseKind: mk1CharacterReleaseKinds.base,
        pickerSlotStatus: mk1PickerSlotStatuses.selectable,
        moveTree: firstMoveTree.moves,
        movelist: firstMovelist,
      }),
    ).toBe(true);
  });

  it("keeps exact tactical, frame, timing, and URL schemas strict", () => {
    expect(
      Mk1MoveTacticalFactSchema.safeParse({
        id: "fact:test:gap",
        kind: mk1MoveTacticalFactKinds.internalGap,
        value: 2,
        afterHitIndex: 1,
        sourceIds: ["in-game-practice-mode"],
      }).success,
    ).toBe(true);
    expect(
      Mk1MoveTacticalFactSchema.safeParse({
        id: "fact:test:gap",
        kind: mk1MoveTacticalFactKinds.internalGap,
        value: 0,
        sourceIds: ["in-game-practice-mode"],
      }).success,
    ).toBe(false);
    expect(Mk1MoveFrameDataSchema.safeParse({ startup: 7 }).success).toBe(false);
    expect(Mk1MoveFrameDataSchema.safeParse({ sourceIds: ["in-game-practice-mode"] }).success).toBe(
      false,
    );
    expect(
      Mk1MoveFrameDataSchema.safeParse({
        startup: 0,
        sourceIds: ["in-game-practice-mode"],
      }).success,
    ).toBe(false);
    expect(
      Mk1GraphTimingSchema.safeParse({
        kind: mk1GraphTimingKinds.cancel,
        frameCount: 0,
        sourceIds: ["in-game-practice-mode"],
      }).success,
    ).toBe(false);
    expect(
      Mk1DataSourceSchema.safeParse({
        id: "invalid-url",
        label: "Invalid URL",
        url: "not-a-url",
        kind: mk1DataSourceKinds.reference,
      }).success,
    ).toBe(false);
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
