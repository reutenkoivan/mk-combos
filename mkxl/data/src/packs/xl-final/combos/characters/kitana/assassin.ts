import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.kitana;
const variationSlug = "assassin";
const variationId = `${characterId}:${variationSlug}` as const;

const kitanaAssassinStarter001Combo = {
  id: "kitana-assassin-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kitana Assassin starter",
    fallback: "Kitana Assassin starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 32,
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
    moves.kitana.universal.openingAssault,
    moves.kitana.universal.risingAssault,
    moves.kitana.assassin.assassinTechnique,
    moves.kitana.universal.closingStrikeEnhanced,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const kitanaAssassinCombos = {
  sourcePath: "characters/kitana/assassin.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [kitanaAssassinStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
