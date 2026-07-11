import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.kano;
const variationSlug = "cutthroat";
const variationId = `${characterId}:${variationSlug}` as const;

const kanoCutthroatStarter001Combo = {
  id: "kano-cutthroat-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kano Cutthroat starter",
    fallback: "Kano Cutthroat starter",
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
    moves.kano.universal.openingAssault,
    moves.kano.universal.risingAssault,
    moves.kano.cutthroat.cutthroatTechnique,
    moves.kano.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kanoCutthroatCommunityBeginner003Combo = {
  id: "kano-cutthroat-community-beginner-003",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kano Cutthroat F212-F212-F4+BF3",
    fallback: "Kano Cutthroat F212-F212-F4+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 29,
    meter: 0,
    position: "midscreen",
    starter: "F212",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F212-F212-F4+BF3.",
    fallback: "Community combo source route. Section: beginner. Raw notation: F212-F212-F4+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.kano.cutthroat.fTwoOneTwo,
    moves.kano.cutthroat.fTwoOneTwo,
    moves.kano.cutthroat.fFour,
    moves.kano.cutthroat.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kanoCutthroatCommunityBeginner006Combo = {
  id: "kano-cutthroat-community-beginner-006",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kano Cutthroat 112+EXDD3-F212-F212-F4+BF3",
    fallback: "Kano Cutthroat 112+EXDD3-F212-F212-F4+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 40,
    meter: 1,
    position: "midscreen",
    starter: "112+EXDD3",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 112+EXDD3-F212-F212-F4+BF3.",
    fallback:
      "Community combo source route. Section: beginner. Raw notation: 112+EXDD3-F212-F212-F4+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.kano.cutthroat.oneOneTwo,
    moves.kano.cutthroat.exDDThree,
    moves.kano.cutthroat.fTwoOneTwo,
    moves.kano.cutthroat.fTwoOneTwo,
    moves.kano.cutthroat.fFour,
    moves.kano.cutthroat.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kanoCutthroatCommunityOptimal008Combo = {
  id: "kano-cutthroat-community-optimal-008",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kano Cutthroat 112+EXDB1-2+DB1-112+EXDB1-4+BF3",
    fallback: "Kano Cutthroat 112+EXDB1-2+DB1-112+EXDB1-4+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 44,
    meter: 2,
    position: "midscreen",
    starter: "112+EXDB1",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "optimal", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: 112+EXDB1-2+DB1-112+EXDB1-4+BF3.",
    fallback:
      "Community combo source route. Section: optimal. Raw notation: 112+EXDB1-2+DB1-112+EXDB1-4+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.kano.cutthroat.oneOneTwo,
    moves.kano.cutthroat.exDBOne,
    moves.kano.cutthroat.two,
    moves.kano.cutthroat.dBOne,
    moves.kano.cutthroat.oneOneTwo,
    moves.kano.cutthroat.exDBOne,
    moves.kano.cutthroat.four,
    moves.kano.cutthroat.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kanoCutthroatCommunityCorner016Combo = {
  id: "kano-cutthroat-community-corner-016",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kano Cutthroat 112+EXDD3-B312-B312-112+BF3",
    fallback: "Kano Cutthroat 112+EXDD3-B312-B312-112+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 50,
    meter: 1,
    position: "corner",
    starter: "112+EXDD3",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 112+EXDD3-B312-B312-112+BF3.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: 112+EXDD3-B312-B312-112+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.kano.cutthroat.oneOneTwo,
    moves.kano.cutthroat.exDDThree,
    moves.kano.cutthroat.bThreeOneTwo,
    moves.kano.cutthroat.bThreeOneTwo,
    moves.kano.cutthroat.oneOneTwo,
    moves.kano.cutthroat.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kanoCutthroatCommunityCorner017Combo = {
  id: "kano-cutthroat-community-corner-017",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kano Cutthroat 112+EXDD3-B312-32-112+BF3",
    fallback: "Kano Cutthroat 112+EXDD3-B312-32-112+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 46,
    meter: 1,
    position: "corner",
    starter: "112+EXDD3",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 112+EXDD3-B312-32-112+BF3.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: 112+EXDD3-B312-32-112+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.kano.cutthroat.oneOneTwo,
    moves.kano.cutthroat.exDDThree,
    moves.kano.cutthroat.bThreeOneTwo,
    moves.kano.cutthroat.threeTwo,
    moves.kano.cutthroat.oneOneTwo,
    moves.kano.cutthroat.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kanoCutthroatCommunityCorner021Combo = {
  id: "kano-cutthroat-community-corner-021",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kano Cutthroat B312-B312-112+BF3",
    fallback: "Kano Cutthroat B312-B312-112+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 37,
    meter: 0,
    position: "corner",
    starter: "B312",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B312-B312-112+BF3.",
    fallback: "Community combo source route. Section: corner. Raw notation: B312-B312-112+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.kano.cutthroat.bThreeOneTwo,
    moves.kano.cutthroat.bThreeOneTwo,
    moves.kano.cutthroat.oneOneTwo,
    moves.kano.cutthroat.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kanoCutthroatCommunityCorner022Combo = {
  id: "kano-cutthroat-community-corner-022",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kano Cutthroat B121+DF2-D3-D3-D3-112+BF3",
    fallback: "Kano Cutthroat B121+DF2-D3-D3-D3-112+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 32,
    meter: 0,
    position: "corner",
    starter: "B121+DF2",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B121+DF2-D3-D3-D3-112+BF3.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: B121+DF2-D3-D3-D3-112+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.kano.cutthroat.bOneTwoOne,
    moves.kano.cutthroat.dFTwo,
    moves.kano.cutthroat.dThree,
    moves.kano.cutthroat.dThree,
    moves.kano.cutthroat.dThree,
    moves.kano.cutthroat.oneOneTwo,
    moves.kano.cutthroat.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const kanoCutthroatCombos = {
  sourcePath: "characters/kano/cutthroat.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    kanoCutthroatStarter001Combo,
    kanoCutthroatCommunityBeginner003Combo,
    kanoCutthroatCommunityBeginner006Combo,
    kanoCutthroatCommunityOptimal008Combo,
    kanoCutthroatCommunityCorner016Combo,
    kanoCutthroatCommunityCorner017Combo,
    kanoCutthroatCommunityCorner021Combo,
    kanoCutthroatCommunityCorner022Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
