import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.reptile;
const variationSlug = "deceptive";
const variationId = `${characterId}:${variationSlug}` as const;

const reptileDeceptiveStarter001Combo = {
  id: "reptile-deceptive-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Deceptive starter",
    fallback: "Reptile Deceptive starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 25,
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
    transitions.reptile.deceptive.deceptiveTechnique,
    transitions.reptile.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const reptileDeceptiveCommunityBeginner002Combo = {
  id: "reptile-deceptive-community-beginner-002",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Deceptive 2124-F21+DB2",
    fallback: "Reptile Deceptive 2124-F21+DB2",
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

const reptileDeceptiveCommunityBeginner003Combo = {
  id: "reptile-deceptive-community-beginner-003",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Deceptive F412+BF2-F412+DB4",
    fallback: "Reptile Deceptive F412+BF2-F412+DB4",
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

const reptileDeceptiveCommunityBeginner004Combo = {
  id: "reptile-deceptive-community-beginner-004",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Deceptive B2-F21+DB4",
    fallback: "Reptile Deceptive B2-F21+DB4",
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

const reptileDeceptiveCommunityBeginner005Combo = {
  id: "reptile-deceptive-community-beginner-005",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Deceptive B2-F21(MB)-F412+BF4",
    fallback: "Reptile Deceptive B2-F21(MB)-F412+BF4",
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

const reptileDeceptiveCommunityOptimal009Combo = {
  id: "reptile-deceptive-community-optimal-009",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Deceptive F412+BF2-21-F412+BF4",
    fallback: "Reptile Deceptive F412+BF2-21-F412+BF4",
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

const reptileDeceptiveCommunityOptimal010Combo = {
  id: "reptile-deceptive-community-optimal-010",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Deceptive F41+EXDD3-F412+BF2-21-F412+BF4",
    fallback: "Reptile Deceptive F41+EXDD3-F412+BF2-21-F412+BF4",
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

const reptileDeceptiveCommunityCorner015Combo = {
  id: "reptile-deceptive-community-corner-015",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Deceptive 12+DF3-D2-21-D3-F412+BF4",
    fallback: "Reptile Deceptive 12+DF3-D2-21-D3-F412+BF4",
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

const reptileDeceptiveCommunityCorner017Combo = {
  id: "reptile-deceptive-community-corner-017",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Deceptive 141-D1-21-F412+BF4",
    fallback: "Reptile Deceptive 141-D1-21-F412+BF4",
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

const reptileDeceptiveCommunityCorner018Combo = {
  id: "reptile-deceptive-community-corner-018",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Deceptive F412+DB3-D2-21-D3-F412+BF4",
    fallback: "Reptile Deceptive F412+DB3-D2-21-D3-F412+BF4",
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

const reptileDeceptiveCommunityCorner019Combo = {
  id: "reptile-deceptive-community-corner-019",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Deceptive F41+EXDD3-F412+DB3-D2-21-D3-F412+BF4",
    fallback: "Reptile Deceptive F41+EXDD3-F412+DB3-D2-21-D3-F412+BF4",
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

const reptileDeceptiveCommunityCorner020Combo = {
  id: "reptile-deceptive-community-corner-020",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Deceptive B3+EXDD3-F412+DB3-D2-21-F412+BF4",
    fallback: "Reptile Deceptive B3+EXDD3-F412+DB3-D2-21-F412+BF4",
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

const reptileDeceptiveCommunityCorner021Combo = {
  id: "reptile-deceptive-community-corner-021",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Deceptive B2-141-D1-D1-F412+BF4",
    fallback: "Reptile Deceptive B2-141-D1-D1-F412+BF4",
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

export const reptileDeceptiveCombos = {
  sourcePath: "characters/reptile/deceptive.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    reptileDeceptiveStarter001Combo,
    reptileDeceptiveCommunityBeginner002Combo,
    reptileDeceptiveCommunityBeginner003Combo,
    reptileDeceptiveCommunityBeginner004Combo,
    reptileDeceptiveCommunityBeginner005Combo,
    reptileDeceptiveCommunityOptimal009Combo,
    reptileDeceptiveCommunityOptimal010Combo,
    reptileDeceptiveCommunityCorner015Combo,
    reptileDeceptiveCommunityCorner017Combo,
    reptileDeceptiveCommunityCorner018Combo,
    reptileDeceptiveCommunityCorner019Combo,
    reptileDeceptiveCommunityCorner020Combo,
    reptileDeceptiveCommunityCorner021Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
