import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.erronBlack;
const variationSlug = "outlaw";
const variationId = `${characterId}:${variationSlug}` as const;

const erronBlackOutlawStarter001Combo = {
  id: "erron-black-outlaw-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Erron Black Outlaw starter",
    fallback: "Erron Black Outlaw starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 32,
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
    moves.erronBlack.universal.openingAssault,
    moves.erronBlack.universal.risingAssault,
    moves.erronBlack.outlaw.outlawTechnique,
    moves.erronBlack.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const erronBlackOutlawCommunityBeginner001Combo = {
  id: "erron-black-outlaw-community-beginner-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Erron Black Outlaw 112-BF4",
    fallback: "Erron Black Outlaw 112-BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 16,
    meter: 0,
    position: "midscreen",
    starter: "112",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 112-BF4.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 112-BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [moves.erronBlack.outlaw.oneOneTwo, moves.erronBlack.outlaw.bFFour],
} as const satisfies MkxlAuthoredSeededCombo;

const erronBlackOutlawCommunityBeginner002Combo = {
  id: "erron-black-outlaw-community-beginner-002",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Erron Black Outlaw 11B3+DB4-B33+DF2",
    fallback: "Erron Black Outlaw 11B3+DB4-B33+DF2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 24,
    meter: 0,
    position: "midscreen",
    starter: "11B3+DB4",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 11B3+DB4-B33+DF2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 11B3+DB4-B33+DF2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.erronBlack.outlaw.oneOneBThree,
    moves.erronBlack.outlaw.dBFour,
    moves.erronBlack.outlaw.bThreeThree,
    moves.erronBlack.outlaw.dFTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const erronBlackOutlawCommunityBeginner003Combo = {
  id: "erron-black-outlaw-community-beginner-003",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Erron Black Outlaw 21122+BF4",
    fallback: "Erron Black Outlaw 21122+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 22,
    meter: 0,
    position: "midscreen",
    starter: "21122+BF4",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 21122+BF4.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 21122+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [moves.erronBlack.outlaw.twoOneOneTwoTwo, moves.erronBlack.outlaw.bFFour],
} as const satisfies MkxlAuthoredSeededCombo;

const erronBlackOutlawCommunityBeginner004Combo = {
  id: "erron-black-outlaw-community-beginner-004",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Erron Black Outlaw F13+DB4-B33+DF2",
    fallback: "Erron Black Outlaw F13+DB4-B33+DF2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 25,
    meter: 0,
    position: "midscreen",
    starter: "F13+DB4",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F13+DB4-B33+DF2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: F13+DB4-B33+DF2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.erronBlack.outlaw.fOneThree,
    moves.erronBlack.outlaw.dBFour,
    moves.erronBlack.outlaw.bThreeThree,
    moves.erronBlack.outlaw.dFTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const erronBlackOutlawCommunityBeginner005Combo = {
  id: "erron-black-outlaw-community-beginner-005",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Erron Black Outlaw B33+DB4-B33+DF2",
    fallback: "Erron Black Outlaw B33+DB4-B33+DF2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 27,
    meter: 0,
    position: "midscreen",
    starter: "B33+DB4",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B33+DB4-B33+DF2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B33+DB4-B33+DF2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.erronBlack.outlaw.bThreeThree,
    moves.erronBlack.outlaw.dBFour,
    moves.erronBlack.outlaw.bThreeThree,
    moves.erronBlack.outlaw.dFTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const erronBlackOutlawCommunityCorner018Combo = {
  id: "erron-black-outlaw-community-corner-018",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Erron Black Outlaw 21122+EXDB4-D1-21122+DBF2",
    fallback: "Erron Black Outlaw 21122+EXDB4-D1-21122+DBF2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 38,
    meter: 1,
    position: "corner",
    starter: "21122+EXDB4",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 21122+EXDB4-D1-21122+DBF2.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: 21122+EXDB4-D1-21122+DBF2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.erronBlack.outlaw.twoOneOneTwoTwo,
    moves.erronBlack.outlaw.exDBFour,
    moves.erronBlack.outlaw.dOne,
    moves.erronBlack.outlaw.twoOneOneTwoTwo,
    moves.erronBlack.outlaw.dBFTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const erronBlackOutlawCommunityCorner021Combo = {
  id: "erron-black-outlaw-community-corner-021",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Erron Black Outlaw B33+EXBF3-D2-D1-21122+DBF2",
    fallback: "Erron Black Outlaw B33+EXBF3-D2-D1-21122+DBF2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 40,
    meter: 1,
    position: "corner",
    starter: "B33+EXBF3",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B33+EXBF3-D2-D1-21122+DBF2.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: B33+EXBF3-D2-D1-21122+DBF2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.erronBlack.outlaw.bThreeThree,
    moves.erronBlack.outlaw.exBFThree,
    moves.erronBlack.outlaw.dTwo,
    moves.erronBlack.outlaw.dOne,
    moves.erronBlack.outlaw.twoOneOneTwoTwo,
    moves.erronBlack.outlaw.dBFTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const erronBlackOutlawCombos = {
  sourcePath: "characters/erron-black/outlaw.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    erronBlackOutlawStarter001Combo,
    erronBlackOutlawCommunityBeginner001Combo,
    erronBlackOutlawCommunityBeginner002Combo,
    erronBlackOutlawCommunityBeginner003Combo,
    erronBlackOutlawCommunityBeginner004Combo,
    erronBlackOutlawCommunityBeginner005Combo,
    erronBlackOutlawCommunityCorner018Combo,
    erronBlackOutlawCommunityCorner021Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
