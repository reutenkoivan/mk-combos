import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.liuKang;
const variationSlug = "flame-fist";
const variationId = `${characterId}:${variationSlug}` as const;

const liuKangFlameFistStarter001Combo = {
  id: "liu-kang-flame-fist-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Liu Kang Flame Fist starter",
    fallback: "Liu Kang Flame Fist starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 28,
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
    moves.liuKang.universal.openingAssault,
    moves.liuKang.universal.risingAssault,
    moves.liuKang.flameFist.flameFistTechnique,
    moves.liuKang.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const liuKangFlameFistCommunityBeginner001Combo = {
  id: "liu-kang-flame-fist-community-beginner-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Liu Kang Flame Fist 112+FBF4-BF3",
    fallback: "Liu Kang Flame Fist 112+FBF4-BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 24,
    meter: 0,
    position: "midscreen",
    starter: "112+FBF4",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 112+FBF4-BF3.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 112+FBF4-BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.liuKang.flameFist.oneOneTwo,
    moves.liuKang.flameFist.fBFFour,
    moves.liuKang.flameFist.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const liuKangFlameFistCommunityBeginner002Combo = {
  id: "liu-kang-flame-fist-community-beginner-002",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Liu Kang Flame Fist F44+FBF4-BF3",
    fallback: "Liu Kang Flame Fist F44+FBF4-BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 25,
    meter: 0,
    position: "midscreen",
    starter: "F44+FBF4",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F44+FBF4-BF3.",
    fallback: "Community combo source route. Section: beginner. Raw notation: F44+FBF4-BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.liuKang.flameFist.fFourFour,
    moves.liuKang.flameFist.fBFFour,
    moves.liuKang.flameFist.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const liuKangFlameFistCommunityBeginner003Combo = {
  id: "liu-kang-flame-fist-community-beginner-003",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Liu Kang Flame Fist 113-B34-D2",
    fallback: "Liu Kang Flame Fist 113-B34-D2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 28,
    meter: 0,
    position: "midscreen",
    starter: "113",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 113-B34-D2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 113-B34-D2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.liuKang.flameFist.oneOneThree,
    moves.liuKang.flameFist.bThreeFour,
    moves.liuKang.flameFist.dTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const liuKangFlameFistCommunityBeginner004Combo = {
  id: "liu-kang-flame-fist-community-beginner-004",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Liu Kang Flame Fist B34-D2",
    fallback: "Liu Kang Flame Fist B34-D2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 24,
    meter: 0,
    position: "midscreen",
    starter: "B34",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B34-D2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B34-D2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [moves.liuKang.flameFist.bThreeFour, moves.liuKang.flameFist.dTwo],
} as const satisfies MkxlAuthoredSeededCombo;

const liuKangFlameFistCommunityBeginner005Combo = {
  id: "liu-kang-flame-fist-community-beginner-005",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Liu Kang Flame Fist B12-FBF4-BF3",
    fallback: "Liu Kang Flame Fist B12-FBF4-BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 22,
    meter: 0,
    position: "midscreen",
    starter: "B12",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B12-FBF4-BF3.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B12-FBF4-BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.liuKang.flameFist.bOneTwo,
    moves.liuKang.flameFist.fBFFour,
    moves.liuKang.flameFist.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const liuKangFlameFistCommunityOptimal006Combo = {
  id: "liu-kang-flame-fist-community-optimal-006",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Liu Kang Flame Fist 113-B34-B12+FBF4-BF3",
    fallback: "Liu Kang Flame Fist 113-B34-B12+FBF4-BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 31,
    meter: 0,
    position: "midscreen",
    starter: "113",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "optimal"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: 113-B34-B12+FBF4-BF3.",
    fallback: "Community combo source route. Section: optimal. Raw notation: 113-B34-B12+FBF4-BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.liuKang.flameFist.oneOneThree,
    moves.liuKang.flameFist.bThreeFour,
    moves.liuKang.flameFist.bOneTwo,
    moves.liuKang.flameFist.fBFFour,
    moves.liuKang.flameFist.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const liuKangFlameFistCommunityOptimal007Combo = {
  id: "liu-kang-flame-fist-community-optimal-007",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Liu Kang Flame Fist B12-EXDD1-113-B34-B12-FBF4-BF3",
    fallback: "Liu Kang Flame Fist B12-EXDD1-113-B34-B12-FBF4-BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 34,
    meter: 1,
    position: "midscreen",
    starter: "B12",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "optimal", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: B12-EXDD1-113-B34-B12-FBF4-BF3.",
    fallback:
      "Community combo source route. Section: optimal. Raw notation: B12-EXDD1-113-B34-B12-FBF4-BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.liuKang.flameFist.bOneTwo,
    moves.liuKang.flameFist.exDDOne,
    moves.liuKang.flameFist.oneOneThree,
    moves.liuKang.flameFist.bThreeFour,
    moves.liuKang.flameFist.bOneTwo,
    moves.liuKang.flameFist.fBFFour,
    moves.liuKang.flameFist.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const liuKangFlameFistCommunityOptimal008Combo = {
  id: "liu-kang-flame-fist-community-optimal-008",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Liu Kang Flame Fist 112+EXDD1-F44+FBF4-BF3",
    fallback: "Liu Kang Flame Fist 112+EXDD1-F44+FBF4-BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 31,
    meter: 1,
    position: "midscreen",
    starter: "112+EXDD1",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "optimal", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: 112+EXDD1-F44+FBF4-BF3.",
    fallback:
      "Community combo source route. Section: optimal. Raw notation: 112+EXDD1-F44+FBF4-BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.liuKang.flameFist.oneOneTwo,
    moves.liuKang.flameFist.exDDOne,
    moves.liuKang.flameFist.fFourFour,
    moves.liuKang.flameFist.fBFFour,
    moves.liuKang.flameFist.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const liuKangFlameFistCommunityOptimal009Combo = {
  id: "liu-kang-flame-fist-community-optimal-009",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Liu Kang Flame Fist F44+FBF4-XRAY",
    fallback: "Liu Kang Flame Fist F44+FBF4-XRAY",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 44,
    meter: 3,
    position: "midscreen",
    starter: "F44+FBF4",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "optimal", "metered", "xray"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: F44+FBF4-XRAY.",
    fallback: "Community combo source route. Section: optimal. Raw notation: F44+FBF4-XRAY.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.liuKang.flameFist.fFourFour,
    moves.liuKang.flameFist.fBFFour,
    moves.general.universal.xray,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const liuKangFlameFistCommunityOptimal010Combo = {
  id: "liu-kang-flame-fist-community-optimal-010",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Liu Kang Flame Fist F12+EXDD1-113-B34-B12+FBF4-BF3",
    fallback: "Liu Kang Flame Fist F12+EXDD1-113-B34-B12+FBF4-BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 33,
    meter: 1,
    position: "midscreen",
    starter: "F12+EXDD1",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "optimal", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: F12+EXDD1-113-B34-B12+FBF4-BF3.",
    fallback:
      "Community combo source route. Section: optimal. Raw notation: F12+EXDD1-113-B34-B12+FBF4-BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.liuKang.flameFist.fOneTwo,
    moves.liuKang.flameFist.exDDOne,
    moves.liuKang.flameFist.oneOneThree,
    moves.liuKang.flameFist.bThreeFour,
    moves.liuKang.flameFist.bOneTwo,
    moves.liuKang.flameFist.fBFFour,
    moves.liuKang.flameFist.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const liuKangFlameFistCommunityCorner011Combo = {
  id: "liu-kang-flame-fist-community-corner-011",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Liu Kang Flame Fist F213+EXBF1-D1-D1-F213+FBF4-BF3",
    fallback: "Liu Kang Flame Fist F213+EXBF1-D1-D1-F213+FBF4-BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 39,
    meter: 1,
    position: "corner",
    starter: "F213+EXBF1",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: F213+EXBF1-D1-D1-F213+FBF4-BF3.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: F213+EXBF1-D1-D1-F213+FBF4-BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.liuKang.flameFist.fTwoOneThree,
    moves.liuKang.flameFist.exBFOne,
    moves.liuKang.flameFist.dOne,
    moves.liuKang.flameFist.dOne,
    moves.liuKang.flameFist.fTwoOneThree,
    moves.liuKang.flameFist.fBFFour,
    moves.liuKang.flameFist.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const liuKangFlameFistCommunityCorner012Combo = {
  id: "liu-kang-flame-fist-community-corner-012",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Liu Kang Flame Fist F213+DB2-D1-D1-F213+FBF4-BF3",
    fallback: "Liu Kang Flame Fist F213+DB2-D1-D1-F213+FBF4-BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 36,
    meter: 0,
    position: "corner",
    starter: "F213+DB2",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: F213+DB2-D1-D1-F213+FBF4-BF3.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: F213+DB2-D1-D1-F213+FBF4-BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.liuKang.flameFist.fTwoOneThree,
    moves.liuKang.flameFist.dBTwo,
    moves.liuKang.flameFist.dOne,
    moves.liuKang.flameFist.dOne,
    moves.liuKang.flameFist.fTwoOneThree,
    moves.liuKang.flameFist.fBFFour,
    moves.liuKang.flameFist.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const liuKangFlameFistCommunityCorner013Combo = {
  id: "liu-kang-flame-fist-community-corner-013",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Liu Kang Flame Fist 112-EXDD1-F213+DB2-D1-D1-F213+FBF4-BF3",
    fallback: "Liu Kang Flame Fist 112-EXDD1-F213+DB2-D1-D1-F213+FBF4-BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 40,
    meter: 1,
    position: "corner",
    starter: "112",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 112-EXDD1-F213+DB2-D1-D1-F213+FBF4-BF3.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: 112-EXDD1-F213+DB2-D1-D1-F213+FBF4-BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.liuKang.flameFist.oneOneTwo,
    moves.liuKang.flameFist.exDDOne,
    moves.liuKang.flameFist.fTwoOneThree,
    moves.liuKang.flameFist.dBTwo,
    moves.liuKang.flameFist.dOne,
    moves.liuKang.flameFist.dOne,
    moves.liuKang.flameFist.fTwoOneThree,
    moves.liuKang.flameFist.fBFFour,
    moves.liuKang.flameFist.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const liuKangFlameFistCommunityCorner014Combo = {
  id: "liu-kang-flame-fist-community-corner-014",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Liu Kang Flame Fist F44+EXFBF4-DB2-D1-D1-F213+FBF4-BF3",
    fallback: "Liu Kang Flame Fist F44+EXFBF4-DB2-D1-D1-F213+FBF4-BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 41,
    meter: 1,
    position: "corner",
    starter: "F44+EXFBF4",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: F44+EXFBF4-DB2-D1-D1-F213+FBF4-BF3.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: F44+EXFBF4-DB2-D1-D1-F213+FBF4-BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.liuKang.flameFist.fFourFour,
    moves.liuKang.flameFist.exFBFFour,
    moves.liuKang.flameFist.dBTwo,
    moves.liuKang.flameFist.dOne,
    moves.liuKang.flameFist.dOne,
    moves.liuKang.flameFist.fTwoOneThree,
    moves.liuKang.flameFist.fBFFour,
    moves.liuKang.flameFist.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const liuKangFlameFistCommunityCorner015Combo = {
  id: "liu-kang-flame-fist-community-corner-015",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Liu Kang Flame Fist F44+EXBF1-D1-D1-D1-F213+FBF4-BF3",
    fallback: "Liu Kang Flame Fist F44+EXBF1-D1-D1-D1-F213+FBF4-BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 44,
    meter: 1,
    position: "corner",
    starter: "F44+EXBF1",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: F44+EXBF1-D1-D1-D1-F213+FBF4-BF3.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: F44+EXBF1-D1-D1-D1-F213+FBF4-BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.liuKang.flameFist.fFourFour,
    moves.liuKang.flameFist.exBFOne,
    moves.liuKang.flameFist.dOne,
    moves.liuKang.flameFist.dOne,
    moves.liuKang.flameFist.dOne,
    moves.liuKang.flameFist.fTwoOneThree,
    moves.liuKang.flameFist.fBFFour,
    moves.liuKang.flameFist.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const liuKangFlameFistCommunityCorner016Combo = {
  id: "liu-kang-flame-fist-community-corner-016",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Liu Kang Flame Fist F44+EXFBF4-EXBF1-D1-D1-D1-F213+FBF4-BF3",
    fallback: "Liu Kang Flame Fist F44+EXFBF4-EXBF1-D1-D1-D1-F213+FBF4-BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 46,
    meter: 2,
    position: "corner",
    starter: "F44+EXFBF4",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: F44+EXFBF4-EXBF1-D1-D1-D1-F213+FBF4-BF3.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: F44+EXFBF4-EXBF1-D1-D1-D1-F213+FBF4-BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.liuKang.flameFist.fFourFour,
    moves.liuKang.flameFist.exFBFFour,
    moves.liuKang.flameFist.exBFOne,
    moves.liuKang.flameFist.dOne,
    moves.liuKang.flameFist.dOne,
    moves.liuKang.flameFist.dOne,
    moves.liuKang.flameFist.fTwoOneThree,
    moves.liuKang.flameFist.fBFFour,
    moves.liuKang.flameFist.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const liuKangFlameFistCommunityCorner017Combo = {
  id: "liu-kang-flame-fist-community-corner-017",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Liu Kang Flame Fist DD1-F44+EXFBF4-EXBF1-D1-D1-D1-D1-F213+FBF4-BF3",
    fallback: "Liu Kang Flame Fist DD1-F44+EXFBF4-EXBF1-D1-D1-D1-D1-F213+FBF4-BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 59,
    meter: 2,
    position: "corner",
    starter: "DD1",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: DD1-F44+EXFBF4-EXBF1-D1-D1-D1-D1-F213+FBF4-BF3.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: DD1-F44+EXFBF4-EXBF1-D1-D1-D1-D1-F213+FBF4-BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.liuKang.flameFist.dDOne,
    moves.liuKang.flameFist.fFourFour,
    moves.liuKang.flameFist.exFBFFour,
    moves.liuKang.flameFist.exBFOne,
    moves.liuKang.flameFist.dOne,
    moves.liuKang.flameFist.dOne,
    moves.liuKang.flameFist.dOne,
    moves.liuKang.flameFist.dOne,
    moves.liuKang.flameFist.fTwoOneThree,
    moves.liuKang.flameFist.fBFFour,
    moves.liuKang.flameFist.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const liuKangFlameFistCommunityCorner018Combo = {
  id: "liu-kang-flame-fist-community-corner-018",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Liu Kang Flame Fist 113-B34-D1-D1-F213+FBF4-BF3",
    fallback: "Liu Kang Flame Fist 113-B34-D1-D1-F213+FBF4-BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 35,
    meter: 0,
    position: "corner",
    starter: "113",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 113-B34-D1-D1-F213+FBF4-BF3.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: 113-B34-D1-D1-F213+FBF4-BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.liuKang.flameFist.oneOneThree,
    moves.liuKang.flameFist.bThreeFour,
    moves.liuKang.flameFist.dOne,
    moves.liuKang.flameFist.dOne,
    moves.liuKang.flameFist.fTwoOneThree,
    moves.liuKang.flameFist.fBFFour,
    moves.liuKang.flameFist.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const liuKangFlameFistCommunityCorner019Combo = {
  id: "liu-kang-flame-fist-community-corner-019",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Liu Kang Flame Fist F12+EXDD1-113-B34-D1-D1-F213+FBF4-BF3",
    fallback: "Liu Kang Flame Fist F12+EXDD1-113-B34-D1-D1-F213+FBF4-BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 36,
    meter: 1,
    position: "corner",
    starter: "F12+EXDD1",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: F12+EXDD1-113-B34-D1-D1-F213+FBF4-BF3.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: F12+EXDD1-113-B34-D1-D1-F213+FBF4-BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.liuKang.flameFist.fOneTwo,
    moves.liuKang.flameFist.exDDOne,
    moves.liuKang.flameFist.oneOneThree,
    moves.liuKang.flameFist.bThreeFour,
    moves.liuKang.flameFist.dOne,
    moves.liuKang.flameFist.dOne,
    moves.liuKang.flameFist.fTwoOneThree,
    moves.liuKang.flameFist.fBFFour,
    moves.liuKang.flameFist.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const liuKangFlameFistCombos = {
  sourcePath: "characters/liu-kang/flame-fist.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    liuKangFlameFistStarter001Combo,
    liuKangFlameFistCommunityBeginner001Combo,
    liuKangFlameFistCommunityBeginner002Combo,
    liuKangFlameFistCommunityBeginner003Combo,
    liuKangFlameFistCommunityBeginner004Combo,
    liuKangFlameFistCommunityBeginner005Combo,
    liuKangFlameFistCommunityOptimal006Combo,
    liuKangFlameFistCommunityOptimal007Combo,
    liuKangFlameFistCommunityOptimal008Combo,
    liuKangFlameFistCommunityOptimal009Combo,
    liuKangFlameFistCommunityOptimal010Combo,
    liuKangFlameFistCommunityCorner011Combo,
    liuKangFlameFistCommunityCorner012Combo,
    liuKangFlameFistCommunityCorner013Combo,
    liuKangFlameFistCommunityCorner014Combo,
    liuKangFlameFistCommunityCorner015Combo,
    liuKangFlameFistCommunityCorner016Combo,
    liuKangFlameFistCommunityCorner017Combo,
    liuKangFlameFistCommunityCorner018Combo,
    liuKangFlameFistCommunityCorner019Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
