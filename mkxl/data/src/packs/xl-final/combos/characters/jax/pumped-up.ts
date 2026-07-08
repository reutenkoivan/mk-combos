import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.jax;
const variationSlug = "pumped-up";
const variationId = `${characterId}:${variationSlug}` as const;

const jaxPumpedUpStarter001Combo = {
  id: "jax-pumped-up-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jax Pumped Up starter",
    fallback: "Jax Pumped Up starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 29,
    meter: 1,
    position: "midscreen",
    starter: "Opening Assault",
    routeType: "metered",
    difficulty: "easy",
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
    transitions.jax.universal.openingAssault,
    transitions.jax.universal.risingAssault,
    transitions.jax.pumpedUp.pumpedUpTechnique,
    transitions.jax.universal.closingStrikeEnhanced,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const jaxPumpedUpCombos = {
  sourcePath: "characters/jax/pumped-up.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [jaxPumpedUpStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
