import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.kano;
const variationSlug = "cybernetic";
const variationId = `${characterId}:${variationSlug}` as const;

const kanoCyberneticStarter001Combo = {
  id: "kano-cybernetic-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kano Cybernetic starter",
    fallback: "Kano Cybernetic starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 26,
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
    transitions.kano.universal.openingAssault,
    transitions.kano.universal.risingAssault,
    transitions.kano.cybernetic.cyberneticTechnique,
    transitions.kano.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const kanoCyberneticCombos = {
  sourcePath: "characters/kano/cybernetic.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [kanoCyberneticStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
