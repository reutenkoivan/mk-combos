import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.subZero;
const variationSlug = "cryomancer";
const variationId = `${characterId}:${variationSlug}` as const;

const subZeroCryomancerStarter001Combo = {
  id: "sub-zero-cryomancer-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Sub-Zero Cryomancer starter",
    fallback: "Sub-Zero Cryomancer starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 28,
    meter: 0,
    position: "corner",
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
    moves.subZero.cryomancer.cryomancerTechnique,
    moves.subZero.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const subZeroCryomancerCombos = {
  sourcePath: "characters/sub-zero/cryomancer.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [subZeroCryomancerStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
