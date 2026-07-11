import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.kungJin;
const variationSlug = "bojutsu";
const variationId = `${characterId}:${variationSlug}` as const;

const kungJinBojutsuStarter001Combo = {
  id: "kung-jin-bojutsu-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kung Jin Bojutsu starter",
    fallback: "Kung Jin Bojutsu starter",
  },
  stageContext: {
    kind: "stageSpecific",
    stageId: "quan-chi-fortress",
    zoneId: "quan-chi-fortress:mid",
    segmentId: "quan-chi-fortress:mid-screen",
    interactableIds: ["quan-chi-fortress:position-escape"],
  },
  metadata: {
    damage: 29,
    meter: 0,
    position: "corner",
    starter: "Opening Assault",
    routeType: "stage",
    difficulty: "easy",
    tags: ["starter", "stage"],
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
    moves.kungJin.universal.openingAssault,
    moves.kungJin.universal.risingAssault,
    moves.kungJin.bojutsu.bojutsuTechnique,
    moves.kungJin.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kungJinBojutsuCommunityBeginner002Combo = {
  id: "kung-jin-bojutsu-community-beginner-002",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kung Jin Bojutsu 221+DB3",
    fallback: "Kung Jin Bojutsu 221+DB3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 26,
    meter: 0,
    position: "midscreen",
    starter: "221+DB3",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 221+DB3.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 221+DB3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [moves.kungJin.bojutsu.twoTwoOne, moves.kungJin.bojutsu.dBThree],
} as const satisfies MkxlAuthoredSeededCombo;

const kungJinBojutsuCommunityCorner014Combo = {
  id: "kung-jin-bojutsu-community-corner-014",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kung Jin Bojutsu 111+BF4-4+DB1-343+DB3",
    fallback: "Kung Jin Bojutsu 111+BF4-4+DB1-343+DB3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 36,
    meter: 0,
    position: "corner",
    starter: "111+BF4",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 111+BF4-4+DB1-343+DB3.",
    fallback: "Community combo source route. Section: corner. Raw notation: 111+BF4-4+DB1-343+DB3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.kungJin.bojutsu.oneOneOne,
    moves.kungJin.bojutsu.bFFour,
    moves.kungJin.bojutsu.four,
    moves.kungJin.bojutsu.dBOne,
    moves.kungJin.bojutsu.threeFourThree,
    moves.kungJin.bojutsu.dBThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kungJinBojutsuCommunityCorner015Combo = {
  id: "kung-jin-bojutsu-community-corner-015",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kung Jin Bojutsu B14+BF4-4+DB1-343+DB3",
    fallback: "Kung Jin Bojutsu B14+BF4-4+DB1-343+DB3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 33,
    meter: 0,
    position: "corner",
    starter: "B14+BF4",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B14+BF4-4+DB1-343+DB3.",
    fallback: "Community combo source route. Section: corner. Raw notation: B14+BF4-4+DB1-343+DB3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.kungJin.bojutsu.bOneFour,
    moves.kungJin.bojutsu.bFFour,
    moves.kungJin.bojutsu.four,
    moves.kungJin.bojutsu.dBOne,
    moves.kungJin.bojutsu.threeFourThree,
    moves.kungJin.bojutsu.dBThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kungJinBojutsuCommunityCorner016Combo = {
  id: "kung-jin-bojutsu-community-corner-016",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kung Jin Bojutsu F24+BF4-4+DB1-343+DB3",
    fallback: "Kung Jin Bojutsu F24+BF4-4+DB1-343+DB3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 33,
    meter: 0,
    position: "corner",
    starter: "F24+BF4",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: F24+BF4-4+DB1-343+DB3.",
    fallback: "Community combo source route. Section: corner. Raw notation: F24+BF4-4+DB1-343+DB3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.kungJin.bojutsu.fTwoFour,
    moves.kungJin.bojutsu.bFFour,
    moves.kungJin.bojutsu.four,
    moves.kungJin.bojutsu.dBOne,
    moves.kungJin.bojutsu.threeFourThree,
    moves.kungJin.bojutsu.dBThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kungJinBojutsuCommunityCorner018Combo = {
  id: "kung-jin-bojutsu-community-corner-018",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kung Jin Bojutsu 221+EXDB3-4+DB1-343+DB3",
    fallback: "Kung Jin Bojutsu 221+EXDB3-4+DB1-343+DB3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 43,
    meter: 1,
    position: "corner",
    starter: "221+EXDB3",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 221+EXDB3-4+DB1-343+DB3.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: 221+EXDB3-4+DB1-343+DB3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.kungJin.bojutsu.twoTwoOne,
    moves.kungJin.bojutsu.exDBThree,
    moves.kungJin.bojutsu.four,
    moves.kungJin.bojutsu.dBOne,
    moves.kungJin.bojutsu.threeFourThree,
    moves.kungJin.bojutsu.dBThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kungJinBojutsuCommunityCorner019Combo = {
  id: "kung-jin-bojutsu-community-corner-019",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kung Jin Bojutsu 221+EXDB3-4+EXDB1-4+DB1-34+DB3",
    fallback: "Kung Jin Bojutsu 221+EXDB3-4+EXDB1-4+DB1-34+DB3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 48,
    meter: 2,
    position: "corner",
    starter: "221+EXDB3",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 221+EXDB3-4+EXDB1-4+DB1-34+DB3.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: 221+EXDB3-4+EXDB1-4+DB1-34+DB3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.kungJin.bojutsu.twoTwoOne,
    moves.kungJin.bojutsu.exDBThree,
    moves.kungJin.bojutsu.four,
    moves.kungJin.bojutsu.exDBOne,
    moves.kungJin.bojutsu.four,
    moves.kungJin.bojutsu.dBOne,
    moves.kungJin.bojutsu.threeFour,
    moves.kungJin.bojutsu.dBThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const kungJinBojutsuCombos = {
  sourcePath: "characters/kung-jin/bojutsu.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    kungJinBojutsuStarter001Combo,
    kungJinBojutsuCommunityBeginner002Combo,
    kungJinBojutsuCommunityCorner014Combo,
    kungJinBojutsuCommunityCorner015Combo,
    kungJinBojutsuCommunityCorner016Combo,
    kungJinBojutsuCommunityCorner018Combo,
    kungJinBojutsuCommunityCorner019Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
