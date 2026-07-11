import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.subZero;
const variationSlug = "grandmaster";
const variationId = `${characterId}:${variationSlug}` as const;

const subZeroGrandmasterStarter001Combo = {
  id: "sub-zero-grandmaster-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Sub-Zero Grandmaster starter",
    fallback: "Sub-Zero Grandmaster starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 27,
    meter: 1,
    position: "midscreen",
    starter: "Opening Assault",
    routeType: "metered",
    difficulty: "hard",
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
    moves.subZero.universal.openingAssault,
    moves.subZero.universal.risingAssault,
    moves.subZero.grandmaster.grandmasterTechnique,
    moves.subZero.universal.closingStrikeEnhanced,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const subZeroGrandmasterCommunityBeginner003Combo = {
  id: "sub-zero-grandmaster-community-beginner-003",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Sub-Zero Grandmaster B2-BF4",
    fallback: "Sub-Zero Grandmaster B2-BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 16,
    meter: 0,
    position: "midscreen",
    starter: "B2",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B2-BF4.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B2-BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [moves.subZero.grandmaster.bTwo, moves.subZero.grandmaster.bFFour],
} as const satisfies MkxlAuthoredSeededCombo;

const subZeroGrandmasterCommunityBeginner004Combo = {
  id: "sub-zero-grandmaster-community-beginner-004",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Sub-Zero Grandmaster B2-B2-B12+BF4",
    fallback: "Sub-Zero Grandmaster B2-B2-B12+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 31,
    meter: 0,
    position: "midscreen",
    starter: "B2",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B2-B2-B12+BF4.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B2-B2-B12+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.subZero.grandmaster.bTwo,
    moves.subZero.grandmaster.bTwo,
    moves.subZero.grandmaster.bOneTwo,
    moves.subZero.grandmaster.bFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const subZeroGrandmasterCommunityOptimal009Combo = {
  id: "sub-zero-grandmaster-community-optimal-009",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Sub-Zero Grandmaster B2-F42+BF4",
    fallback: "Sub-Zero Grandmaster B2-F42+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 22,
    meter: 0,
    position: "midscreen",
    starter: "B2",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "optimal"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: B2-F42+BF4.",
    fallback: "Community combo source route. Section: optimal. Raw notation: B2-F42+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.subZero.grandmaster.bTwo,
    moves.subZero.grandmaster.fFourTwo,
    moves.subZero.grandmaster.bFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const subZeroGrandmasterCombos = {
  sourcePath: "characters/sub-zero/grandmaster.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    subZeroGrandmasterStarter001Combo,
    subZeroGrandmasterCommunityBeginner003Combo,
    subZeroGrandmasterCommunityBeginner004Combo,
    subZeroGrandmasterCommunityOptimal009Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
