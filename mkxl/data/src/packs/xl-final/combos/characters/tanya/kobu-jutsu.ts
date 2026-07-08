import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.tanya;
const variationSlug = "kobu-jutsu";
const variationId = `${characterId}:${variationSlug}` as const;

const tanyaKobuJutsuStarter001Combo = {
  id: "tanya-kobu-jutsu-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Tanya Kobu Jutsu starter",
    fallback: "Tanya Kobu Jutsu starter",
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
    transitions.tanya.universal.openingAssault,
    transitions.tanya.universal.risingAssault,
    transitions.tanya.kobuJutsu.kobuJutsuTechnique,
    transitions.tanya.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const tanyaKobuJutsuCommunityBeginner001Combo = {
  id: "tanya-kobu-jutsu-community-beginner-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Tanya Kobu Jutsu 2U3-F43",
    fallback: "Tanya Kobu Jutsu 2U3-F43",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 20,
    meter: 0,
    position: "midscreen",
    starter: "2U3",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 2U3-F43.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 2U3-F43.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [transitions.tanya.kobuJutsu.twoUThree, transitions.tanya.kobuJutsu.fFourThree],
} as const satisfies MkxlAuthoredSeededCombo;

const tanyaKobuJutsuCommunityBeginner002Combo = {
  id: "tanya-kobu-jutsu-community-beginner-002",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Tanya Kobu Jutsu 112+EXDF1-2U3-F43",
    fallback: "Tanya Kobu Jutsu 112+EXDF1-2U3-F43",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 27,
    meter: 1,
    position: "midscreen",
    starter: "112+EXDF1",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 112+EXDF1-2U3-F43.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 112+EXDF1-2U3-F43.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.tanya.kobuJutsu.oneOneTwoIntoExDFOne,
    transitions.tanya.kobuJutsu.twoUThree,
    transitions.tanya.kobuJutsu.fFourThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const tanyaKobuJutsuCommunityBeginner004Combo = {
  id: "tanya-kobu-jutsu-community-beginner-004",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Tanya Kobu Jutsu B31+EXDF1-2U3-F43",
    fallback: "Tanya Kobu Jutsu B31+EXDF1-2U3-F43",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 26,
    meter: 1,
    position: "midscreen",
    starter: "B31+EXDF1",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B31+EXDF1-2U3-F43.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B31+EXDF1-2U3-F43.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.tanya.kobuJutsu.bThreeOneIntoExDFOne,
    transitions.tanya.kobuJutsu.twoUThree,
    transitions.tanya.kobuJutsu.fFourThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const tanyaKobuJutsuCommunityBeginner005Combo = {
  id: "tanya-kobu-jutsu-community-beginner-005",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Tanya Kobu Jutsu F2+EXDF1-2U3-F43",
    fallback: "Tanya Kobu Jutsu F2+EXDF1-2U3-F43",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 27,
    meter: 1,
    position: "midscreen",
    starter: "F2+EXDF1",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F2+EXDF1-2U3-F43.",
    fallback: "Community combo source route. Section: beginner. Raw notation: F2+EXDF1-2U3-F43.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.tanya.kobuJutsu.fTwoIntoExDFOne,
    transitions.tanya.kobuJutsu.twoUThree,
    transitions.tanya.kobuJutsu.fFourThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const tanyaKobuJutsuCommunityOptimal007Combo = {
  id: "tanya-kobu-jutsu-community-optimal-007",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Tanya Kobu Jutsu 2U3-4+DF2-DF1-DF2",
    fallback: "Tanya Kobu Jutsu 2U3-4+DF2-DF1-DF2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 24,
    meter: 0,
    position: "midscreen",
    starter: "2U3",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "optimal"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: 2U3-4+DF2-DF1-DF2.",
    fallback: "Community combo source route. Section: optimal. Raw notation: 2U3-4+DF2-DF1-DF2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.tanya.kobuJutsu.twoUThree,
    transitions.tanya.kobuJutsu.fourIntoDFTwo,
    transitions.tanya.kobuJutsu.dFOne,
    transitions.tanya.kobuJutsu.dFTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const tanyaKobuJutsuCommunityCorner016Combo = {
  id: "tanya-kobu-jutsu-community-corner-016",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Tanya Kobu Jutsu 2U3-4-4-112+DF2-DF1-DF2",
    fallback: "Tanya Kobu Jutsu 2U3-4-4-112+DF2-DF1-DF2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 33,
    meter: 0,
    position: "corner",
    starter: "2U3",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 2U3-4-4-112+DF2-DF1-DF2.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: 2U3-4-4-112+DF2-DF1-DF2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.tanya.kobuJutsu.twoUThree,
    transitions.tanya.kobuJutsu.four,
    transitions.tanya.kobuJutsu.four,
    transitions.tanya.kobuJutsu.oneOneTwoIntoDFTwo,
    transitions.tanya.kobuJutsu.dFOne,
    transitions.tanya.kobuJutsu.dFTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const tanyaKobuJutsuCommunityCorner017Combo = {
  id: "tanya-kobu-jutsu-community-corner-017",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Tanya Kobu Jutsu 112+DF2-DF1-EXDF2-4-4-11-112+DF2-DF1-DF2",
    fallback: "Tanya Kobu Jutsu 112+DF2-DF1-EXDF2-4-4-11-112+DF2-DF1-DF2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 38,
    meter: 1,
    position: "corner",
    starter: "112+DF2",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 112+DF2-DF1-EXDF2-4-4-11-112+DF2-DF1-DF2.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: 112+DF2-DF1-EXDF2-4-4-11-112+DF2-DF1-DF2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.tanya.kobuJutsu.oneOneTwoIntoDFTwo,
    transitions.tanya.kobuJutsu.dFOne,
    transitions.tanya.kobuJutsu.exDFTwo,
    transitions.tanya.kobuJutsu.four,
    transitions.tanya.kobuJutsu.four,
    transitions.tanya.kobuJutsu.oneOne,
    transitions.tanya.kobuJutsu.oneOneTwoIntoDFTwo,
    transitions.tanya.kobuJutsu.dFOne,
    transitions.tanya.kobuJutsu.dFTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const tanyaKobuJutsuCommunityCorner018Combo = {
  id: "tanya-kobu-jutsu-community-corner-018",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Tanya Kobu Jutsu 112+DF2-DF1-EXDF2-4-4-4+EXBF4-4+DF2-DF1-DF2",
    fallback: "Tanya Kobu Jutsu 112+DF2-DF1-EXDF2-4-4-4+EXBF4-4+DF2-DF1-DF2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 41,
    meter: 2,
    position: "corner",
    starter: "112+DF2",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 112+DF2-DF1-EXDF2-4-4-4+EXBF4-4+DF2-DF1-DF2.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: 112+DF2-DF1-EXDF2-4-4-4+EXBF4-4+DF2-DF1-DF2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.tanya.kobuJutsu.oneOneTwoIntoDFTwo,
    transitions.tanya.kobuJutsu.dFOne,
    transitions.tanya.kobuJutsu.exDFTwo,
    transitions.tanya.kobuJutsu.four,
    transitions.tanya.kobuJutsu.four,
    transitions.tanya.kobuJutsu.fourIntoExBFFour,
    transitions.tanya.kobuJutsu.fourIntoDFTwo,
    transitions.tanya.kobuJutsu.dFOne,
    transitions.tanya.kobuJutsu.dFTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const tanyaKobuJutsuCommunityCorner019Combo = {
  id: "tanya-kobu-jutsu-community-corner-019",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Tanya Kobu Jutsu B31+DF2-DF1-EXDF2-4-4-11-112+DF2-DF1-DF2",
    fallback: "Tanya Kobu Jutsu B31+DF2-DF1-EXDF2-4-4-11-112+DF2-DF1-DF2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 37,
    meter: 1,
    position: "corner",
    starter: "B31+DF2",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B31+DF2-DF1-EXDF2-4-4-11-112+DF2-DF1-DF2.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: B31+DF2-DF1-EXDF2-4-4-11-112+DF2-DF1-DF2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.tanya.kobuJutsu.bThreeOneIntoDFTwo,
    transitions.tanya.kobuJutsu.dFOne,
    transitions.tanya.kobuJutsu.exDFTwo,
    transitions.tanya.kobuJutsu.four,
    transitions.tanya.kobuJutsu.four,
    transitions.tanya.kobuJutsu.oneOne,
    transitions.tanya.kobuJutsu.oneOneTwoIntoDFTwo,
    transitions.tanya.kobuJutsu.dFOne,
    transitions.tanya.kobuJutsu.dFTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const tanyaKobuJutsuCombos = {
  sourcePath: "characters/tanya/kobu-jutsu.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    tanyaKobuJutsuStarter001Combo,
    tanyaKobuJutsuCommunityBeginner001Combo,
    tanyaKobuJutsuCommunityBeginner002Combo,
    tanyaKobuJutsuCommunityBeginner004Combo,
    tanyaKobuJutsuCommunityBeginner005Combo,
    tanyaKobuJutsuCommunityOptimal007Combo,
    tanyaKobuJutsuCommunityCorner016Combo,
    tanyaKobuJutsuCommunityCorner017Combo,
    tanyaKobuJutsuCommunityCorner018Combo,
    tanyaKobuJutsuCommunityCorner019Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
