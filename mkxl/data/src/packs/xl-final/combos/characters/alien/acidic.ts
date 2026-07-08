import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.alien;
const variationSlug = "acidic";
const variationId = `${characterId}:${variationSlug}` as const;

const alienAcidicStarter001Combo = {
  id: "alien-acidic-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Alien Acidic starter",
    fallback: "Alien Acidic starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 25,
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
    transitions.alien.universal.openingAssault,
    transitions.alien.universal.risingAssault,
    transitions.alien.acidic.acidicTechnique,
    transitions.alien.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const alienAcidicCombos = {
  sourcePath: "characters/alien/acidic.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [alienAcidicStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
