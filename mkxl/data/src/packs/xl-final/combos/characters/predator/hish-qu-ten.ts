import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

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
    moves.predator.universal.openingAssault,
    moves.predator.universal.risingAssault,
    moves.predator.hishQuTen.hishQuTenTechnique,
    moves.predator.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const predatorHishQuTenCombos = {
  sourcePath: "characters/predator/hish-qu-ten.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [predatorHishQuTenStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
