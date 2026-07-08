import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.triborg;
const variationSlug = "cyrax";
const variationId = `${characterId}:${variationSlug}` as const;

const triborgCyraxStarter001Combo = {
  id: "triborg-cyrax-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Triborg Cyrax starter",
    fallback: "Triborg Cyrax starter",
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
    transitions.triborg.universal.openingAssault,
    transitions.triborg.universal.risingAssault,
    transitions.triborg.cyrax.cyraxTechnique,
    transitions.triborg.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const triborgCyraxCommunityBeginner001Combo = {
  id: "triborg-cyrax-community-beginner-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Triborg Cyrax F43+EXDB4-F43+DB4",
    fallback: "Triborg Cyrax F43+EXDB4-F43+DB4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 30,
    meter: 1,
    position: "midscreen",
    starter: "F43+EXDB4",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F43+EXDB4-F43+DB4.",
    fallback: "Community combo source route. Section: beginner. Raw notation: F43+EXDB4-F43+DB4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.triborg.cyrax.fFourThreeIntoExDBFour,
    transitions.triborg.cyrax.fFourThreeIntoDBFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const triborgCyraxCommunityCorner024Combo = {
  id: "triborg-cyrax-community-corner-024",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Triborg Cyrax B2-4-21-21-114+BF1-DB3-F34-B-D2",
    fallback: "Triborg Cyrax B2-4-21-21-114+BF1-DB3-F34-B-D2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 36,
    meter: 0,
    position: "corner",
    starter: "B2",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B2-4-21-21-114+BF1-DB3-F34-B-D2.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: B2-4-21-21-114+BF1-DB3-F34-B-D2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.triborg.cyrax.bTwo,
    transitions.triborg.cyrax.four,
    transitions.triborg.cyrax.twoOne,
    transitions.triborg.cyrax.twoOne,
    transitions.triborg.cyrax.oneOneFourIntoBFOne,
    transitions.triborg.cyrax.dBThree,
    transitions.triborg.cyrax.fThreeFour,
    transitions.triborg.cyrax.b,
    transitions.triborg.cyrax.dTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const triborgCyraxCommunityCorner025Combo = {
  id: "triborg-cyrax-community-corner-025",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Triborg Cyrax B2-D2-F1-F13+BF1-DD3-FF-D2-D2",
    fallback: "Triborg Cyrax B2-D2-F1-F13+BF1-DD3-FF-D2-D2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 33,
    meter: 0,
    position: "corner",
    starter: "B2",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B2-D2-F1-F13+BF1-DD3-FF-D2-D2.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: B2-D2-F1-F13+BF1-DD3-FF-D2-D2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.triborg.cyrax.bTwo,
    transitions.triborg.cyrax.dTwo,
    transitions.triborg.cyrax.fOne,
    transitions.triborg.cyrax.fOneThreeIntoBFOne,
    transitions.triborg.cyrax.dDThree,
    transitions.triborg.cyrax.fF,
    transitions.triborg.cyrax.dTwo,
    transitions.triborg.cyrax.dTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const triborgCyraxCombos = {
  sourcePath: "characters/triborg/cyrax.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    triborgCyraxStarter001Combo,
    triborgCyraxCommunityBeginner001Combo,
    triborgCyraxCommunityCorner024Combo,
    triborgCyraxCommunityCorner025Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
