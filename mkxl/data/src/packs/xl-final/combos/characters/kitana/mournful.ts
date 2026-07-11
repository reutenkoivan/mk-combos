import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.kitana;
const variationSlug = "mournful";
const variationId = `${characterId}:${variationSlug}` as const;

const kitanaMournfulStarter001Combo = {
  id: "kitana-mournful-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kitana Mournful starter",
    fallback: "Kitana Mournful starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 30,
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
    moves.kitana.universal.openingAssault,
    moves.kitana.universal.risingAssault,
    moves.kitana.mournful.mournfulTechnique,
    moves.kitana.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const kitanaMournfulCombos = {
  sourcePath: "characters/kitana/mournful.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [kitanaMournfulStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
