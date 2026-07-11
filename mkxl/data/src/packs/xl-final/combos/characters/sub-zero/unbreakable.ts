import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.subZero;
const variationSlug = "unbreakable";
const variationId = `${characterId}:${variationSlug}` as const;

const subZeroUnbreakableStarter001Combo = {
  id: "sub-zero-unbreakable-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Sub-Zero Unbreakable starter",
    fallback: "Sub-Zero Unbreakable starter",
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
    moves.subZero.universal.openingAssault,
    moves.subZero.universal.risingAssault,
    moves.subZero.unbreakable.unbreakableTechnique,
    moves.subZero.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const subZeroUnbreakableCombos = {
  sourcePath: "characters/sub-zero/unbreakable.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [subZeroUnbreakableStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
