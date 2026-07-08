import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.reptile;
const variationSlug = "nimble";
const variationId = `${characterId}:${variationSlug}` as const;

const reptileNimbleStarter001Combo = {
  id: "reptile-nimble-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Nimble starter",
    fallback: "Reptile Nimble starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 26,
    meter: 0,
    position: "midscreen",
    starter: "Opening Assault",
    routeType: "bnb",
    difficulty: "easy",
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
    transitions.reptile.universal.openingAssault,
    transitions.reptile.universal.risingAssault,
    transitions.reptile.nimble.nimbleTechnique,
    transitions.reptile.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const reptileNimbleCommunityBeginner002Combo = {
  id: "reptile-nimble-community-beginner-002",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Nimble 2124-F21+DB2",
    fallback: "Reptile Nimble 2124-F21+DB2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 20,
    meter: 0,
    position: "midscreen",
    starter: "2124",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 2124-F21+DB2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 2124-F21+DB2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.reptile.universal.twoOneTwoFour,
    transitions.reptile.universal.fTwoOneIntoDBTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const reptileNimbleCommunityBeginner003Combo = {
  id: "reptile-nimble-community-beginner-003",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Nimble F412+BF2-F412+DB4",
    fallback: "Reptile Nimble F412+BF2-F412+DB4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 28,
    meter: 0,
    position: "midscreen",
    starter: "F412+BF2",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F412+BF2-F412+DB4.",
    fallback: "Community combo source route. Section: beginner. Raw notation: F412+BF2-F412+DB4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.reptile.universal.fFourOneTwoIntoBFTwo,
    transitions.reptile.universal.fFourOneTwoIntoDBFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const reptileNimbleCommunityBeginner004Combo = {
  id: "reptile-nimble-community-beginner-004",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Nimble B2-F21+DB4",
    fallback: "Reptile Nimble B2-F21+DB4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 18,
    meter: 0,
    position: "midscreen",
    starter: "B2",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B2-F21+DB4.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B2-F21+DB4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [transitions.reptile.universal.bTwo, transitions.reptile.universal.fTwoOneIntoDBFour],
} as const satisfies MkxlAuthoredSeededCombo;

const reptileNimbleCommunityBeginner005Combo = {
  id: "reptile-nimble-community-beginner-005",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Nimble B2-F21(MB)-F412+BF4",
    fallback: "Reptile Nimble B2-F21(MB)-F412+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 30,
    meter: 1,
    position: "midscreen",
    starter: "B2",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B2-F21(MB)-F412+BF4.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B2-F21(MB)-F412+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.reptile.universal.bTwo,
    transitions.reptile.universal.fTwoOneMb,
    transitions.reptile.universal.fFourOneTwoIntoBFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const reptileNimbleCommunityOptimal009Combo = {
  id: "reptile-nimble-community-optimal-009",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Nimble F412+BF2-21-F412+BF4",
    fallback: "Reptile Nimble F412+BF2-21-F412+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 30,
    meter: 0,
    position: "midscreen",
    starter: "F412+BF2",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "optimal"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: F412+BF2-21-F412+BF4.",
    fallback: "Community combo source route. Section: optimal. Raw notation: F412+BF2-21-F412+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.reptile.universal.fFourOneTwoIntoBFTwo,
    transitions.reptile.universal.twoOne,
    transitions.reptile.universal.fFourOneTwoIntoBFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const reptileNimbleCommunityOptimal010Combo = {
  id: "reptile-nimble-community-optimal-010",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Nimble F41+EXDD3-F412+BF2-21-F412+BF4",
    fallback: "Reptile Nimble F41+EXDD3-F412+BF2-21-F412+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 36,
    meter: 1,
    position: "midscreen",
    starter: "F41+EXDD3",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "optimal", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: F41+EXDD3-F412+BF2-21-F412+BF4.",
    fallback:
      "Community combo source route. Section: optimal. Raw notation: F41+EXDD3-F412+BF2-21-F412+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.reptile.universal.fFourOneIntoExDDThree,
    transitions.reptile.universal.fFourOneTwoIntoBFTwo,
    transitions.reptile.universal.twoOne,
    transitions.reptile.universal.fFourOneTwoIntoBFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const reptileNimbleCommunityCorner015Combo = {
  id: "reptile-nimble-community-corner-015",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Nimble 12+DF3-D2-21-D3-F412+BF4",
    fallback: "Reptile Nimble 12+DF3-D2-21-D3-F412+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 32,
    meter: 0,
    position: "corner",
    starter: "12+DF3",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 12+DF3-D2-21-D3-F412+BF4.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: 12+DF3-D2-21-D3-F412+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.reptile.universal.oneTwoIntoDFThree,
    transitions.reptile.universal.dTwo,
    transitions.reptile.universal.twoOne,
    transitions.reptile.universal.dThree,
    transitions.reptile.universal.fFourOneTwoIntoBFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const reptileNimbleCommunityCorner017Combo = {
  id: "reptile-nimble-community-corner-017",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Nimble 141-D1-21-F412+BF4",
    fallback: "Reptile Nimble 141-D1-21-F412+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 31,
    meter: 0,
    position: "corner",
    starter: "141",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 141-D1-21-F412+BF4.",
    fallback: "Community combo source route. Section: corner. Raw notation: 141-D1-21-F412+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.reptile.universal.oneFourOne,
    transitions.reptile.universal.dOne,
    transitions.reptile.universal.twoOne,
    transitions.reptile.universal.fFourOneTwoIntoBFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const reptileNimbleCommunityCorner018Combo = {
  id: "reptile-nimble-community-corner-018",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Nimble F412+DB3-D2-21-D3-F412+BF4",
    fallback: "Reptile Nimble F412+DB3-D2-21-D3-F412+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 35,
    meter: 0,
    position: "corner",
    starter: "F412+DB3",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: F412+DB3-D2-21-D3-F412+BF4.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: F412+DB3-D2-21-D3-F412+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.reptile.universal.fFourOneTwoIntoDBThree,
    transitions.reptile.universal.dTwo,
    transitions.reptile.universal.twoOne,
    transitions.reptile.universal.dThree,
    transitions.reptile.universal.fFourOneTwoIntoBFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const reptileNimbleCommunityCorner019Combo = {
  id: "reptile-nimble-community-corner-019",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Nimble F41+EXDD3-F412+DB3-D2-21-D3-F412+BF4",
    fallback: "Reptile Nimble F41+EXDD3-F412+DB3-D2-21-D3-F412+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 40,
    meter: 1,
    position: "corner",
    starter: "F41+EXDD3",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: F41+EXDD3-F412+DB3-D2-21-D3-F412+BF4.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: F41+EXDD3-F412+DB3-D2-21-D3-F412+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.reptile.universal.fFourOneIntoExDDThree,
    transitions.reptile.universal.fFourOneTwoIntoDBThree,
    transitions.reptile.universal.dTwo,
    transitions.reptile.universal.twoOne,
    transitions.reptile.universal.dThree,
    transitions.reptile.universal.fFourOneTwoIntoBFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const reptileNimbleCommunityCorner020Combo = {
  id: "reptile-nimble-community-corner-020",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Nimble B3+EXDD3-F412+DB3-D2-21-F412+BF4",
    fallback: "Reptile Nimble B3+EXDD3-F412+DB3-D2-21-F412+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 36,
    meter: 1,
    position: "corner",
    starter: "B3+EXDD3",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B3+EXDD3-F412+DB3-D2-21-F412+BF4.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: B3+EXDD3-F412+DB3-D2-21-F412+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.reptile.universal.bThreeIntoExDDThree,
    transitions.reptile.universal.fFourOneTwoIntoDBThree,
    transitions.reptile.universal.dTwo,
    transitions.reptile.universal.twoOne,
    transitions.reptile.universal.fFourOneTwoIntoBFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const reptileNimbleCommunityCorner021Combo = {
  id: "reptile-nimble-community-corner-021",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Nimble B2-141-D1-D1-F412+BF4",
    fallback: "Reptile Nimble B2-141-D1-D1-F412+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 33,
    meter: 0,
    position: "corner",
    starter: "B2",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B2-141-D1-D1-F412+BF4.",
    fallback: "Community combo source route. Section: corner. Raw notation: B2-141-D1-D1-F412+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.reptile.universal.bTwo,
    transitions.reptile.universal.oneFourOne,
    transitions.reptile.universal.dOne,
    transitions.reptile.universal.dOne,
    transitions.reptile.universal.fFourOneTwoIntoBFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const reptileNimbleCombos = {
  sourcePath: "characters/reptile/nimble.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    reptileNimbleStarter001Combo,
    reptileNimbleCommunityBeginner002Combo,
    reptileNimbleCommunityBeginner003Combo,
    reptileNimbleCommunityBeginner004Combo,
    reptileNimbleCommunityBeginner005Combo,
    reptileNimbleCommunityOptimal009Combo,
    reptileNimbleCommunityOptimal010Combo,
    reptileNimbleCommunityCorner015Combo,
    reptileNimbleCommunityCorner017Combo,
    reptileNimbleCommunityCorner018Combo,
    reptileNimbleCommunityCorner019Combo,
    reptileNimbleCommunityCorner020Combo,
    reptileNimbleCommunityCorner021Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
