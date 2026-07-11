import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

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
    moves.kano.universal.openingAssault,
    moves.kano.universal.risingAssault,
    moves.kano.cybernetic.cyberneticTechnique,
    moves.kano.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const kanoCyberneticCombos = {
  sourcePath: "characters/kano/cybernetic.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [kanoCyberneticStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
