import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.liuKang;
const variationSlug = "dualist";
const variationId = `${characterId}:${variationSlug}` as const;

const liuKangDualistStarter001Combo = {
  id: "liu-kang-dualist-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Liu Kang Dualist starter",
    fallback: "Liu Kang Dualist starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 27,
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
    moves.liuKang.universal.openingAssault,
    moves.liuKang.universal.risingAssault,
    moves.liuKang.dualist.dualistTechnique,
    moves.liuKang.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const liuKangDualistCombos = {
  sourcePath: "characters/liu-kang/dualist.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [liuKangDualistStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
