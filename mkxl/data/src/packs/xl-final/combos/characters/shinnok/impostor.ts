import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.shinnok;
const variationSlug = "impostor";
const variationId = `${characterId}:${variationSlug}` as const;

const shinnokImpostorStarter001Combo = {
  id: "shinnok-impostor-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Shinnok Impostor starter",
    fallback: "Shinnok Impostor starter",
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
    moves.shinnok.universal.openingAssault,
    moves.shinnok.universal.risingAssault,
    moves.shinnok.impostor.impostorTechnique,
    moves.shinnok.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const shinnokImpostorCombos = {
  sourcePath: "characters/shinnok/impostor.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [shinnokImpostorStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
