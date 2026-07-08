import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.predator;
const variationSlug = "hish-qu-ten";
const variationId = `${characterId}:${variationSlug}` as const;

const predatorHishQuTenStarter001Combo = {
  id: "predator-hish-qu-ten-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Predator Hish-Qu-Ten starter",
    fallback: "Predator Hish-Qu-Ten starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 24,
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
    transitions.predator.universal.openingAssault,
    transitions.predator.universal.risingAssault,
    transitions.predator.hishQuTen.hishQuTenTechnique,
    transitions.predator.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const predatorHishQuTenCombos = {
  sourcePath: "characters/predator/hish-qu-ten.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [predatorHishQuTenStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
