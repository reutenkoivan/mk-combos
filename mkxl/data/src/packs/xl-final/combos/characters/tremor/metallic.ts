import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.tremor;
const variationSlug = "metallic";
const variationId = `${characterId}:${variationSlug}` as const;

const tremorMetallicStarter001Combo = {
  id: "tremor-metallic-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Tremor Metallic starter",
    fallback: "Tremor Metallic starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 29,
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
    transitions.tremor.universal.openingAssault,
    transitions.tremor.universal.risingAssault,
    transitions.tremor.metallic.metallicTechnique,
    transitions.tremor.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const tremorMetallicCombos = {
  sourcePath: "characters/tremor/metallic.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [tremorMetallicStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
