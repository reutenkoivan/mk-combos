import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.kenshi;
const variationSlug = "possessed";
const variationId = `${characterId}:${variationSlug}` as const;

const kenshiPossessedStarter001Combo = {
  id: "kenshi-possessed-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kenshi Possessed starter",
    fallback: "Kenshi Possessed starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 29,
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
    moves.kenshi.universal.openingAssault,
    moves.kenshi.universal.risingAssault,
    moves.kenshi.possessed.possessedTechnique,
    moves.kenshi.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kenshiPossessedCommunityBeginner001Combo = {
  id: "kenshi-possessed-community-beginner-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kenshi Possessed 114-BF3",
    fallback: "Kenshi Possessed 114-BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 16,
    meter: 0,
    position: "midscreen",
    starter: "114",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 114-BF3.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 114-BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [moves.kenshi.possessed.oneOneFour, moves.kenshi.possessed.bFThree],
} as const satisfies MkxlAuthoredSeededCombo;

const kenshiPossessedCommunityBeginner004Combo = {
  id: "kenshi-possessed-community-beginner-004",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kenshi Possessed B32+DF4",
    fallback: "Kenshi Possessed B32+DF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 18,
    meter: 0,
    position: "midscreen",
    starter: "B32+DF4",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B32+DF4.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B32+DF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [moves.kenshi.possessed.bThreeTwo, moves.kenshi.possessed.dFFour],
} as const satisfies MkxlAuthoredSeededCombo;

const kenshiPossessedCommunityBeginner005Combo = {
  id: "kenshi-possessed-community-beginner-005",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kenshi Possessed B32+EXDB4-F32+BF3",
    fallback: "Kenshi Possessed B32+EXDB4-F32+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 33,
    meter: 1,
    position: "midscreen",
    starter: "B32+EXDB4",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B32+EXDB4-F32+BF3.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B32+EXDB4-F32+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.kenshi.possessed.bThreeTwo,
    moves.kenshi.possessed.exDBFour,
    moves.kenshi.possessed.fThreeTwo,
    moves.kenshi.possessed.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kenshiPossessedCommunityCorner016Combo = {
  id: "kenshi-possessed-community-corner-016",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kenshi Possessed 114-4-D1-D1-D1-43+BF3",
    fallback: "Kenshi Possessed 114-4-D1-D1-D1-43+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 32,
    meter: 0,
    position: "corner",
    starter: "114",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 114-4-D1-D1-D1-43+BF3.",
    fallback: "Community combo source route. Section: corner. Raw notation: 114-4-D1-D1-D1-43+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.kenshi.possessed.oneOneFour,
    moves.kenshi.possessed.four,
    moves.kenshi.possessed.dOne,
    moves.kenshi.possessed.dOne,
    moves.kenshi.possessed.dOne,
    moves.kenshi.possessed.fourThree,
    moves.kenshi.possessed.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kenshiPossessedCommunityCorner018Combo = {
  id: "kenshi-possessed-community-corner-018",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kenshi Possessed B32+EXDB4B-D2-D1-D1-D1-43+BF3",
    fallback: "Kenshi Possessed B32+EXDB4B-D2-D1-D1-D1-43+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 41,
    meter: 1,
    position: "corner",
    starter: "B32+EXDB4B",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B32+EXDB4B-D2-D1-D1-D1-43+BF3.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: B32+EXDB4B-D2-D1-D1-D1-43+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.kenshi.possessed.bThreeTwo,
    moves.kenshi.possessed.exDBFourB,
    moves.kenshi.possessed.dTwo,
    moves.kenshi.possessed.dOne,
    moves.kenshi.possessed.dOne,
    moves.kenshi.possessed.dOne,
    moves.kenshi.possessed.fourThree,
    moves.kenshi.possessed.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kenshiPossessedCommunityCorner019Combo = {
  id: "kenshi-possessed-community-corner-019",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kenshi Possessed 421+EXDB4B-D2-D1-D1-D1-D1-43+BF3",
    fallback: "Kenshi Possessed 421+EXDB4B-D2-D1-D1-D1-D1-43+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 42,
    meter: 1,
    position: "corner",
    starter: "421+EXDB4B",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 421+EXDB4B-D2-D1-D1-D1-D1-43+BF3.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: 421+EXDB4B-D2-D1-D1-D1-D1-43+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.kenshi.possessed.fourTwoOne,
    moves.kenshi.possessed.exDBFourB,
    moves.kenshi.possessed.dTwo,
    moves.kenshi.possessed.dOne,
    moves.kenshi.possessed.dOne,
    moves.kenshi.possessed.dOne,
    moves.kenshi.possessed.dOne,
    moves.kenshi.possessed.fourThree,
    moves.kenshi.possessed.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kenshiPossessedCommunityCorner020Combo = {
  id: "kenshi-possessed-community-corner-020",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kenshi Possessed 421+EXDB4B-D2-F32+EXDB1-43+BF3",
    fallback: "Kenshi Possessed 421+EXDB4B-D2-F32+EXDB1-43+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 47,
    meter: 2,
    position: "corner",
    starter: "421+EXDB4B",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 421+EXDB4B-D2-F32+EXDB1-43+BF3.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: 421+EXDB4B-D2-F32+EXDB1-43+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.kenshi.possessed.fourTwoOne,
    moves.kenshi.possessed.exDBFourB,
    moves.kenshi.possessed.dTwo,
    moves.kenshi.possessed.fThreeTwo,
    moves.kenshi.possessed.exDBOne,
    moves.kenshi.possessed.fourThree,
    moves.kenshi.possessed.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const kenshiPossessedCombos = {
  sourcePath: "characters/kenshi/possessed.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    kenshiPossessedStarter001Combo,
    kenshiPossessedCommunityBeginner001Combo,
    kenshiPossessedCommunityBeginner004Combo,
    kenshiPossessedCommunityBeginner005Combo,
    kenshiPossessedCommunityCorner016Combo,
    kenshiPossessedCommunityCorner018Combo,
    kenshiPossessedCommunityCorner019Combo,
    kenshiPossessedCommunityCorner020Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
