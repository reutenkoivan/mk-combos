import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

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
    transitions.ferraTorr.universal.openingAssault,
    transitions.ferraTorr.universal.risingAssault,
    transitions.ferraTorr.ruthless.ruthlessTechnique,
    transitions.ferraTorr.universal.closingStrike,
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
    transitions.ferraTorr.ruthless.oneOneIntoExBFTwo,
    transitions.ferraTorr.ruthless.fTwo,
    transitions.ferraTorr.ruthless.fourIntoBFThree,
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
    transitions.ferraTorr.ruthless.oneOneIntoExDBTwo,
    transitions.ferraTorr.ruthless.fTwo,
    transitions.ferraTorr.ruthless.fourIntoBFThree,
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
    transitions.ferraTorr.ruthless.bOneTwoOneIntoExDBTwo,
    transitions.ferraTorr.ruthless.fTwo,
    transitions.ferraTorr.ruthless.fourIntoBFThree,
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
    transitions.ferraTorr.ruthless.fTwo,
    transitions.ferraTorr.ruthless.oneOne,
    transitions.ferraTorr.ruthless.fourIntoBFThree,
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
    transitions.ferraTorr.ruthless.bOneTwoOneIntoExBFTwo,
    transitions.ferraTorr.ruthless.fTwo,
    transitions.ferraTorr.ruthless.dTwo,
    transitions.ferraTorr.ruthless.fThreeIntoDBFOne,
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
