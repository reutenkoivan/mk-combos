import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.ferraTorr;
const variationSlug = "ruthless";
const variationId = `${characterId}:${variationSlug}` as const;

const ferraTorrRuthlessStarter001Combo = {
  id: "ferra-torr-ruthless-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Ferra/Torr Ruthless starter",
    fallback: "Ferra/Torr Ruthless starter",
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
    moves.ferraTorr.universal.openingAssault,
    moves.ferraTorr.universal.risingAssault,
    moves.ferraTorr.ruthless.ruthlessTechnique,
    moves.ferraTorr.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const ferraTorrRuthlessCommunityBeginner001Combo = {
  id: "ferra-torr-ruthless-community-beginner-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Ferra/Torr Ruthless 11+EXBF2-F2-4+BF3",
    fallback: "Ferra/Torr Ruthless 11+EXBF2-F2-4+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 28,
    meter: 1,
    position: "midscreen",
    starter: "11+EXBF2",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 11+EXBF2-F2-4+BF3.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 11+EXBF2-F2-4+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.ferraTorr.ruthless.oneOne,
    moves.ferraTorr.ruthless.exBFTwo,
    moves.ferraTorr.ruthless.fTwo,
    moves.ferraTorr.ruthless.four,
    moves.ferraTorr.ruthless.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const ferraTorrRuthlessCommunityBeginner002Combo = {
  id: "ferra-torr-ruthless-community-beginner-002",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Ferra/Torr Ruthless 11+EXDB2-F2-4+BF3",
    fallback: "Ferra/Torr Ruthless 11+EXDB2-F2-4+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 29,
    meter: 1,
    position: "midscreen",
    starter: "11+EXDB2",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 11+EXDB2-F2-4+BF3.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 11+EXDB2-F2-4+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.ferraTorr.ruthless.oneOne,
    moves.ferraTorr.ruthless.exDBTwo,
    moves.ferraTorr.ruthless.fTwo,
    moves.ferraTorr.ruthless.four,
    moves.ferraTorr.ruthless.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const ferraTorrRuthlessCommunityBeginner003Combo = {
  id: "ferra-torr-ruthless-community-beginner-003",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Ferra/Torr Ruthless B121+EXDB2-F2-4+BF3",
    fallback: "Ferra/Torr Ruthless B121+EXDB2-F2-4+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 31,
    meter: 1,
    position: "midscreen",
    starter: "B121+EXDB2",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B121+EXDB2-F2-4+BF3.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B121+EXDB2-F2-4+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.ferraTorr.ruthless.bOneTwoOne,
    moves.ferraTorr.ruthless.exDBTwo,
    moves.ferraTorr.ruthless.fTwo,
    moves.ferraTorr.ruthless.four,
    moves.ferraTorr.ruthless.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const ferraTorrRuthlessCommunityBeginner005Combo = {
  id: "ferra-torr-ruthless-community-beginner-005",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Ferra/Torr Ruthless F2-11-4+BF3",
    fallback: "Ferra/Torr Ruthless F2-11-4+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 25,
    meter: 0,
    position: "midscreen",
    starter: "F2",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F2-11-4+BF3.",
    fallback: "Community combo source route. Section: beginner. Raw notation: F2-11-4+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.ferraTorr.ruthless.fTwo,
    moves.ferraTorr.ruthless.oneOne,
    moves.ferraTorr.ruthless.four,
    moves.ferraTorr.ruthless.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const ferraTorrRuthlessCommunityOptimal009Combo = {
  id: "ferra-torr-ruthless-community-optimal-009",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Ferra/Torr Ruthless B121+EXBF2-F2-D2-F3+DBF1",
    fallback: "Ferra/Torr Ruthless B121+EXBF2-F2-D2-F3+DBF1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 37,
    meter: 1,
    position: "midscreen",
    starter: "B121+EXBF2",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "optimal", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: B121+EXBF2-F2-D2-F3+DBF1.",
    fallback:
      "Community combo source route. Section: optimal. Raw notation: B121+EXBF2-F2-D2-F3+DBF1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.ferraTorr.ruthless.bOneTwoOne,
    moves.ferraTorr.ruthless.exBFTwo,
    moves.ferraTorr.ruthless.fTwo,
    moves.ferraTorr.ruthless.dTwo,
    moves.ferraTorr.ruthless.fThree,
    moves.ferraTorr.ruthless.dBFOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const ferraTorrRuthlessCombos = {
  sourcePath: "characters/ferra-torr/ruthless.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    ferraTorrRuthlessStarter001Combo,
    ferraTorrRuthlessCommunityBeginner001Combo,
    ferraTorrRuthlessCommunityBeginner002Combo,
    ferraTorrRuthlessCommunityBeginner003Combo,
    ferraTorrRuthlessCommunityBeginner005Combo,
    ferraTorrRuthlessCommunityOptimal009Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
