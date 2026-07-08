import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

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
    transitions.subZero.universal.openingAssault,
    transitions.subZero.universal.risingAssault,
    transitions.subZero.cryomancer.cryomancerTechnique,
    transitions.subZero.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const subZeroCryomancerCombos = {
  sourcePath: "characters/sub-zero/cryomancer.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [subZeroCryomancerStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
