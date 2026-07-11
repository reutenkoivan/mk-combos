import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.scorpion;
const variationSlug = "hellfire";
const variationId = `${characterId}:${variationSlug}` as const;

const scorpionHellfireStarter001Combo = {
  id: "scorpion-hellfire-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Scorpion Hellfire starter",
    fallback: "Scorpion Hellfire starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 29,
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
    moves.scorpion.universal.openingAssault,
    moves.scorpion.universal.risingAssault,
    moves.scorpion.hellfire.hellfireTechnique,
    moves.scorpion.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const scorpionHellfireCombos = {
  sourcePath: "characters/scorpion/hellfire.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [scorpionHellfireStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
