import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

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
    transitions.subZero.universal.openingAssault,
    transitions.subZero.universal.risingAssault,
    transitions.subZero.unbreakable.unbreakableTechnique,
    transitions.subZero.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const subZeroUnbreakableCombos = {
  sourcePath: "characters/sub-zero/unbreakable.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [subZeroUnbreakableStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
