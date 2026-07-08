import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.triborg;
const variationSlug = "smoke";
const variationId = `${characterId}:${variationSlug}` as const;

const triborgSmokeStarter001Combo = {
  id: "triborg-smoke-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Triborg Smoke starter",
    fallback: "Triborg Smoke starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 30,
    meter: 1,
    position: "midscreen",
    starter: "Opening Assault",
    routeType: "metered",
    difficulty: "medium",
    tags: ["starter", "metered"],
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
    transitions.triborg.universal.openingAssault,
    transitions.triborg.universal.risingAssault,
    transitions.triborg.smoke.smokeTechnique,
    transitions.triborg.universal.closingStrikeEnhanced,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const triborgSmokeCombos = {
  sourcePath: "characters/triborg/smoke.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [triborgSmokeStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
