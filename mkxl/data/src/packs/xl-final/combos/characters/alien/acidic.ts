import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

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
    moves.alien.universal.openingAssault,
    moves.alien.universal.risingAssault,
    moves.alien.acidic.acidicTechnique,
    moves.alien.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const alienAcidicCombos = {
  sourcePath: "characters/alien/acidic.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [alienAcidicStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
