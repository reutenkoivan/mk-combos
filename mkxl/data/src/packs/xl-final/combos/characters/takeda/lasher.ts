import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.takeda;
const variationSlug = "lasher";
const variationId = `${characterId}:${variationSlug}` as const;

const takedaLasherStarter001Combo = {
  id: "takeda-lasher-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Takeda Lasher starter",
    fallback: "Takeda Lasher starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 32,
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
    moves.takeda.universal.openingAssault,
    moves.takeda.universal.risingAssault,
    moves.takeda.lasher.lasherTechnique,
    moves.takeda.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const takedaLasherCombos = {
  sourcePath: "characters/takeda/lasher.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [takedaLasherStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
