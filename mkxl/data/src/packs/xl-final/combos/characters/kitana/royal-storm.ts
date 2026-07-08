import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.kitana;
const variationSlug = "royal-storm";
const variationId = `${characterId}:${variationSlug}` as const;

const kitanaRoyalStormStarter001Combo = {
  id: "kitana-royal-storm-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kitana Royal Storm starter",
    fallback: "Kitana Royal Storm starter",
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
    transitions.kitana.universal.openingAssault,
    transitions.kitana.universal.risingAssault,
    transitions.kitana.royalStorm.royalStormTechnique,
    transitions.kitana.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const kitanaRoyalStormCombos = {
  sourcePath: "characters/kitana/royal-storm.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [kitanaRoyalStormStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
