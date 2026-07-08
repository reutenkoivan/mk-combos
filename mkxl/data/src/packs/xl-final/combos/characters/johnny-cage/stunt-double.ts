import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.johnnyCage;
const variationSlug = "stunt-double";
const variationId = `${characterId}:${variationSlug}` as const;

const johnnyCageStuntDoubleStarter001Combo = {
  id: "johnny-cage-stunt-double-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Johnny Cage Stunt Double starter",
    fallback: "Johnny Cage Stunt Double starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 32,
    meter: 0,
    position: "corner",
    starter: "Opening Assault",
    routeType: "bnb",
    difficulty: "hard",
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
    transitions.johnnyCage.universal.openingAssault,
    transitions.johnnyCage.universal.risingAssault,
    transitions.johnnyCage.stuntDouble.stuntDoubleTechnique,
    transitions.johnnyCage.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const johnnyCageStuntDoubleCommunityBeginner001Combo = {
  id: "johnny-cage-stunt-double-community-beginner-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Johnny Cage Stunt Double 113+EXBD3-F3+BD3",
    fallback: "Johnny Cage Stunt Double 113+EXBD3-F3+BD3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 27,
    meter: 1,
    position: "midscreen",
    starter: "113+EXBD3",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 113+EXBD3-F3+BD3.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 113+EXBD3-F3+BD3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.johnnyCage.stuntDouble.oneOneThreeIntoExBDThree,
    transitions.johnnyCage.stuntDouble.fThreeIntoBDThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const johnnyCageStuntDoubleCommunityBeginner002Combo = {
  id: "johnny-cage-stunt-double-community-beginner-002",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Johnny Cage Stunt Double DB4-113+DB1-DASH-F3+DB1-DASH-F3+BD3",
    fallback: "Johnny Cage Stunt Double DB4-113+DB1-DASH-F3+DB1-DASH-F3+BD3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 32,
    meter: 0,
    position: "midscreen",
    starter: "DB4",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: DB4-113+DB1-DASH-F3+DB1-DASH-F3+BD3.",
    fallback:
      "Community combo source route. Section: beginner. Raw notation: DB4-113+DB1-DASH-F3+DB1-DASH-F3+BD3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.johnnyCage.stuntDouble.dBFour,
    transitions.johnnyCage.stuntDouble.oneOneThreeIntoDBOne,
    transitions.johnnyCage.stuntDouble.dash,
    transitions.johnnyCage.stuntDouble.fThreeIntoDBOne,
    transitions.johnnyCage.stuntDouble.dash,
    transitions.johnnyCage.stuntDouble.fThreeIntoBDThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const johnnyCageStuntDoubleCommunityBeginner003Combo = {
  id: "johnny-cage-stunt-double-community-beginner-003",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Johnny Cage Stunt Double F24-D1-F3+BD3",
    fallback: "Johnny Cage Stunt Double F24-D1-F3+BD3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 21,
    meter: 0,
    position: "midscreen",
    starter: "F24",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F24-D1-F3+BD3.",
    fallback: "Community combo source route. Section: beginner. Raw notation: F24-D1-F3+BD3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.johnnyCage.stuntDouble.fTwoFour,
    transitions.johnnyCage.stuntDouble.dOne,
    transitions.johnnyCage.stuntDouble.fThreeIntoBDThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const johnnyCageStuntDoubleCommunityBeginner004Combo = {
  id: "johnny-cage-stunt-double-community-beginner-004",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Johnny Cage Stunt Double F24-D1-F3+EXBD3-F3+BD3",
    fallback: "Johnny Cage Stunt Double F24-D1-F3+EXBD3-F3+BD3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 31,
    meter: 1,
    position: "midscreen",
    starter: "F24",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F24-D1-F3+EXBD3-F3+BD3.",
    fallback:
      "Community combo source route. Section: beginner. Raw notation: F24-D1-F3+EXBD3-F3+BD3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.johnnyCage.stuntDouble.fTwoFour,
    transitions.johnnyCage.stuntDouble.dOne,
    transitions.johnnyCage.stuntDouble.fThreeIntoExBDThree,
    transitions.johnnyCage.stuntDouble.fThreeIntoBDThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const johnnyCageStuntDoubleCommunityBeginner005Combo = {
  id: "johnny-cage-stunt-double-community-beginner-005",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Johnny Cage Stunt Double DB4-F24-D1-F3+DB1-DASH-F3+DB1-DASH-F3+BD3",
    fallback: "Johnny Cage Stunt Double DB4-F24-D1-F3+DB1-DASH-F3+DB1-DASH-F3+BD3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 37,
    meter: 0,
    position: "midscreen",
    starter: "DB4",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: DB4-F24-D1-F3+DB1-DASH-F3+DB1-DASH-F3+BD3.",
    fallback:
      "Community combo source route. Section: beginner. Raw notation: DB4-F24-D1-F3+DB1-DASH-F3+DB1-DASH-F3+BD3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.johnnyCage.stuntDouble.dBFour,
    transitions.johnnyCage.stuntDouble.fTwoFour,
    transitions.johnnyCage.stuntDouble.dOne,
    transitions.johnnyCage.stuntDouble.fThreeIntoDBOne,
    transitions.johnnyCage.stuntDouble.dash,
    transitions.johnnyCage.stuntDouble.fThreeIntoDBOne,
    transitions.johnnyCage.stuntDouble.dash,
    transitions.johnnyCage.stuntDouble.fThreeIntoBDThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const johnnyCageStuntDoubleCommunityBeginner006Combo = {
  id: "johnny-cage-stunt-double-community-beginner-006",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Johnny Cage Stunt Double DB4-F3+DB1-DASH-F3+DB1-DASH-F3+BD3",
    fallback: "Johnny Cage Stunt Double DB4-F3+DB1-DASH-F3+DB1-DASH-F3+BD3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 31,
    meter: 0,
    position: "midscreen",
    starter: "DB4",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: DB4-F3+DB1-DASH-F3+DB1-DASH-F3+BD3.",
    fallback:
      "Community combo source route. Section: beginner. Raw notation: DB4-F3+DB1-DASH-F3+DB1-DASH-F3+BD3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.johnnyCage.stuntDouble.dBFour,
    transitions.johnnyCage.stuntDouble.fThreeIntoDBOne,
    transitions.johnnyCage.stuntDouble.dash,
    transitions.johnnyCage.stuntDouble.fThreeIntoDBOne,
    transitions.johnnyCage.stuntDouble.dash,
    transitions.johnnyCage.stuntDouble.fThreeIntoBDThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const johnnyCageStuntDoubleCommunityOptimal007Combo = {
  id: "johnny-cage-stunt-double-community-optimal-007",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Johnny Cage Stunt Double 113+EXBD3-F24-12-F3+BD3",
    fallback: "Johnny Cage Stunt Double 113+EXBD3-F24-12-F3+BD3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 32,
    meter: 1,
    position: "midscreen",
    starter: "113+EXBD3",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "optimal", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: 113+EXBD3-F24-12-F3+BD3.",
    fallback:
      "Community combo source route. Section: optimal. Raw notation: 113+EXBD3-F24-12-F3+BD3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.johnnyCage.stuntDouble.oneOneThreeIntoExBDThree,
    transitions.johnnyCage.stuntDouble.fTwoFour,
    transitions.johnnyCage.stuntDouble.oneTwo,
    transitions.johnnyCage.stuntDouble.fThreeIntoBDThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const johnnyCageStuntDoubleCommunityCorner018Combo = {
  id: "johnny-cage-stunt-double-community-corner-018",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Johnny Cage Stunt Double F24+EXBF4-D1-12-12-12-12-113+BD3",
    fallback: "Johnny Cage Stunt Double F24+EXBF4-D1-12-12-12-12-113+BD3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 43,
    meter: 1,
    position: "corner",
    starter: "F24+EXBF4",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: F24+EXBF4-D1-12-12-12-12-113+BD3.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: F24+EXBF4-D1-12-12-12-12-113+BD3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.johnnyCage.stuntDouble.fTwoFourIntoExBFFour,
    transitions.johnnyCage.stuntDouble.dOne,
    transitions.johnnyCage.stuntDouble.oneTwo,
    transitions.johnnyCage.stuntDouble.oneTwo,
    transitions.johnnyCage.stuntDouble.oneTwo,
    transitions.johnnyCage.stuntDouble.oneTwo,
    transitions.johnnyCage.stuntDouble.oneOneThreeIntoBDThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const johnnyCageStuntDoubleCommunityCorner020Combo = {
  id: "johnny-cage-stunt-double-community-corner-020",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Johnny Cage Stunt Double DB4-113+DB1-4+DB1-12-12-12-12-12-12+BD3",
    fallback: "Johnny Cage Stunt Double DB4-113+DB1-4+DB1-12-12-12-12-12-12+BD3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 44,
    meter: 0,
    position: "corner",
    starter: "DB4",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: DB4-113+DB1-4+DB1-12-12-12-12-12-12+BD3.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: DB4-113+DB1-4+DB1-12-12-12-12-12-12+BD3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.johnnyCage.stuntDouble.dBFour,
    transitions.johnnyCage.stuntDouble.oneOneThreeIntoDBOne,
    transitions.johnnyCage.stuntDouble.fourIntoDBOne,
    transitions.johnnyCage.stuntDouble.oneTwo,
    transitions.johnnyCage.stuntDouble.oneTwo,
    transitions.johnnyCage.stuntDouble.oneTwo,
    transitions.johnnyCage.stuntDouble.oneTwo,
    transitions.johnnyCage.stuntDouble.oneTwo,
    transitions.johnnyCage.stuntDouble.oneTwoIntoBDThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const johnnyCageStuntDoubleCommunityCorner022Combo = {
  id: "johnny-cage-stunt-double-community-corner-022",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Johnny Cage Stunt Double DB4-F24+EXDB2-114+DB1-4+DB1-12-12-12+BD3",
    fallback: "Johnny Cage Stunt Double DB4-F24+EXDB2-114+DB1-4+DB1-12-12-12+BD3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 47,
    meter: 1,
    position: "corner",
    starter: "DB4",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: DB4-F24+EXDB2-114+DB1-4+DB1-12-12-12+BD3.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: DB4-F24+EXDB2-114+DB1-4+DB1-12-12-12+BD3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.johnnyCage.stuntDouble.dBFour,
    transitions.johnnyCage.stuntDouble.fTwoFourIntoExDBTwo,
    transitions.johnnyCage.stuntDouble.oneOneFourIntoDBOne,
    transitions.johnnyCage.stuntDouble.fourIntoDBOne,
    transitions.johnnyCage.stuntDouble.oneTwo,
    transitions.johnnyCage.stuntDouble.oneTwo,
    transitions.johnnyCage.stuntDouble.oneTwoIntoBDThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const johnnyCageStuntDoubleCombos = {
  sourcePath: "characters/johnny-cage/stunt-double.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    johnnyCageStuntDoubleStarter001Combo,
    johnnyCageStuntDoubleCommunityBeginner001Combo,
    johnnyCageStuntDoubleCommunityBeginner002Combo,
    johnnyCageStuntDoubleCommunityBeginner003Combo,
    johnnyCageStuntDoubleCommunityBeginner004Combo,
    johnnyCageStuntDoubleCommunityBeginner005Combo,
    johnnyCageStuntDoubleCommunityBeginner006Combo,
    johnnyCageStuntDoubleCommunityOptimal007Combo,
    johnnyCageStuntDoubleCommunityCorner018Combo,
    johnnyCageStuntDoubleCommunityCorner020Combo,
    johnnyCageStuntDoubleCommunityCorner022Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
