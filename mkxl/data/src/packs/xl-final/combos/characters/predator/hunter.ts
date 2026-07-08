import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.predator;
const variationSlug = "hunter";
const variationId = `${characterId}:${variationSlug}` as const;

const predatorHunterStarter001Combo = {
  id: "predator-hunter-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Predator Hunter starter",
    fallback: "Predator Hunter starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 26,
    meter: 0,
    position: "corner",
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
    transitions.predator.universal.openingAssault,
    transitions.predator.universal.risingAssault,
    transitions.predator.hunter.hunterTechnique,
    transitions.predator.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const predatorHunterCommunityOptimal012Combo = {
  id: "predator-hunter-community-optimal-012",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Predator Hunter 32+EXDB4-DD1-BF2-F4-B311+BF4",
    fallback: "Predator Hunter 32+EXDB4-DD1-BF2-F4-B311+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 35,
    meter: 1,
    position: "midscreen",
    starter: "32+EXDB4",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "optimal", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: 32+EXDB4-DD1-BF2-F4-B311+BF4.",
    fallback:
      "Community combo source route. Section: optimal. Raw notation: 32+EXDB4-DD1-BF2-F4-B311+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.predator.hunter.threeTwoIntoExDBFour,
    transitions.predator.hunter.dDOne,
    transitions.predator.hunter.bFTwo,
    transitions.predator.hunter.fFour,
    transitions.predator.hunter.bThreeOneOneIntoBFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const predatorHunterCombos = {
  sourcePath: "characters/predator/hunter.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [predatorHunterStarter001Combo, predatorHunterCommunityOptimal012Combo],
} as const satisfies MkxlAuthoredVariationCombos;
