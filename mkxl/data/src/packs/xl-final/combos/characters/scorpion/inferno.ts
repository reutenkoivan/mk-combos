import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.scorpion;
const variationSlug = "inferno";
const variationId = `${characterId}:${variationSlug}` as const;

const scorpionInfernoStarter001Combo = {
  id: "scorpion-inferno-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Scorpion Inferno starter",
    fallback: "Scorpion Inferno starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 27,
    meter: 0,
    position: "corner",
    starter: "Opening Assault",
    routeType: "bnb",
    difficulty: "medium",
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
    transitions.scorpion.universal.openingAssault,
    transitions.scorpion.universal.risingAssault,
    transitions.scorpion.inferno.infernoTechnique,
    transitions.scorpion.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const scorpionInfernoCombos = {
  sourcePath: "characters/scorpion/inferno.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [scorpionInfernoStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
