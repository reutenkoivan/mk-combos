import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.takeda;
const variationSlug = "ronin";
const variationId = `${characterId}:${variationSlug}` as const;

const takedaRoninStarter001Combo = {
  id: "takeda-ronin-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Takeda Ronin starter",
    fallback: "Takeda Ronin starter",
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
    difficulty: "medium",
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
    moves.takeda.ronin.roninTechnique,
    moves.takeda.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const takedaRoninCombos = {
  sourcePath: "characters/takeda/ronin.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [takedaRoninStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
