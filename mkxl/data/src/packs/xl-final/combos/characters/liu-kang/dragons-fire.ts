import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.liuKang;
const variationSlug = "dragons-fire";
const variationId = `${characterId}:${variationSlug}` as const;

const liuKangDragonsFireStarter001Combo = {
  id: "liu-kang-dragons-fire-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Liu Kang Dragon's Fire starter",
    fallback: "Liu Kang Dragon's Fire starter",
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
    transitions.liuKang.universal.openingAssault,
    transitions.liuKang.universal.risingAssault,
    transitions.liuKang.dragonsFire.dragonsFireTechnique,
    transitions.liuKang.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const liuKangDragonsFireCombos = {
  sourcePath: "characters/liu-kang/dragons-fire.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [liuKangDragonsFireStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
