import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.takeda;
const variationSlug = "shirai-ryu";
const variationId = `${characterId}:${variationSlug}` as const;

const takedaShiraiRyuStarter001Combo = {
  id: "takeda-shirai-ryu-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Takeda Shirai Ryu starter",
    fallback: "Takeda Shirai Ryu starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 31,
    meter: 1,
    position: "midscreen",
    starter: "Opening Assault",
    routeType: "metered",
    difficulty: "easy",
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
    moves.takeda.universal.openingAssault,
    moves.takeda.universal.risingAssault,
    moves.takeda.shiraiRyu.shiraiRyuTechnique,
    moves.takeda.universal.closingStrikeEnhanced,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const takedaShiraiRyuCommunityBeginner001Combo = {
  id: "takeda-shirai-ryu-community-beginner-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Takeda Shirai Ryu 112+BF2",
    fallback: "Takeda Shirai Ryu 112+BF2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 19,
    meter: 0,
    position: "midscreen",
    starter: "112+BF2",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 112+BF2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 112+BF2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [moves.takeda.shiraiRyu.oneOneTwo, moves.takeda.shiraiRyu.bFTwo],
} as const satisfies MkxlAuthoredSeededCombo;

const takedaShiraiRyuCommunityBeginner002Combo = {
  id: "takeda-shirai-ryu-community-beginner-002",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Takeda Shirai Ryu 112+EXDB1-DB3-D2",
    fallback: "Takeda Shirai Ryu 112+EXDB1-DB3-D2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 34,
    meter: 1,
    position: "midscreen",
    starter: "112+EXDB1",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 112+EXDB1-DB3-D2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 112+EXDB1-DB3-D2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.takeda.shiraiRyu.oneOneTwo,
    moves.takeda.shiraiRyu.exDBOne,
    moves.takeda.shiraiRyu.dBThree,
    moves.takeda.shiraiRyu.dTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const takedaShiraiRyuCommunityBeginner004Combo = {
  id: "takeda-shirai-ryu-community-beginner-004",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Takeda Shirai Ryu B3+EXDB1-DB3-D2",
    fallback: "Takeda Shirai Ryu B3+EXDB1-DB3-D2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 32,
    meter: 1,
    position: "midscreen",
    starter: "B3+EXDB1",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B3+EXDB1-DB3-D2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B3+EXDB1-DB3-D2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.takeda.shiraiRyu.bThree,
    moves.takeda.shiraiRyu.exDBOne,
    moves.takeda.shiraiRyu.dBThree,
    moves.takeda.shiraiRyu.dTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const takedaShiraiRyuCommunityBeginner005Combo = {
  id: "takeda-shirai-ryu-community-beginner-005",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Takeda Shirai Ryu B21+EXDB1-DB3-D2",
    fallback: "Takeda Shirai Ryu B21+EXDB1-DB3-D2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 34,
    meter: 1,
    position: "midscreen",
    starter: "B21+EXDB1",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B21+EXDB1-DB3-D2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B21+EXDB1-DB3-D2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.takeda.shiraiRyu.bTwoOne,
    moves.takeda.shiraiRyu.exDBOne,
    moves.takeda.shiraiRyu.dBThree,
    moves.takeda.shiraiRyu.dTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const takedaShiraiRyuCommunityCorner016Combo = {
  id: "takeda-shirai-ryu-community-corner-016",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Takeda Shirai Ryu 112+EXDB1-D2-D1-D1-D1-D1-112+BF1",
    fallback: "Takeda Shirai Ryu 112+EXDB1-D2-D1-D1-D1-D1-112+BF1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 37,
    meter: 1,
    position: "corner",
    starter: "112+EXDB1",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 112+EXDB1-D2-D1-D1-D1-D1-112+BF1.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: 112+EXDB1-D2-D1-D1-D1-D1-112+BF1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.takeda.shiraiRyu.oneOneTwo,
    moves.takeda.shiraiRyu.exDBOne,
    moves.takeda.shiraiRyu.dTwo,
    moves.takeda.shiraiRyu.dOne,
    moves.takeda.shiraiRyu.dOne,
    moves.takeda.shiraiRyu.dOne,
    moves.takeda.shiraiRyu.dOne,
    moves.takeda.shiraiRyu.oneOneTwo,
    moves.takeda.shiraiRyu.bFOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const takedaShiraiRyuCommunityCorner017Combo = {
  id: "takeda-shirai-ryu-community-corner-017",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Takeda Shirai Ryu F4+D1-D1-D1-D1-D1-112+BF1",
    fallback: "Takeda Shirai Ryu F4+D1-D1-D1-D1-D1-112+BF1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 27,
    meter: 0,
    position: "corner",
    starter: "F4+D1",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: F4+D1-D1-D1-D1-D1-112+BF1.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: F4+D1-D1-D1-D1-D1-112+BF1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.takeda.shiraiRyu.fFour,
    moves.takeda.shiraiRyu.dOne,
    moves.takeda.shiraiRyu.dOne,
    moves.takeda.shiraiRyu.dOne,
    moves.takeda.shiraiRyu.dOne,
    moves.takeda.shiraiRyu.dOne,
    moves.takeda.shiraiRyu.oneOneTwo,
    moves.takeda.shiraiRyu.bFOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const takedaShiraiRyuCommunityCorner018Combo = {
  id: "takeda-shirai-ryu-community-corner-018",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Takeda Shirai Ryu B3+EXDB1-D2-D1-D1-D1-D1-112+BF1",
    fallback: "Takeda Shirai Ryu B3+EXDB1-D2-D1-D1-D1-D1-112+BF1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 36,
    meter: 1,
    position: "corner",
    starter: "B3+EXDB1",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B3+EXDB1-D2-D1-D1-D1-D1-112+BF1.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: B3+EXDB1-D2-D1-D1-D1-D1-112+BF1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.takeda.shiraiRyu.bThree,
    moves.takeda.shiraiRyu.exDBOne,
    moves.takeda.shiraiRyu.dTwo,
    moves.takeda.shiraiRyu.dOne,
    moves.takeda.shiraiRyu.dOne,
    moves.takeda.shiraiRyu.dOne,
    moves.takeda.shiraiRyu.dOne,
    moves.takeda.shiraiRyu.oneOneTwo,
    moves.takeda.shiraiRyu.bFOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const takedaShiraiRyuCommunityCorner019Combo = {
  id: "takeda-shirai-ryu-community-corner-019",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Takeda Shirai Ryu B21+EXDB1-D2-D1-D1-D1-D1-112+BF1",
    fallback: "Takeda Shirai Ryu B21+EXDB1-D2-D1-D1-D1-D1-112+BF1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 37,
    meter: 1,
    position: "corner",
    starter: "B21+EXDB1",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B21+EXDB1-D2-D1-D1-D1-D1-112+BF1.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: B21+EXDB1-D2-D1-D1-D1-D1-112+BF1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.takeda.shiraiRyu.bTwoOne,
    moves.takeda.shiraiRyu.exDBOne,
    moves.takeda.shiraiRyu.dTwo,
    moves.takeda.shiraiRyu.dOne,
    moves.takeda.shiraiRyu.dOne,
    moves.takeda.shiraiRyu.dOne,
    moves.takeda.shiraiRyu.dOne,
    moves.takeda.shiraiRyu.oneOneTwo,
    moves.takeda.shiraiRyu.bFOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const takedaShiraiRyuCombos = {
  sourcePath: "characters/takeda/shirai-ryu.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    takedaShiraiRyuStarter001Combo,
    takedaShiraiRyuCommunityBeginner001Combo,
    takedaShiraiRyuCommunityBeginner002Combo,
    takedaShiraiRyuCommunityBeginner004Combo,
    takedaShiraiRyuCommunityBeginner005Combo,
    takedaShiraiRyuCommunityCorner016Combo,
    takedaShiraiRyuCommunityCorner017Combo,
    takedaShiraiRyuCommunityCorner018Combo,
    takedaShiraiRyuCommunityCorner019Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
