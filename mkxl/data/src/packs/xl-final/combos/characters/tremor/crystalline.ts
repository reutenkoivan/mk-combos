import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.tremor;
const variationSlug = "crystalline";
const variationId = `${characterId}:${variationSlug}` as const;

const tremorCrystallineStarter001Combo = {
  id: "tremor-crystalline-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Tremor Crystalline starter",
    fallback: "Tremor Crystalline starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 27,
    meter: 0,
    position: "midscreen",
    starter: "Opening Assault",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["starter", "bnb"],
  },
  notes: {
    EN: "Curated seeded route for MKXL variation coverage.",
    fallback: "Curated seeded route for MKXL variation coverage.",
  },
  gameVersion: "XL-final",
  sourceIds: [
    "mkwarehouse-mkx",
    "wikipedia-mkx",
    "wikipedia-it-mkx-variations",
    "in-game-practice-mode",
  ],
  route: [
    transitions.tremor.universal.openingAssault,
    transitions.tremor.universal.risingAssault,
    transitions.tremor.crystalline.crystallineTechnique,
    transitions.tremor.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const tremorCrystallineCommunityBeginner001Combo = {
  id: "tremor-crystalline-community-beginner-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Tremor Crystalline F12+DB2D-B2-B2+DB2",
    fallback: "Tremor Crystalline F12+DB2D-B2-B2+DB2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 24,
    meter: 0,
    position: "midscreen",
    starter: "F12+DB2D",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F12+DB2D-B2-B2+DB2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: F12+DB2D-B2-B2+DB2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.tremor.crystalline.fOneTwoIntoDBTwoD,
    transitions.tremor.crystalline.bTwo,
    transitions.tremor.crystalline.bTwoIntoDBTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const tremorCrystallineCommunityBeginner002Combo = {
  id: "tremor-crystalline-community-beginner-002",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Tremor Crystalline B12+DB2D-B2-B2+DB2",
    fallback: "Tremor Crystalline B12+DB2D-B2-B2+DB2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 27,
    meter: 0,
    position: "midscreen",
    starter: "B12+DB2D",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B12+DB2D-B2-B2+DB2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B12+DB2D-B2-B2+DB2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.tremor.crystalline.bOneTwoIntoDBTwoD,
    transitions.tremor.crystalline.bTwo,
    transitions.tremor.crystalline.bTwoIntoDBTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const tremorCrystallineCommunityBeginner003Combo = {
  id: "tremor-crystalline-community-beginner-003",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Tremor Crystalline B32+DB2D-B2-B2+DB2",
    fallback: "Tremor Crystalline B32+DB2D-B2-B2+DB2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 27,
    meter: 0,
    position: "midscreen",
    starter: "B32+DB2D",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B32+DB2D-B2-B2+DB2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B32+DB2D-B2-B2+DB2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.tremor.crystalline.bThreeTwoIntoDBTwoD,
    transitions.tremor.crystalline.bTwo,
    transitions.tremor.crystalline.bTwoIntoDBTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const tremorCrystallineCommunityBeginner004Combo = {
  id: "tremor-crystalline-community-beginner-004",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Tremor Crystalline DB2D-B2-B2+DB2",
    fallback: "Tremor Crystalline DB2D-B2-B2+DB2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 21,
    meter: 0,
    position: "midscreen",
    starter: "DB2D",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: DB2D-B2-B2+DB2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: DB2D-B2-B2+DB2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.tremor.crystalline.dBTwoD,
    transitions.tremor.crystalline.bTwo,
    transitions.tremor.crystalline.bTwoIntoDBTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const tremorCrystallineCommunityBeginner005Combo = {
  id: "tremor-crystalline-community-beginner-005",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Tremor Crystalline B3+DB2D-B2-B2+DB2",
    fallback: "Tremor Crystalline B3+DB2D-B2-B2+DB2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 25,
    meter: 0,
    position: "midscreen",
    starter: "B3+DB2D",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B3+DB2D-B2-B2+DB2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B3+DB2D-B2-B2+DB2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.tremor.crystalline.bThreeIntoDBTwoD,
    transitions.tremor.crystalline.bTwo,
    transitions.tremor.crystalline.bTwoIntoDBTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const tremorCrystallineCommunityBeginner006Combo = {
  id: "tremor-crystalline-community-beginner-006",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Tremor Crystalline 21D4+DB2D-B2-B2+DB2",
    fallback: "Tremor Crystalline 21D4+DB2D-B2-B2+DB2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 27,
    meter: 0,
    position: "midscreen",
    starter: "21D4+DB2D",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 21D4+DB2D-B2-B2+DB2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 21D4+DB2D-B2-B2+DB2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.tremor.crystalline.twoOneDFourIntoDBTwoD,
    transitions.tremor.crystalline.bTwo,
    transitions.tremor.crystalline.bTwoIntoDBTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const tremorCrystallineCommunityBeginner007Combo = {
  id: "tremor-crystalline-community-beginner-007",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Tremor Crystalline 21+DB2D-B2-B2+DB2",
    fallback: "Tremor Crystalline 21+DB2D-B2-B2+DB2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 25,
    meter: 0,
    position: "midscreen",
    starter: "21+DB2D",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 21+DB2D-B2-B2+DB2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 21+DB2D-B2-B2+DB2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.tremor.crystalline.twoOneIntoDBTwoD,
    transitions.tremor.crystalline.bTwo,
    transitions.tremor.crystalline.bTwoIntoDBTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const tremorCrystallineCommunityCorner020Combo = {
  id: "tremor-crystalline-community-corner-020",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Tremor Crystalline F12+DB2D-4+DB2U-F4-123+DB2",
    fallback: "Tremor Crystalline F12+DB2D-4+DB2U-F4-123+DB2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 36,
    meter: 0,
    position: "corner",
    starter: "F12+DB2D",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: F12+DB2D-4+DB2U-F4-123+DB2.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: F12+DB2D-4+DB2U-F4-123+DB2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.tremor.crystalline.fOneTwoIntoDBTwoD,
    transitions.tremor.crystalline.fourIntoDBTwoU,
    transitions.tremor.crystalline.fFour,
    transitions.tremor.crystalline.oneTwoThreeIntoDBTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const tremorCrystallineCommunityCorner021Combo = {
  id: "tremor-crystalline-community-corner-021",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Tremor Crystalline 21D4+DB2D-4+DB2U-F4-123+DB2",
    fallback: "Tremor Crystalline 21D4+DB2D-4+DB2U-F4-123+DB2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 38,
    meter: 0,
    position: "corner",
    starter: "21D4+DB2D",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 21D4+DB2D-4+DB2U-F4-123+DB2.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: 21D4+DB2D-4+DB2U-F4-123+DB2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.tremor.crystalline.twoOneDFourIntoDBTwoD,
    transitions.tremor.crystalline.fourIntoDBTwoU,
    transitions.tremor.crystalline.fFour,
    transitions.tremor.crystalline.oneTwoThreeIntoDBTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const tremorCrystallineCommunityCorner022Combo = {
  id: "tremor-crystalline-community-corner-022",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Tremor Crystalline 21D4+EXBF4-D+DB2U-F4-123+DB2",
    fallback: "Tremor Crystalline 21D4+EXBF4-D+DB2U-F4-123+DB2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 44,
    meter: 1,
    position: "corner",
    starter: "21D4+EXBF4",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 21D4+EXBF4-D+DB2U-F4-123+DB2.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: 21D4+EXBF4-D+DB2U-F4-123+DB2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.tremor.crystalline.twoOneDFourIntoExBFFour,
    transitions.tremor.crystalline.dIntoDBTwoU,
    transitions.tremor.crystalline.fFour,
    transitions.tremor.crystalline.oneTwoThreeIntoDBTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const tremorCrystallineCommunityCorner023Combo = {
  id: "tremor-crystalline-community-corner-023",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Tremor Crystalline B32+DB2D-4+DB2U-F4-123+DB2",
    fallback: "Tremor Crystalline B32+DB2D-4+DB2U-F4-123+DB2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 39,
    meter: 0,
    position: "corner",
    starter: "B32+DB2D",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B32+DB2D-4+DB2U-F4-123+DB2.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: B32+DB2D-4+DB2U-F4-123+DB2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.tremor.crystalline.bThreeTwoIntoDBTwoD,
    transitions.tremor.crystalline.fourIntoDBTwoU,
    transitions.tremor.crystalline.fFour,
    transitions.tremor.crystalline.oneTwoThreeIntoDBTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const tremorCrystallineCombos = {
  sourcePath: "characters/tremor/crystalline.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    tremorCrystallineStarter001Combo,
    tremorCrystallineCommunityBeginner001Combo,
    tremorCrystallineCommunityBeginner002Combo,
    tremorCrystallineCommunityBeginner003Combo,
    tremorCrystallineCommunityBeginner004Combo,
    tremorCrystallineCommunityBeginner005Combo,
    tremorCrystallineCommunityBeginner006Combo,
    tremorCrystallineCommunityBeginner007Combo,
    tremorCrystallineCommunityCorner020Combo,
    tremorCrystallineCommunityCorner021Combo,
    tremorCrystallineCommunityCorner022Combo,
    tremorCrystallineCommunityCorner023Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
