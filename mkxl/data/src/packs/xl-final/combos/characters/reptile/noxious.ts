import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.reptile;
const variationSlug = "noxious";
const variationId = `${characterId}:${variationSlug}` as const;

const reptileNoxiousStarter001Combo = {
  id: "reptile-noxious-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Noxious starter",
    fallback: "Reptile Noxious starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 24,
    meter: 1,
    position: "midscreen",
    starter: "Opening Assault",
    routeType: "metered",
    difficulty: "medium",
    tags: ["starter", "metered"],
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
    moves.reptile.universal.openingAssault,
    moves.reptile.universal.risingAssault,
    moves.reptile.noxious.noxiousTechnique,
    moves.reptile.universal.closingStrikeEnhanced,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const reptileNoxiousCommunityBeginner002Combo = {
  id: "reptile-noxious-community-beginner-002",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Noxious 2124-F21+DB2",
    fallback: "Reptile Noxious 2124-F21+DB2",
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
    moves.reptile.universal.twoOneTwoFour,
    moves.reptile.universal.fTwoOne,
    moves.reptile.universal.dBTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const reptileNoxiousCommunityBeginner003Combo = {
  id: "reptile-noxious-community-beginner-003",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Noxious F412+BF2-F412+DB4",
    fallback: "Reptile Noxious F412+BF2-F412+DB4",
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
    moves.reptile.universal.fFourOneTwo,
    moves.reptile.universal.bFTwo,
    moves.reptile.universal.fFourOneTwo,
    moves.reptile.universal.dBFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const reptileNoxiousCommunityBeginner004Combo = {
  id: "reptile-noxious-community-beginner-004",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Noxious B2-F21+DB4",
    fallback: "Reptile Noxious B2-F21+DB4",
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
  route: [
    moves.reptile.universal.bTwo,
    moves.reptile.universal.fTwoOne,
    moves.reptile.universal.dBFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const reptileNoxiousCommunityBeginner005Combo = {
  id: "reptile-noxious-community-beginner-005",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Noxious B2-F21(MB)-F412+BF4",
    fallback: "Reptile Noxious B2-F21(MB)-F412+BF4",
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
    moves.reptile.universal.bTwo,
    moves.reptile.universal.fTwoOne,
    moves.reptile.universal.mb,
    moves.reptile.universal.fFourOneTwo,
    moves.reptile.universal.bFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const reptileNoxiousCommunityOptimal009Combo = {
  id: "reptile-noxious-community-optimal-009",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Noxious F412+BF2-21-F412+BF4",
    fallback: "Reptile Noxious F412+BF2-21-F412+BF4",
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
    moves.reptile.universal.fFourOneTwo,
    moves.reptile.universal.bFTwo,
    moves.reptile.universal.twoOne,
    moves.reptile.universal.fFourOneTwo,
    moves.reptile.universal.bFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const reptileNoxiousCommunityOptimal010Combo = {
  id: "reptile-noxious-community-optimal-010",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Noxious F41+EXDD3-F412+BF2-21-F412+BF4",
    fallback: "Reptile Noxious F41+EXDD3-F412+BF2-21-F412+BF4",
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
    moves.reptile.universal.fFourOne,
    moves.reptile.universal.exDDThree,
    moves.reptile.universal.fFourOneTwo,
    moves.reptile.universal.bFTwo,
    moves.reptile.universal.twoOne,
    moves.reptile.universal.fFourOneTwo,
    moves.reptile.universal.bFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const reptileNoxiousCommunityCorner015Combo = {
  id: "reptile-noxious-community-corner-015",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Noxious 12+DF3-D2-21-D3-F412+BF4",
    fallback: "Reptile Noxious 12+DF3-D2-21-D3-F412+BF4",
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
    moves.reptile.universal.oneTwo,
    moves.reptile.universal.dFThree,
    moves.reptile.universal.dTwo,
    moves.reptile.universal.twoOne,
    moves.reptile.universal.dThree,
    moves.reptile.universal.fFourOneTwo,
    moves.reptile.universal.bFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const reptileNoxiousCommunityCorner017Combo = {
  id: "reptile-noxious-community-corner-017",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Noxious 141-D1-21-F412+BF4",
    fallback: "Reptile Noxious 141-D1-21-F412+BF4",
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
    moves.reptile.universal.oneFourOne,
    moves.reptile.universal.dOne,
    moves.reptile.universal.twoOne,
    moves.reptile.universal.fFourOneTwo,
    moves.reptile.universal.bFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const reptileNoxiousCommunityCorner018Combo = {
  id: "reptile-noxious-community-corner-018",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Noxious F412+DB3-D2-21-D3-F412+BF4",
    fallback: "Reptile Noxious F412+DB3-D2-21-D3-F412+BF4",
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
    moves.reptile.universal.fFourOneTwo,
    moves.reptile.universal.dBThree,
    moves.reptile.universal.dTwo,
    moves.reptile.universal.twoOne,
    moves.reptile.universal.dThree,
    moves.reptile.universal.fFourOneTwo,
    moves.reptile.universal.bFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const reptileNoxiousCommunityCorner019Combo = {
  id: "reptile-noxious-community-corner-019",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Noxious F41+EXDD3-F412+DB3-D2-21-D3-F412+BF4",
    fallback: "Reptile Noxious F41+EXDD3-F412+DB3-D2-21-D3-F412+BF4",
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
    moves.reptile.universal.fFourOne,
    moves.reptile.universal.exDDThree,
    moves.reptile.universal.fFourOneTwo,
    moves.reptile.universal.dBThree,
    moves.reptile.universal.dTwo,
    moves.reptile.universal.twoOne,
    moves.reptile.universal.dThree,
    moves.reptile.universal.fFourOneTwo,
    moves.reptile.universal.bFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const reptileNoxiousCommunityCorner020Combo = {
  id: "reptile-noxious-community-corner-020",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Noxious B3+EXDD3-F412+DB3-D2-21-F412+BF4",
    fallback: "Reptile Noxious B3+EXDD3-F412+DB3-D2-21-F412+BF4",
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
    moves.reptile.universal.bThree,
    moves.reptile.universal.exDDThree,
    moves.reptile.universal.fFourOneTwo,
    moves.reptile.universal.dBThree,
    moves.reptile.universal.dTwo,
    moves.reptile.universal.twoOne,
    moves.reptile.universal.fFourOneTwo,
    moves.reptile.universal.bFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const reptileNoxiousCommunityCorner021Combo = {
  id: "reptile-noxious-community-corner-021",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Reptile Noxious B2-141-D1-D1-F412+BF4",
    fallback: "Reptile Noxious B2-141-D1-D1-F412+BF4",
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
    moves.reptile.universal.bTwo,
    moves.reptile.universal.oneFourOne,
    moves.reptile.universal.dOne,
    moves.reptile.universal.dOne,
    moves.reptile.universal.fFourOneTwo,
    moves.reptile.universal.bFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const reptileNoxiousCombos = {
  sourcePath: "characters/reptile/noxious.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    reptileNoxiousStarter001Combo,
    reptileNoxiousCommunityBeginner002Combo,
    reptileNoxiousCommunityBeginner003Combo,
    reptileNoxiousCommunityBeginner004Combo,
    reptileNoxiousCommunityBeginner005Combo,
    reptileNoxiousCommunityOptimal009Combo,
    reptileNoxiousCommunityOptimal010Combo,
    reptileNoxiousCommunityCorner015Combo,
    reptileNoxiousCommunityCorner017Combo,
    reptileNoxiousCommunityCorner018Combo,
    reptileNoxiousCommunityCorner019Combo,
    reptileNoxiousCommunityCorner020Combo,
    reptileNoxiousCommunityCorner021Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
