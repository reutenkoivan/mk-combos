import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.sonyaBlade;
const variationSlug = "demolition";
const variationId = `${characterId}:${variationSlug}` as const;

const sonyaBladeDemolitionStarter001Combo = {
  id: "sonya-blade-demolition-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Sonya Blade Demolition starter",
    fallback: "Sonya Blade Demolition starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 26,
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
    transitions.sonyaBlade.universal.openingAssault,
    transitions.sonyaBlade.universal.risingAssault,
    transitions.sonyaBlade.demolition.demolitionTechnique,
    transitions.sonyaBlade.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const sonyaBladeDemolitionCommunityBeginner001Combo = {
  id: "sonya-blade-demolition-community-beginner-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Sonya Blade Demolition 121+DF1-1-12-F2+BF4",
    fallback: "Sonya Blade Demolition 121+DF1-1-12-F2+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 26,
    meter: 0,
    position: "midscreen",
    starter: "121+DF1",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 121+DF1-1-12-F2+BF4.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 121+DF1-1-12-F2+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.sonyaBlade.demolition.oneTwoOneIntoDFOne,
    transitions.sonyaBlade.demolition.one,
    transitions.sonyaBlade.demolition.oneTwo,
    transitions.sonyaBlade.demolition.fTwoIntoBFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const sonyaBladeDemolitionCommunityBeginner002Combo = {
  id: "sonya-blade-demolition-community-beginner-002",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Sonya Blade Demolition F2+DF1-1-DASH-12-F2+BF4",
    fallback: "Sonya Blade Demolition F2+DF1-1-DASH-12-F2+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 25,
    meter: 0,
    position: "midscreen",
    starter: "F2+DF1",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F2+DF1-1-DASH-12-F2+BF4.",
    fallback:
      "Community combo source route. Section: beginner. Raw notation: F2+DF1-1-DASH-12-F2+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.sonyaBlade.demolition.fTwoIntoDFOne,
    transitions.sonyaBlade.demolition.one,
    transitions.sonyaBlade.demolition.dash,
    transitions.sonyaBlade.demolition.oneTwo,
    transitions.sonyaBlade.demolition.fTwoIntoBFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const sonyaBladeDemolitionCommunityBeginner003Combo = {
  id: "sonya-blade-demolition-community-beginner-003",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Sonya Blade Demolition B33212+DF1-1-12-F2+BF4",
    fallback: "Sonya Blade Demolition B33212+DF1-1-12-F2+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 28,
    meter: 0,
    position: "midscreen",
    starter: "B33212+DF1",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B33212+DF1-1-12-F2+BF4.",
    fallback:
      "Community combo source route. Section: beginner. Raw notation: B33212+DF1-1-12-F2+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.sonyaBlade.demolition.bThreeThreeTwoOneTwoIntoDFOne,
    transitions.sonyaBlade.demolition.one,
    transitions.sonyaBlade.demolition.oneTwo,
    transitions.sonyaBlade.demolition.fTwoIntoBFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const sonyaBladeDemolitionCommunityBeginner004Combo = {
  id: "sonya-blade-demolition-community-beginner-004",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Sonya Blade Demolition B14+DF1-1-DASH-12-F2+BF4",
    fallback: "Sonya Blade Demolition B14+DF1-1-DASH-12-F2+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 24,
    meter: 0,
    position: "midscreen",
    starter: "B14+DF1",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B14+DF1-1-DASH-12-F2+BF4.",
    fallback:
      "Community combo source route. Section: beginner. Raw notation: B14+DF1-1-DASH-12-F2+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.sonyaBlade.demolition.bOneFourIntoDFOne,
    transitions.sonyaBlade.demolition.one,
    transitions.sonyaBlade.demolition.dash,
    transitions.sonyaBlade.demolition.oneTwo,
    transitions.sonyaBlade.demolition.fTwoIntoBFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const sonyaBladeDemolitionCommunityCorner015Combo = {
  id: "sonya-blade-demolition-community-corner-015",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Sonya Blade Demolition 121+DB1-1-F4-12-12-124",
    fallback: "Sonya Blade Demolition 121+DB1-1-F4-12-12-124",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 31,
    meter: 0,
    position: "corner",
    starter: "121+DB1",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 121+DB1-1-F4-12-12-124.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: 121+DB1-1-F4-12-12-124.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.sonyaBlade.demolition.oneTwoOneIntoDBOne,
    transitions.sonyaBlade.demolition.one,
    transitions.sonyaBlade.demolition.fFour,
    transitions.sonyaBlade.demolition.oneTwo,
    transitions.sonyaBlade.demolition.oneTwo,
    transitions.sonyaBlade.demolition.oneTwoFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const sonyaBladeDemolitionCommunityCorner017Combo = {
  id: "sonya-blade-demolition-community-corner-017",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Sonya Blade Demolition 121+DB1-1-4+DF1-1-4+EXDD1-12-12-124",
    fallback: "Sonya Blade Demolition 121+DB1-1-4+DF1-1-4+EXDD1-12-12-124",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 39,
    meter: 1,
    position: "corner",
    starter: "121+DB1",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 121+DB1-1-4+DF1-1-4+EXDD1-12-12-124.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: 121+DB1-1-4+DF1-1-4+EXDD1-12-12-124.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.sonyaBlade.demolition.oneTwoOneIntoDBOne,
    transitions.sonyaBlade.demolition.one,
    transitions.sonyaBlade.demolition.fourIntoDFOne,
    transitions.sonyaBlade.demolition.one,
    transitions.sonyaBlade.demolition.fourIntoExDDOne,
    transitions.sonyaBlade.demolition.oneTwo,
    transitions.sonyaBlade.demolition.oneTwo,
    transitions.sonyaBlade.demolition.oneTwoFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const sonyaBladeDemolitionCombos = {
  sourcePath: "characters/sonya-blade/demolition.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    sonyaBladeDemolitionStarter001Combo,
    sonyaBladeDemolitionCommunityBeginner001Combo,
    sonyaBladeDemolitionCommunityBeginner002Combo,
    sonyaBladeDemolitionCommunityBeginner003Combo,
    sonyaBladeDemolitionCommunityBeginner004Combo,
    sonyaBladeDemolitionCommunityCorner015Combo,
    sonyaBladeDemolitionCommunityCorner017Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
