import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.predator;
const variationSlug = "warrior";
const variationId = `${characterId}:${variationSlug}` as const;

const predatorWarriorStarter001Combo = {
  id: "predator-warrior-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Predator Warrior starter",
    fallback: "Predator Warrior starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 25,
    meter: 1,
    position: "midscreen",
    starter: "Opening Assault",
    routeType: "metered",
    difficulty: "easy",
    tags: ["starter", "metered"],
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
    moves.predator.warrior.warriorTechnique,
    moves.predator.universal.closingStrikeEnhanced,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const predatorWarriorCombos = {
  sourcePath: "characters/predator/warrior.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [predatorWarriorStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
