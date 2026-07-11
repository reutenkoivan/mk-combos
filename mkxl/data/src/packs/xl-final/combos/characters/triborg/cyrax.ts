import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

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
    moves.triborg.universal.openingAssault,
    moves.triborg.universal.risingAssault,
    moves.triborg.cyrax.cyraxTechnique,
    moves.triborg.universal.closingStrike,
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
    moves.triborg.cyrax.fFourThree,
    moves.triborg.cyrax.exDBFour,
    moves.triborg.cyrax.fFourThree,
    moves.triborg.cyrax.dBFour,
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
    moves.triborg.cyrax.bTwo,
    moves.triborg.cyrax.four,
    moves.triborg.cyrax.twoOne,
    moves.triborg.cyrax.twoOne,
    moves.triborg.cyrax.oneOneFour,
    moves.triborg.cyrax.bFOne,
    moves.triborg.cyrax.dBThree,
    moves.triborg.cyrax.fThreeFour,
    moves.triborg.cyrax.b,
    moves.triborg.cyrax.dTwo,
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
    moves.triborg.cyrax.bTwo,
    moves.triborg.cyrax.dTwo,
    moves.triborg.cyrax.fOne,
    moves.triborg.cyrax.fOneThree,
    moves.triborg.cyrax.bFOne,
    moves.triborg.cyrax.dDThree,
    moves.triborg.cyrax.fF,
    moves.triborg.cyrax.dTwo,
    moves.triborg.cyrax.dTwo,
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
