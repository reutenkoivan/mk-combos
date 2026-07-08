import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.dvorah;
const variationSlug = "brood-mother";
const variationId = `${characterId}:${variationSlug}` as const;

const dvorahBroodMotherStarter001Combo = {
  id: "dvorah-brood-mother-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "D'Vorah Brood Mother starter",
    fallback: "D'Vorah Brood Mother starter",
  },
  stageContext: {
    kind: "stageSpecific",
    stageId: "sky-temple",
    zoneId: "sky-temple:mid",
    segmentId: "sky-temple:mid-screen",
    interactableIds: ["sky-temple:position-escape"],
  },
  metadata: {
    damage: 25,
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
    transitions.dvorah.universal.openingAssault,
    transitions.dvorah.universal.risingAssault,
    transitions.dvorah.broodMother.broodMotherTechnique,
    transitions.dvorah.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const dvorahBroodMotherCommunityBeginner001Combo = {
  id: "dvorah-brood-mother-community-beginner-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "D'Vorah Brood Mother 11B2+F112+DB4",
    fallback: "D'Vorah Brood Mother 11B2+F112+DB4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 21,
    meter: 0,
    position: "midscreen",
    starter: "11B2+F112+DB4",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 11B2+F112+DB4.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 11B2+F112+DB4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [transitions.dvorah.broodMother.oneOneBTwoIntoFOneOneTwoIntoDBFour],
} as const satisfies MkxlAuthoredSeededCombo;

const dvorahBroodMotherCommunityBeginner002Combo = {
  id: "dvorah-brood-mother-community-beginner-002",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "D'Vorah Brood Mother 212+DB1-F112+DB4",
    fallback: "D'Vorah Brood Mother 212+DB1-F112+DB4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 27,
    meter: 0,
    position: "midscreen",
    starter: "212+DB1",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 212+DB1-F112+DB4.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 212+DB1-F112+DB4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.dvorah.broodMother.twoOneTwoIntoDBOne,
    transitions.dvorah.broodMother.fOneOneTwoIntoDBFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const dvorahBroodMotherCommunityBeginner004Combo = {
  id: "dvorah-brood-mother-community-beginner-004",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "D'Vorah Brood Mother F11+DF3-F44-F44+DB4",
    fallback: "D'Vorah Brood Mother F11+DF3-F44-F44+DB4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 28,
    meter: 0,
    position: "midscreen",
    starter: "F11+DF3",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F11+DF3-F44-F44+DB4.",
    fallback: "Community combo source route. Section: beginner. Raw notation: F11+DF3-F44-F44+DB4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.dvorah.broodMother.fOneOneIntoDFThree,
    transitions.dvorah.broodMother.fFourFour,
    transitions.dvorah.broodMother.fFourFourIntoDBFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const dvorahBroodMotherCommunityBeginner005Combo = {
  id: "dvorah-brood-mother-community-beginner-005",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "D'Vorah Brood Mother B1+EXDF1-F112+DB4",
    fallback: "D'Vorah Brood Mother B1+EXDF1-F112+DB4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 23,
    meter: 1,
    position: "midscreen",
    starter: "B1+EXDF1",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B1+EXDF1-F112+DB4.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B1+EXDF1-F112+DB4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.dvorah.broodMother.bOneIntoExDFOne,
    transitions.dvorah.broodMother.fOneOneTwoIntoDBFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const dvorahBroodMotherCommunityOptimal007Combo = {
  id: "dvorah-brood-mother-community-optimal-007",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "D'Vorah Brood Mother 11B2-D1-F44+DB4",
    fallback: "D'Vorah Brood Mother 11B2-D1-F44+DB4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 23,
    meter: 0,
    position: "midscreen",
    starter: "11B2",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "optimal"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: 11B2-D1-F44+DB4.",
    fallback: "Community combo source route. Section: optimal. Raw notation: 11B2-D1-F44+DB4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.dvorah.broodMother.oneOneBTwo,
    transitions.dvorah.broodMother.dOne,
    transitions.dvorah.broodMother.fFourFourIntoDBFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const dvorahBroodMotherCommunityOptimal008Combo = {
  id: "dvorah-brood-mother-community-optimal-008",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "D'Vorah Brood Mother 112+EXDF1-212+DF3-F34-D1-F44+DB4",
    fallback: "D'Vorah Brood Mother 112+EXDF1-212+DF3-F34-D1-F44+DB4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 35,
    meter: 1,
    position: "midscreen",
    starter: "112+EXDF1",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "optimal", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: 112+EXDF1-212+DF3-F34-D1-F44+DB4.",
    fallback:
      "Community combo source route. Section: optimal. Raw notation: 112+EXDF1-212+DF3-F34-D1-F44+DB4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.dvorah.broodMother.oneOneTwoIntoExDFOne,
    transitions.dvorah.broodMother.twoOneTwoIntoDFThree,
    transitions.dvorah.broodMother.fThreeFour,
    transitions.dvorah.broodMother.dOne,
    transitions.dvorah.broodMother.fFourFourIntoDBFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const dvorahBroodMotherCommunityOptimal009Combo = {
  id: "dvorah-brood-mother-community-optimal-009",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "D'Vorah Brood Mother 212+DF3-F34-D1-F44+DB4",
    fallback: "D'Vorah Brood Mother 212+DF3-F34-D1-F44+DB4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 28,
    meter: 0,
    position: "midscreen",
    starter: "212+DF3",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "optimal"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: 212+DF3-F34-D1-F44+DB4.",
    fallback:
      "Community combo source route. Section: optimal. Raw notation: 212+DF3-F34-D1-F44+DB4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.dvorah.broodMother.twoOneTwoIntoDFThree,
    transitions.dvorah.broodMother.fThreeFour,
    transitions.dvorah.broodMother.dOne,
    transitions.dvorah.broodMother.fFourFourIntoDBFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const dvorahBroodMotherCommunityOptimal010Combo = {
  id: "dvorah-brood-mother-community-optimal-010",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "D'Vorah Brood Mother F11+DF3-F34-D1-F34-44+DB4",
    fallback: "D'Vorah Brood Mother F11+DF3-F34-D1-F34-44+DB4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 31,
    meter: 0,
    position: "midscreen",
    starter: "F11+DF3",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "optimal"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: F11+DF3-F34-D1-F34-44+DB4.",
    fallback:
      "Community combo source route. Section: optimal. Raw notation: F11+DF3-F34-D1-F34-44+DB4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.dvorah.broodMother.fOneOneIntoDFThree,
    transitions.dvorah.broodMother.fThreeFour,
    transitions.dvorah.broodMother.dOne,
    transitions.dvorah.broodMother.fThreeFour,
    transitions.dvorah.broodMother.fourFourIntoDBFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const dvorahBroodMotherCommunityOptimal014Combo = {
  id: "dvorah-brood-mother-community-optimal-014",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "D'Vorah Brood Mother F34-D1-F34-D1-F44+DB4",
    fallback: "D'Vorah Brood Mother F34-D1-F34-D1-F44+DB4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 30,
    meter: 0,
    position: "midscreen",
    starter: "F34",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "optimal"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: F34-D1-F34-D1-F44+DB4.",
    fallback:
      "Community combo source route. Section: optimal. Raw notation: F34-D1-F34-D1-F44+DB4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.dvorah.broodMother.fThreeFour,
    transitions.dvorah.broodMother.dOne,
    transitions.dvorah.broodMother.fThreeFour,
    transitions.dvorah.broodMother.dOne,
    transitions.dvorah.broodMother.fFourFourIntoDBFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const dvorahBroodMotherCommunityCorner019Combo = {
  id: "dvorah-brood-mother-community-corner-019",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "D'Vorah Brood Mother 11B2-D1-F44-D1-F44+DB4",
    fallback: "D'Vorah Brood Mother 11B2-D1-F44-D1-F44+DB4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 30,
    meter: 0,
    position: "corner",
    starter: "11B2",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 11B2-D1-F44-D1-F44+DB4.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: 11B2-D1-F44-D1-F44+DB4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.dvorah.broodMother.oneOneBTwo,
    transitions.dvorah.broodMother.dOne,
    transitions.dvorah.broodMother.fFourFour,
    transitions.dvorah.broodMother.dOne,
    transitions.dvorah.broodMother.fFourFourIntoDBFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const dvorahBroodMotherCommunityCorner023Combo = {
  id: "dvorah-brood-mother-community-corner-023",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "D'Vorah Brood Mother F11+DF4-F44-F44-D1-F44+DB4",
    fallback: "D'Vorah Brood Mother F11+DF4-F44-F44-D1-F44+DB4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 33,
    meter: 0,
    position: "corner",
    starter: "F11+DF4",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: F11+DF4-F44-F44-D1-F44+DB4.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: F11+DF4-F44-F44-D1-F44+DB4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.dvorah.broodMother.fOneOneIntoDFFour,
    transitions.dvorah.broodMother.fFourFour,
    transitions.dvorah.broodMother.fFourFour,
    transitions.dvorah.broodMother.dOne,
    transitions.dvorah.broodMother.fFourFourIntoDBFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const dvorahBroodMotherCombos = {
  sourcePath: "characters/dvorah/brood-mother.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    dvorahBroodMotherStarter001Combo,
    dvorahBroodMotherCommunityBeginner001Combo,
    dvorahBroodMotherCommunityBeginner002Combo,
    dvorahBroodMotherCommunityBeginner004Combo,
    dvorahBroodMotherCommunityBeginner005Combo,
    dvorahBroodMotherCommunityOptimal007Combo,
    dvorahBroodMotherCommunityOptimal008Combo,
    dvorahBroodMotherCommunityOptimal009Combo,
    dvorahBroodMotherCommunityOptimal010Combo,
    dvorahBroodMotherCommunityOptimal014Combo,
    dvorahBroodMotherCommunityCorner019Combo,
    dvorahBroodMotherCommunityCorner023Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
