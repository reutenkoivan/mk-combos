import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.alien;
const variationSlug = "tarkatan";
const variationId = `${characterId}:${variationSlug}` as const;

const alienTarkatanStarter001Combo = {
  id: "alien-tarkatan-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Alien Tarkatan starter",
    fallback: "Alien Tarkatan starter",
  },
  stageContext: {
    kind: "stageSpecific",
    stageId: "crossroads",
    zoneId: "crossroads:mid",
    segmentId: "crossroads:mid-screen",
    interactableIds: ["crossroads:position-escape"],
  },
  metadata: {
    damage: 24,
    meter: 1,
    position: "corner",
    starter: "Opening Assault",
    routeType: "stage",
    difficulty: "hard",
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
    moves.alien.universal.openingAssault,
    moves.alien.universal.risingAssault,
    moves.alien.tarkatan.tarkatanTechnique,
    moves.alien.universal.closingStrikeEnhanced,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const alienTarkatanCommunityBeginner001Combo = {
  id: "alien-tarkatan-community-beginner-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Alien Tarkatan B11U4-214+DF3",
    fallback: "Alien Tarkatan B11U4-214+DF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 26,
    meter: 0,
    position: "midscreen",
    starter: "B11U4",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B11U4-214+DF3.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B11U4-214+DF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.alien.tarkatan.bOneOneUFour,
    moves.alien.tarkatan.twoOneFour,
    moves.alien.tarkatan.dFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const alienTarkatanCommunityBeginner002Combo = {
  id: "alien-tarkatan-community-beginner-002",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Alien Tarkatan 12+EXBF4-214+DF3",
    fallback: "Alien Tarkatan 12+EXBF4-214+DF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 27,
    meter: 1,
    position: "midscreen",
    starter: "12+EXBF4",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 12+EXBF4-214+DF3.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 12+EXBF4-214+DF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.alien.tarkatan.oneTwo,
    moves.alien.tarkatan.exBFFour,
    moves.alien.tarkatan.twoOneFour,
    moves.alien.tarkatan.dFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const alienTarkatanCommunityBeginner003Combo = {
  id: "alien-tarkatan-community-beginner-003",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Alien Tarkatan F134+EXBF1-F134+DF3",
    fallback: "Alien Tarkatan F134+EXBF1-F134+DF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 36,
    meter: 1,
    position: "midscreen",
    starter: "F134+EXBF1",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F134+EXBF1-F134+DF3.",
    fallback: "Community combo source route. Section: beginner. Raw notation: F134+EXBF1-F134+DF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.alien.tarkatan.fOneThreeFour,
    moves.alien.tarkatan.exBFOne,
    moves.alien.tarkatan.fOneThreeFour,
    moves.alien.tarkatan.dFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const alienTarkatanCommunityBeginner004Combo = {
  id: "alien-tarkatan-community-beginner-004",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Alien Tarkatan B3+EXBF4-214+DF3",
    fallback: "Alien Tarkatan B3+EXBF4-214+DF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 28,
    meter: 1,
    position: "midscreen",
    starter: "B3+EXBF4",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B3+EXBF4-214+DF3.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B3+EXBF4-214+DF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.alien.tarkatan.bThree,
    moves.alien.tarkatan.exBFFour,
    moves.alien.tarkatan.twoOneFour,
    moves.alien.tarkatan.dFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const alienTarkatanCommunityBeginner005Combo = {
  id: "alien-tarkatan-community-beginner-005",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Alien Tarkatan F4+EXBF4-214+DF3",
    fallback: "Alien Tarkatan F4+EXBF4-214+DF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 28,
    meter: 1,
    position: "midscreen",
    starter: "F4+EXBF4",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F4+EXBF4-214+DF3.",
    fallback: "Community combo source route. Section: beginner. Raw notation: F4+EXBF4-214+DF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.alien.tarkatan.fFour,
    moves.alien.tarkatan.exBFFour,
    moves.alien.tarkatan.twoOneFour,
    moves.alien.tarkatan.dFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const alienTarkatanCommunityOptimal009Combo = {
  id: "alien-tarkatan-community-optimal-009",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Alien Tarkatan F134+EXBF1-B11U4-214+DF3",
    fallback: "Alien Tarkatan F134+EXBF1-B11U4-214+DF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 38,
    meter: 1,
    position: "midscreen",
    starter: "F134+EXBF1",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "optimal", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: F134+EXBF1-B11U4-214+DF3.",
    fallback:
      "Community combo source route. Section: optimal. Raw notation: F134+EXBF1-B11U4-214+DF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.alien.tarkatan.fOneThreeFour,
    moves.alien.tarkatan.exBFOne,
    moves.alien.tarkatan.bOneOneUFour,
    moves.alien.tarkatan.twoOneFour,
    moves.alien.tarkatan.dFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const alienTarkatanCommunityCorner015Combo = {
  id: "alien-tarkatan-community-corner-015",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Alien Tarkatan B11U4-U3-U3-214+DF3",
    fallback: "Alien Tarkatan B11U4-U3-U3-214+DF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 32,
    meter: 0,
    position: "corner",
    starter: "B11U4",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B11U4-U3-U3-214+DF3.",
    fallback: "Community combo source route. Section: corner. Raw notation: B11U4-U3-U3-214+DF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.alien.tarkatan.bOneOneUFour,
    moves.alien.tarkatan.uThree,
    moves.alien.tarkatan.uThree,
    moves.alien.tarkatan.twoOneFour,
    moves.alien.tarkatan.dFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const alienTarkatanCommunityCorner016Combo = {
  id: "alien-tarkatan-community-corner-016",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Alien Tarkatan B11U4-U3-U3-214+EXBF1-214+DF3",
    fallback: "Alien Tarkatan B11U4-U3-U3-214+EXBF1-214+DF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 39,
    meter: 1,
    position: "corner",
    starter: "B11U4",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B11U4-U3-U3-214+EXBF1-214+DF3.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: B11U4-U3-U3-214+EXBF1-214+DF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.alien.tarkatan.bOneOneUFour,
    moves.alien.tarkatan.uThree,
    moves.alien.tarkatan.uThree,
    moves.alien.tarkatan.twoOneFour,
    moves.alien.tarkatan.exBFOne,
    moves.alien.tarkatan.twoOneFour,
    moves.alien.tarkatan.dFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const alienTarkatanCombos = {
  sourcePath: "characters/alien/tarkatan.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    alienTarkatanStarter001Combo,
    alienTarkatanCommunityBeginner001Combo,
    alienTarkatanCommunityBeginner002Combo,
    alienTarkatanCommunityBeginner003Combo,
    alienTarkatanCommunityBeginner004Combo,
    alienTarkatanCommunityBeginner005Combo,
    alienTarkatanCommunityOptimal009Combo,
    alienTarkatanCommunityCorner015Combo,
    alienTarkatanCommunityCorner016Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
