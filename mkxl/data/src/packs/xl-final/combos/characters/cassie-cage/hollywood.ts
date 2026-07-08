import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.cassieCage;
const variationSlug = "hollywood";
const variationId = `${characterId}:${variationSlug}` as const;

const cassieCageHollywoodStarter001Combo = {
  id: "cassie-cage-hollywood-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Cassie Cage Hollywood starter",
    fallback: "Cassie Cage Hollywood starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 31,
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
    transitions.cassieCage.universal.openingAssault,
    transitions.cassieCage.universal.risingAssault,
    transitions.cassieCage.hollywood.hollywoodTechnique,
    transitions.cassieCage.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const cassieCageHollywoodCommunityCorner016Combo = {
  id: "cassie-cage-hollywood-community-corner-016",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Cassie Cage Hollywood 242-121-21U4-21U4-123+DB2-B1+DB2-B1+DB2",
    fallback: "Cassie Cage Hollywood 242-121-21U4-21U4-123+DB2-B1+DB2-B1+DB2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 41,
    meter: 0,
    position: "corner",
    starter: "242",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 242-121-21U4-21U4-123+DB2-B1+DB2-B1+DB2.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: 242-121-21U4-21U4-123+DB2-B1+DB2-B1+DB2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.cassieCage.hollywood.twoFourTwo,
    transitions.cassieCage.hollywood.oneTwoOne,
    transitions.cassieCage.hollywood.twoOneUFour,
    transitions.cassieCage.hollywood.twoOneUFour,
    transitions.cassieCage.hollywood.oneTwoThreeIntoDBTwo,
    transitions.cassieCage.hollywood.bOneIntoDBTwo,
    transitions.cassieCage.hollywood.bOneIntoDBTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const cassieCageHollywoodCommunityCorner018Combo = {
  id: "cassie-cage-hollywood-community-corner-018",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Cassie Cage Hollywood F3+EXDB2-121-21U4-21U4-123+DB2-B1+DB2",
    fallback: "Cassie Cage Hollywood F3+EXDB2-121-21U4-21U4-123+DB2-B1+DB2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 42,
    meter: 1,
    position: "corner",
    starter: "F3+EXDB2",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: F3+EXDB2-121-21U4-21U4-123+DB2-B1+DB2.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: F3+EXDB2-121-21U4-21U4-123+DB2-B1+DB2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.cassieCage.hollywood.fThreeIntoExDBTwo,
    transitions.cassieCage.hollywood.oneTwoOne,
    transitions.cassieCage.hollywood.twoOneUFour,
    transitions.cassieCage.hollywood.twoOneUFour,
    transitions.cassieCage.hollywood.oneTwoThreeIntoDBTwo,
    transitions.cassieCage.hollywood.bOneIntoDBTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const cassieCageHollywoodCommunityCorner019Combo = {
  id: "cassie-cage-hollywood-community-corner-019",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Cassie Cage Hollywood F44+BF4-121-21U4-21U4-123+DB2-B1+DB2-B1+DB2",
    fallback: "Cassie Cage Hollywood F44+BF4-121-21U4-21U4-123+DB2-B1+DB2-B1+DB2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 39,
    meter: 0,
    position: "corner",
    starter: "F44+BF4",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: F44+BF4-121-21U4-21U4-123+DB2-B1+DB2-B1+DB2.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: F44+BF4-121-21U4-21U4-123+DB2-B1+DB2-B1+DB2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.cassieCage.hollywood.fFourFourIntoBFFour,
    transitions.cassieCage.hollywood.oneTwoOne,
    transitions.cassieCage.hollywood.twoOneUFour,
    transitions.cassieCage.hollywood.twoOneUFour,
    transitions.cassieCage.hollywood.oneTwoThreeIntoDBTwo,
    transitions.cassieCage.hollywood.bOneIntoDBTwo,
    transitions.cassieCage.hollywood.bOneIntoDBTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const cassieCageHollywoodCommunityCorner020Combo = {
  id: "cassie-cage-hollywood-community-corner-020",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Cassie Cage Hollywood B12+DB2-121-21U4-21U4-123+DB2-B1+DB2",
    fallback: "Cassie Cage Hollywood B12+DB2-121-21U4-21U4-123+DB2-B1+DB2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 39,
    meter: 0,
    position: "corner",
    starter: "B12+DB2",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B12+DB2-121-21U4-21U4-123+DB2-B1+DB2.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: B12+DB2-121-21U4-21U4-123+DB2-B1+DB2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.cassieCage.hollywood.bOneTwoIntoDBTwo,
    transitions.cassieCage.hollywood.oneTwoOne,
    transitions.cassieCage.hollywood.twoOneUFour,
    transitions.cassieCage.hollywood.twoOneUFour,
    transitions.cassieCage.hollywood.oneTwoThreeIntoDBTwo,
    transitions.cassieCage.hollywood.bOneIntoDBTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const cassieCageHollywoodCommunityCorner021Combo = {
  id: "cassie-cage-hollywood-community-corner-021",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Cassie Cage Hollywood 112+121-21U4-21U4-123+DB2-B1+DB2-B1+DB2",
    fallback: "Cassie Cage Hollywood 112+121-21U4-21U4-123+DB2-B1+DB2-B1+DB2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 32,
    meter: 0,
    position: "corner",
    starter: "112+121",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 112+121-21U4-21U4-123+DB2-B1+DB2-B1+DB2.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: 112+121-21U4-21U4-123+DB2-B1+DB2-B1+DB2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.cassieCage.hollywood.oneOneTwoIntoOneTwoOne,
    transitions.cassieCage.hollywood.twoOneUFour,
    transitions.cassieCage.hollywood.twoOneUFour,
    transitions.cassieCage.hollywood.oneTwoThreeIntoDBTwo,
    transitions.cassieCage.hollywood.bOneIntoDBTwo,
    transitions.cassieCage.hollywood.bOneIntoDBTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const cassieCageHollywoodCombos = {
  sourcePath: "characters/cassie-cage/hollywood.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    cassieCageHollywoodStarter001Combo,
    cassieCageHollywoodCommunityCorner016Combo,
    cassieCageHollywoodCommunityCorner018Combo,
    cassieCageHollywoodCommunityCorner019Combo,
    cassieCageHollywoodCommunityCorner020Combo,
    cassieCageHollywoodCommunityCorner021Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
