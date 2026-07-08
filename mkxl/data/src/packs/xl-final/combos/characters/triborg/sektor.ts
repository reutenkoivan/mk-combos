import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.triborg;
const variationSlug = "sektor";
const variationId = `${characterId}:${variationSlug}` as const;

const triborgSektorStarter001Combo = {
  id: "triborg-sektor-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Triborg Sektor starter",
    fallback: "Triborg Sektor starter",
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
    transitions.triborg.universal.openingAssault,
    transitions.triborg.universal.risingAssault,
    transitions.triborg.sektor.sektorTechnique,
    transitions.triborg.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const triborgSektorCommunityBeginner001Combo = {
  id: "triborg-sektor-community-beginner-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Triborg Sektor 114+DB4-F43+BF3",
    fallback: "Triborg Sektor 114+DB4-F43+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 29,
    meter: 0,
    position: "midscreen",
    starter: "114+DB4",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 114+DB4-F43+BF3.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 114+DB4-F43+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.triborg.sektor.oneOneFourIntoDBFour,
    transitions.triborg.sektor.fFourThreeIntoBFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const triborgSektorCommunityBeginner002Combo = {
  id: "triborg-sektor-community-beginner-002",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Triborg Sektor F13+DB4-F43+BF3",
    fallback: "Triborg Sektor F13+DB4-F43+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 25,
    meter: 0,
    position: "midscreen",
    starter: "F13+DB4",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F13+DB4-F43+BF3.",
    fallback: "Community combo source route. Section: beginner. Raw notation: F13+DB4-F43+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.triborg.sektor.fOneThreeIntoDBFour,
    transitions.triborg.sektor.fFourThreeIntoBFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const triborgSektorCommunityBeginner003Combo = {
  id: "triborg-sektor-community-beginner-003",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Triborg Sektor F43+DB4-F43+BF3",
    fallback: "Triborg Sektor F43+DB4-F43+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 29,
    meter: 0,
    position: "midscreen",
    starter: "F43+DB4",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F43+DB4-F43+BF3.",
    fallback: "Community combo source route. Section: beginner. Raw notation: F43+DB4-F43+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.triborg.sektor.fFourThreeIntoDBFour,
    transitions.triborg.sektor.fFourThreeIntoBFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const triborgSektorCommunityBeginner004Combo = {
  id: "triborg-sektor-community-beginner-004",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Triborg Sektor B3+DB4-F43+BF3",
    fallback: "Triborg Sektor B3+DB4-F43+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 23,
    meter: 0,
    position: "midscreen",
    starter: "B3+DB4",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B3+DB4-F43+BF3.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B3+DB4-F43+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.triborg.sektor.bThreeIntoDBFour,
    transitions.triborg.sektor.fFourThreeIntoBFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const triborgSektorCommunityBeginner005Combo = {
  id: "triborg-sektor-community-beginner-005",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Triborg Sektor B1+DB4-F43+BF3",
    fallback: "Triborg Sektor B1+DB4-F43+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 23,
    meter: 0,
    position: "midscreen",
    starter: "B1+DB4",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B1+DB4-F43+BF3.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B1+DB4-F43+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.triborg.sektor.bOneIntoDBFour,
    transitions.triborg.sektor.fFourThreeIntoBFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const triborgSektorCommunityCorner018Combo = {
  id: "triborg-sektor-community-corner-018",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Triborg Sektor F34+DB4-21-21-114+EXDD3",
    fallback: "Triborg Sektor F34+DB4-21-21-114+EXDD3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 40,
    meter: 1,
    position: "corner",
    starter: "F34+DB4",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: F34+DB4-21-21-114+EXDD3.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: F34+DB4-21-21-114+EXDD3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.triborg.sektor.fThreeFourIntoDBFour,
    transitions.triborg.sektor.twoOne,
    transitions.triborg.sektor.twoOne,
    transitions.triborg.sektor.oneOneFourIntoExDDThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const triborgSektorCommunityCorner019Combo = {
  id: "triborg-sektor-community-corner-019",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Triborg Sektor F34+DB4-21-F34+BF3",
    fallback: "Triborg Sektor F34+DB4-21-F34+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 32,
    meter: 0,
    position: "corner",
    starter: "F34+DB4",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: F34+DB4-21-F34+BF3.",
    fallback: "Community combo source route. Section: corner. Raw notation: F34+DB4-21-F34+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.triborg.sektor.fThreeFourIntoDBFour,
    transitions.triborg.sektor.twoOne,
    transitions.triborg.sektor.fThreeFourIntoBFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const triborgSektorCombos = {
  sourcePath: "characters/triborg/sektor.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    triborgSektorStarter001Combo,
    triborgSektorCommunityBeginner001Combo,
    triborgSektorCommunityBeginner002Combo,
    triborgSektorCommunityBeginner003Combo,
    triborgSektorCommunityBeginner004Combo,
    triborgSektorCommunityBeginner005Combo,
    triborgSektorCommunityCorner018Combo,
    triborgSektorCommunityCorner019Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
