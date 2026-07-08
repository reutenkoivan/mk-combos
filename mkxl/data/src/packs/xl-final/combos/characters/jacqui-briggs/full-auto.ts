import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.jacquiBriggs;
const variationSlug = "full-auto";
const variationId = `${characterId}:${variationSlug}` as const;

const jacquiBriggsFullAutoStarter001Combo = {
  id: "jacqui-briggs-full-auto-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jacqui Briggs Full Auto starter",
    fallback: "Jacqui Briggs Full Auto starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 32,
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
    transitions.jacquiBriggs.universal.openingAssault,
    transitions.jacquiBriggs.universal.risingAssault,
    transitions.jacquiBriggs.fullAuto.fullAutoTechnique,
    transitions.jacquiBriggs.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const jacquiBriggsFullAutoCommunityBeginner002Combo = {
  id: "jacqui-briggs-full-auto-community-beginner-002",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jacqui Briggs Full Auto 23+DB3-DASH-1212+BF4",
    fallback: "Jacqui Briggs Full Auto 23+DB3-DASH-1212+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 29,
    meter: 0,
    position: "midscreen",
    starter: "23+DB3",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 23+DB3-DASH-1212+BF4.",
    fallback:
      "Community combo source route. Section: beginner. Raw notation: 23+DB3-DASH-1212+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.jacquiBriggs.fullAuto.twoThreeIntoDBThree,
    transitions.jacquiBriggs.fullAuto.dash,
    transitions.jacquiBriggs.fullAuto.oneTwoOneTwoIntoBFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const jacquiBriggsFullAutoCommunityBeginner003Combo = {
  id: "jacqui-briggs-full-auto-community-beginner-003",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jacqui Briggs Full Auto F12+DB2-F1+BF4",
    fallback: "Jacqui Briggs Full Auto F12+DB2-F1+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 29,
    meter: 0,
    position: "midscreen",
    starter: "F12+DB2",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F12+DB2-F1+BF4.",
    fallback: "Community combo source route. Section: beginner. Raw notation: F12+DB2-F1+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.jacquiBriggs.fullAuto.fOneTwoIntoDBTwo,
    transitions.jacquiBriggs.fullAuto.fOneIntoBFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const jacquiBriggsFullAutoCommunityBeginner004Combo = {
  id: "jacqui-briggs-full-auto-community-beginner-004",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jacqui Briggs Full Auto B33+DB3-BF2-BF1",
    fallback: "Jacqui Briggs Full Auto B33+DB3-BF2-BF1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 26,
    meter: 0,
    position: "midscreen",
    starter: "B33+DB3",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B33+DB3-BF2-BF1.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B33+DB3-BF2-BF1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.jacquiBriggs.fullAuto.bThreeThreeIntoDBThree,
    transitions.jacquiBriggs.fullAuto.bFTwo,
    transitions.jacquiBriggs.fullAuto.bFOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const jacquiBriggsFullAutoCommunityBeginner006Combo = {
  id: "jacqui-briggs-full-auto-community-beginner-006",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jacqui Briggs Full Auto B2+EXDB2-DASH-33+BF4",
    fallback: "Jacqui Briggs Full Auto B2+EXDB2-DASH-33+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 33,
    meter: 1,
    position: "midscreen",
    starter: "B2+EXDB2",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B2+EXDB2-DASH-33+BF4.",
    fallback:
      "Community combo source route. Section: beginner. Raw notation: B2+EXDB2-DASH-33+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.jacquiBriggs.fullAuto.bTwoIntoExDBTwo,
    transitions.jacquiBriggs.fullAuto.dash,
    transitions.jacquiBriggs.fullAuto.threeThreeIntoBFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const jacquiBriggsFullAutoCommunityOptimal014Combo = {
  id: "jacqui-briggs-full-auto-community-optimal-014",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jacqui Briggs Full Auto B2+EXDB2-DASH-1+F2U2-DU4-4+BF4",
    fallback: "Jacqui Briggs Full Auto B2+EXDB2-DASH-1+F2U2-DU4-4+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 34,
    meter: 1,
    position: "midscreen",
    starter: "B2+EXDB2",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "optimal", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: B2+EXDB2-DASH-1+F2U2-DU4-4+BF4.",
    fallback:
      "Community combo source route. Section: optimal. Raw notation: B2+EXDB2-DASH-1+F2U2-DU4-4+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.jacquiBriggs.fullAuto.bTwoIntoExDBTwo,
    transitions.jacquiBriggs.fullAuto.dash,
    transitions.jacquiBriggs.fullAuto.oneIntoFTwoUTwo,
    transitions.jacquiBriggs.fullAuto.dUFour,
    transitions.jacquiBriggs.fullAuto.fourIntoBFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const jacquiBriggsFullAutoCommunityCorner016Combo = {
  id: "jacqui-briggs-full-auto-community-corner-016",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jacqui Briggs Full Auto 121+DB3-33+DB2-F2U2-DU4-114+BF4",
    fallback: "Jacqui Briggs Full Auto 121+DB3-33+DB2-F2U2-DU4-114+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 39,
    meter: 0,
    position: "corner",
    starter: "121+DB3",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 121+DB3-33+DB2-F2U2-DU4-114+BF4.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: 121+DB3-33+DB2-F2U2-DU4-114+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.jacquiBriggs.fullAuto.oneTwoOneIntoDBThree,
    transitions.jacquiBriggs.fullAuto.threeThreeIntoDBTwo,
    transitions.jacquiBriggs.fullAuto.fTwoUTwo,
    transitions.jacquiBriggs.fullAuto.dUFour,
    transitions.jacquiBriggs.fullAuto.oneOneFourIntoBFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const jacquiBriggsFullAutoCommunityCorner017Combo = {
  id: "jacqui-briggs-full-auto-community-corner-017",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jacqui Briggs Full Auto 121+EXDB3-33+DB2-F2U2-DU4-114+BF4",
    fallback: "Jacqui Briggs Full Auto 121+EXDB3-33+DB2-F2U2-DU4-114+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 42,
    meter: 1,
    position: "corner",
    starter: "121+EXDB3",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 121+EXDB3-33+DB2-F2U2-DU4-114+BF4.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: 121+EXDB3-33+DB2-F2U2-DU4-114+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.jacquiBriggs.fullAuto.oneTwoOneIntoExDBThree,
    transitions.jacquiBriggs.fullAuto.threeThreeIntoDBTwo,
    transitions.jacquiBriggs.fullAuto.fTwoUTwo,
    transitions.jacquiBriggs.fullAuto.dUFour,
    transitions.jacquiBriggs.fullAuto.oneOneFourIntoBFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const jacquiBriggsFullAutoCommunityCorner018Combo = {
  id: "jacqui-briggs-full-auto-community-corner-018",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jacqui Briggs Full Auto B33+DB3-33+DB2-F2U2-DU4-114+BF4",
    fallback: "Jacqui Briggs Full Auto B33+DB3-33+DB2-F2U2-DU4-114+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 44,
    meter: 0,
    position: "corner",
    starter: "B33+DB3",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B33+DB3-33+DB2-F2U2-DU4-114+BF4.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: B33+DB3-33+DB2-F2U2-DU4-114+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.jacquiBriggs.fullAuto.bThreeThreeIntoDBThree,
    transitions.jacquiBriggs.fullAuto.threeThreeIntoDBTwo,
    transitions.jacquiBriggs.fullAuto.fTwoUTwo,
    transitions.jacquiBriggs.fullAuto.dUFour,
    transitions.jacquiBriggs.fullAuto.oneOneFourIntoBFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const jacquiBriggsFullAutoCommunityCorner019Combo = {
  id: "jacqui-briggs-full-auto-community-corner-019",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jacqui Briggs Full Auto B33+EXDB3-33+DB2-F2U2-DU4-114+BF4",
    fallback: "Jacqui Briggs Full Auto B33+EXDB3-33+DB2-F2U2-DU4-114+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 47,
    meter: 1,
    position: "corner",
    starter: "B33+EXDB3",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B33+EXDB3-33+DB2-F2U2-DU4-114+BF4.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: B33+EXDB3-33+DB2-F2U2-DU4-114+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.jacquiBriggs.fullAuto.bThreeThreeIntoExDBThree,
    transitions.jacquiBriggs.fullAuto.threeThreeIntoDBTwo,
    transitions.jacquiBriggs.fullAuto.fTwoUTwo,
    transitions.jacquiBriggs.fullAuto.dUFour,
    transitions.jacquiBriggs.fullAuto.oneOneFourIntoBFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const jacquiBriggsFullAutoCommunityCorner021Combo = {
  id: "jacqui-briggs-full-auto-community-corner-021",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jacqui Briggs Full Auto B2+EXDB3-33+DB2-11-114+BF4",
    fallback: "Jacqui Briggs Full Auto B2+EXDB3-33+DB2-11-114+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 43,
    meter: 1,
    position: "corner",
    starter: "B2+EXDB3",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B2+EXDB3-33+DB2-11-114+BF4.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: B2+EXDB3-33+DB2-11-114+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.jacquiBriggs.fullAuto.bTwoIntoExDBThree,
    transitions.jacquiBriggs.fullAuto.threeThreeIntoDBTwo,
    transitions.jacquiBriggs.fullAuto.oneOne,
    transitions.jacquiBriggs.fullAuto.oneOneFourIntoBFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const jacquiBriggsFullAutoCombos = {
  sourcePath: "characters/jacqui-briggs/full-auto.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    jacquiBriggsFullAutoStarter001Combo,
    jacquiBriggsFullAutoCommunityBeginner002Combo,
    jacquiBriggsFullAutoCommunityBeginner003Combo,
    jacquiBriggsFullAutoCommunityBeginner004Combo,
    jacquiBriggsFullAutoCommunityBeginner006Combo,
    jacquiBriggsFullAutoCommunityOptimal014Combo,
    jacquiBriggsFullAutoCommunityCorner016Combo,
    jacquiBriggsFullAutoCommunityCorner017Combo,
    jacquiBriggsFullAutoCommunityCorner018Combo,
    jacquiBriggsFullAutoCommunityCorner019Combo,
    jacquiBriggsFullAutoCommunityCorner021Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
