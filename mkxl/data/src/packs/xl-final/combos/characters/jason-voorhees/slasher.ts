import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.jasonVoorhees;
const variationSlug = "slasher";
const variationId = `${characterId}:${variationSlug}` as const;

const jasonVoorheesSlasherStarter001Combo = {
  id: "jason-voorhees-slasher-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jason Voorhees Slasher starter",
    fallback: "Jason Voorhees Slasher starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 25,
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
    moves.jasonVoorhees.universal.openingAssault,
    moves.jasonVoorhees.universal.risingAssault,
    moves.jasonVoorhees.slasher.slasherTechnique,
    moves.jasonVoorhees.universal.closingStrikeEnhanced,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const jasonVoorheesSlasherCommunityBeginner001Combo = {
  id: "jason-voorhees-slasher-community-beginner-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jason Voorhees Slasher 111+DF1",
    fallback: "Jason Voorhees Slasher 111+DF1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 21,
    meter: 0,
    position: "midscreen",
    starter: "111+DF1",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 111+DF1.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 111+DF1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [moves.jasonVoorhees.slasher.oneOneOne, moves.jasonVoorhees.slasher.dFOne],
} as const satisfies MkxlAuthoredSeededCombo;

const jasonVoorheesSlasherCommunityBeginner002Combo = {
  id: "jason-voorhees-slasher-community-beginner-002",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jason Voorhees Slasher 111+EXBF2",
    fallback: "Jason Voorhees Slasher 111+EXBF2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 28,
    meter: 1,
    position: "midscreen",
    starter: "111+EXBF2",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 111+EXBF2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 111+EXBF2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [moves.jasonVoorhees.slasher.oneOneOne, moves.jasonVoorhees.slasher.exBFTwo],
} as const satisfies MkxlAuthoredSeededCombo;

const jasonVoorheesSlasherCommunityBeginner003Combo = {
  id: "jason-voorhees-slasher-community-beginner-003",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jason Voorhees Slasher B122-F42-F42-111+DF1",
    fallback: "Jason Voorhees Slasher B122-F42-F42-111+DF1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 34,
    meter: 0,
    position: "midscreen",
    starter: "B122",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B122-F42-F42-111+DF1.",
    fallback:
      "Community combo source route. Section: beginner. Raw notation: B122-F42-F42-111+DF1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.jasonVoorhees.slasher.bOneTwoTwo,
    moves.jasonVoorhees.slasher.fFourTwo,
    moves.jasonVoorhees.slasher.fFourTwo,
    moves.jasonVoorhees.slasher.oneOneOne,
    moves.jasonVoorhees.slasher.dFOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const jasonVoorheesSlasherCommunityBeginner004Combo = {
  id: "jason-voorhees-slasher-community-beginner-004",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jason Voorhees Slasher F42-F42-F42-11+DF1",
    fallback: "Jason Voorhees Slasher F42-F42-F42-11+DF1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 36,
    meter: 0,
    position: "midscreen",
    starter: "F42",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F42-F42-F42-11+DF1.",
    fallback: "Community combo source route. Section: beginner. Raw notation: F42-F42-F42-11+DF1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.jasonVoorhees.slasher.fFourTwo,
    moves.jasonVoorhees.slasher.fFourTwo,
    moves.jasonVoorhees.slasher.fFourTwo,
    moves.jasonVoorhees.slasher.oneOne,
    moves.jasonVoorhees.slasher.dFOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const jasonVoorheesSlasherCommunityOptimal006Combo = {
  id: "jason-voorhees-slasher-community-optimal-006",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jason Voorhees Slasher B122-F42-F42-11+EXDF1",
    fallback: "Jason Voorhees Slasher B122-F42-F42-11+EXDF1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 36,
    meter: 1,
    position: "midscreen",
    starter: "B122",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "optimal", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: B122-F42-F42-11+EXDF1.",
    fallback:
      "Community combo source route. Section: optimal. Raw notation: B122-F42-F42-11+EXDF1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.jasonVoorhees.slasher.bOneTwoTwo,
    moves.jasonVoorhees.slasher.fFourTwo,
    moves.jasonVoorhees.slasher.fFourTwo,
    moves.jasonVoorhees.slasher.oneOne,
    moves.jasonVoorhees.slasher.exDFOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const jasonVoorheesSlasherCommunityOptimal007Combo = {
  id: "jason-voorhees-slasher-community-optimal-007",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jason Voorhees Slasher F2+DF1",
    fallback: "Jason Voorhees Slasher F2+DF1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 17,
    meter: 0,
    position: "midscreen",
    starter: "F2+DF1",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "optimal"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: F2+DF1.",
    fallback: "Community combo source route. Section: optimal. Raw notation: F2+DF1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [moves.jasonVoorhees.slasher.fTwo, moves.jasonVoorhees.slasher.dFOne],
} as const satisfies MkxlAuthoredSeededCombo;

const jasonVoorheesSlasherCommunityOptimal008Combo = {
  id: "jason-voorhees-slasher-community-optimal-008",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jason Voorhees Slasher F2+EXBF2",
    fallback: "Jason Voorhees Slasher F2+EXBF2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 26,
    meter: 1,
    position: "midscreen",
    starter: "F2+EXBF2",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "optimal", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: F2+EXBF2.",
    fallback: "Community combo source route. Section: optimal. Raw notation: F2+EXBF2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [moves.jasonVoorhees.slasher.fTwo, moves.jasonVoorhees.slasher.exBFTwo],
} as const satisfies MkxlAuthoredSeededCombo;

const jasonVoorheesSlasherCommunityOptimal009Combo = {
  id: "jason-voorhees-slasher-community-optimal-009",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jason Voorhees Slasher F42-F42-F42-11+EXDF1",
    fallback: "Jason Voorhees Slasher F42-F42-F42-11+EXDF1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 40,
    meter: 1,
    position: "midscreen",
    starter: "F42",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "optimal", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: F42-F42-F42-11+EXDF1.",
    fallback: "Community combo source route. Section: optimal. Raw notation: F42-F42-F42-11+EXDF1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.jasonVoorhees.slasher.fFourTwo,
    moves.jasonVoorhees.slasher.fFourTwo,
    moves.jasonVoorhees.slasher.fFourTwo,
    moves.jasonVoorhees.slasher.oneOne,
    moves.jasonVoorhees.slasher.exDFOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const jasonVoorheesSlasherCommunityCorner012Combo = {
  id: "jason-voorhees-slasher-community-corner-012",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jason Voorhees Slasher B2-F42-F42-D1-111+DF1",
    fallback: "Jason Voorhees Slasher B2-F42-F42-D1-111+DF1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 34,
    meter: 0,
    position: "corner",
    starter: "B2",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B2-F42-F42-D1-111+DF1.",
    fallback: "Community combo source route. Section: corner. Raw notation: B2-F42-F42-D1-111+DF1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.jasonVoorhees.slasher.bTwo,
    moves.jasonVoorhees.slasher.fFourTwo,
    moves.jasonVoorhees.slasher.fFourTwo,
    moves.jasonVoorhees.slasher.dOne,
    moves.jasonVoorhees.slasher.oneOneOne,
    moves.jasonVoorhees.slasher.dFOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const jasonVoorheesSlasherCommunityCorner015Combo = {
  id: "jason-voorhees-slasher-community-corner-015",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jason Voorhees Slasher 122+BF3-D1-111+DF1",
    fallback: "Jason Voorhees Slasher 122+BF3-D1-111+DF1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 28,
    meter: 0,
    position: "corner",
    starter: "122+BF3",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 122+BF3-D1-111+DF1.",
    fallback: "Community combo source route. Section: corner. Raw notation: 122+BF3-D1-111+DF1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.jasonVoorhees.slasher.oneTwoTwo,
    moves.jasonVoorhees.slasher.bFThree,
    moves.jasonVoorhees.slasher.dOne,
    moves.jasonVoorhees.slasher.oneOneOne,
    moves.jasonVoorhees.slasher.dFOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const jasonVoorheesSlasherCommunityCorner018Combo = {
  id: "jason-voorhees-slasher-community-corner-018",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jason Voorhees Slasher F42-F42-F42-D1-111+DF1",
    fallback: "Jason Voorhees Slasher F42-F42-F42-D1-111+DF1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 39,
    meter: 0,
    position: "corner",
    starter: "F42",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: F42-F42-F42-D1-111+DF1.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: F42-F42-F42-D1-111+DF1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.jasonVoorhees.slasher.fFourTwo,
    moves.jasonVoorhees.slasher.fFourTwo,
    moves.jasonVoorhees.slasher.fFourTwo,
    moves.jasonVoorhees.slasher.dOne,
    moves.jasonVoorhees.slasher.oneOneOne,
    moves.jasonVoorhees.slasher.dFOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const jasonVoorheesSlasherCommunityCorner019Combo = {
  id: "jason-voorhees-slasher-community-corner-019",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jason Voorhees Slasher F42-F42-F42-D1-111+EXDF1",
    fallback: "Jason Voorhees Slasher F42-F42-F42-D1-111+EXDF1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 42,
    meter: 1,
    position: "corner",
    starter: "F42",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: F42-F42-F42-D1-111+EXDF1.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: F42-F42-F42-D1-111+EXDF1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.jasonVoorhees.slasher.fFourTwo,
    moves.jasonVoorhees.slasher.fFourTwo,
    moves.jasonVoorhees.slasher.fFourTwo,
    moves.jasonVoorhees.slasher.dOne,
    moves.jasonVoorhees.slasher.oneOneOne,
    moves.jasonVoorhees.slasher.exDFOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const jasonVoorheesSlasherCommunityCorner022Combo = {
  id: "jason-voorhees-slasher-community-corner-022",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jason Voorhees Slasher 24-F42-F42-111+DF1",
    fallback: "Jason Voorhees Slasher 24-F42-F42-111+DF1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 36,
    meter: 0,
    position: "corner",
    starter: "24",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 24-F42-F42-111+DF1.",
    fallback: "Community combo source route. Section: corner. Raw notation: 24-F42-F42-111+DF1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.jasonVoorhees.slasher.twoFour,
    moves.jasonVoorhees.slasher.fFourTwo,
    moves.jasonVoorhees.slasher.fFourTwo,
    moves.jasonVoorhees.slasher.oneOneOne,
    moves.jasonVoorhees.slasher.dFOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const jasonVoorheesSlasherCombos = {
  sourcePath: "characters/jason-voorhees/slasher.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    jasonVoorheesSlasherStarter001Combo,
    jasonVoorheesSlasherCommunityBeginner001Combo,
    jasonVoorheesSlasherCommunityBeginner002Combo,
    jasonVoorheesSlasherCommunityBeginner003Combo,
    jasonVoorheesSlasherCommunityBeginner004Combo,
    jasonVoorheesSlasherCommunityOptimal006Combo,
    jasonVoorheesSlasherCommunityOptimal007Combo,
    jasonVoorheesSlasherCommunityOptimal008Combo,
    jasonVoorheesSlasherCommunityOptimal009Combo,
    jasonVoorheesSlasherCommunityCorner012Combo,
    jasonVoorheesSlasherCommunityCorner015Combo,
    jasonVoorheesSlasherCommunityCorner018Combo,
    jasonVoorheesSlasherCommunityCorner019Combo,
    jasonVoorheesSlasherCommunityCorner022Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
