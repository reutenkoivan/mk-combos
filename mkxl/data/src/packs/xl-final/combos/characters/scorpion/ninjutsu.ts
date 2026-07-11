import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.scorpion;
const variationSlug = "ninjutsu";
const variationId = `${characterId}:${variationSlug}` as const;

const scorpionNinjutsuStarter001Combo = {
  id: "scorpion-ninjutsu-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Scorpion Ninjutsu starter",
    fallback: "Scorpion Ninjutsu starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 28,
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
    moves.scorpion.universal.openingAssault,
    moves.scorpion.universal.risingAssault,
    moves.scorpion.ninjutsu.ninjutsuTechnique,
    moves.scorpion.universal.closingStrikeEnhanced,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const scorpionNinjutsuCommunityBeginner001Combo = {
  id: "scorpion-ninjutsu-community-beginner-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Scorpion Ninjutsu 214+DB3-214+DB3",
    fallback: "Scorpion Ninjutsu 214+DB3-214+DB3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 27,
    meter: 0,
    position: "midscreen",
    starter: "214+DB3",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 214+DB3-214+DB3.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 214+DB3-214+DB3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.scorpion.ninjutsu.twoOneFour,
    moves.scorpion.ninjutsu.dBThree,
    moves.scorpion.ninjutsu.twoOneFour,
    moves.scorpion.ninjutsu.dBThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const scorpionNinjutsuCommunityBeginner002Combo = {
  id: "scorpion-ninjutsu-community-beginner-002",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Scorpion Ninjutsu F2-B2-B2-B2+D2",
    fallback: "Scorpion Ninjutsu F2-B2-B2-B2+D2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 30,
    meter: 0,
    position: "midscreen",
    starter: "F2",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F2-B2-B2-B2+D2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: F2-B2-B2-B2+D2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.scorpion.ninjutsu.fTwo,
    moves.scorpion.ninjutsu.bTwo,
    moves.scorpion.ninjutsu.bTwo,
    moves.scorpion.ninjutsu.bTwo,
    moves.scorpion.ninjutsu.dTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const scorpionNinjutsuCommunityBeginner003Combo = {
  id: "scorpion-ninjutsu-community-beginner-003",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Scorpion Ninjutsu B2-B2-B2-B2+D2",
    fallback: "Scorpion Ninjutsu B2-B2-B2-B2+D2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 30,
    meter: 0,
    position: "midscreen",
    starter: "B2",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B2-B2-B2-B2+D2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B2-B2-B2-B2+D2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.scorpion.ninjutsu.bTwo,
    moves.scorpion.ninjutsu.bTwo,
    moves.scorpion.ninjutsu.bTwo,
    moves.scorpion.ninjutsu.bTwo,
    moves.scorpion.ninjutsu.dTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const scorpionNinjutsuCommunityBeginner004Combo = {
  id: "scorpion-ninjutsu-community-beginner-004",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Scorpion Ninjutsu F2-B2-B2-B2-B2-214+BF4",
    fallback: "Scorpion Ninjutsu F2-B2-B2-B2-B2-214+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 35,
    meter: 0,
    position: "midscreen",
    starter: "F2",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F2-B2-B2-B2-B2-214+BF4.",
    fallback:
      "Community combo source route. Section: beginner. Raw notation: F2-B2-B2-B2-B2-214+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.scorpion.ninjutsu.fTwo,
    moves.scorpion.ninjutsu.bTwo,
    moves.scorpion.ninjutsu.bTwo,
    moves.scorpion.ninjutsu.bTwo,
    moves.scorpion.ninjutsu.bTwo,
    moves.scorpion.ninjutsu.twoOneFour,
    moves.scorpion.ninjutsu.bFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const scorpionNinjutsuCombos = {
  sourcePath: "characters/scorpion/ninjutsu.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    scorpionNinjutsuStarter001Combo,
    scorpionNinjutsuCommunityBeginner001Combo,
    scorpionNinjutsuCommunityBeginner002Combo,
    scorpionNinjutsuCommunityBeginner003Combo,
    scorpionNinjutsuCommunityBeginner004Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
