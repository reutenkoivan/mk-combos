import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.boRaiCho;
const variationSlug = "dragon-breath";
const variationId = `${characterId}:${variationSlug}` as const;

const boRaiChoDragonBreathStarter001Combo = {
  id: "bo-rai-cho-dragon-breath-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Bo' Rai Cho Dragon Breath starter",
    fallback: "Bo' Rai Cho Dragon Breath starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 28,
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
    transitions.boRaiCho.universal.openingAssault,
    transitions.boRaiCho.universal.risingAssault,
    transitions.boRaiCho.dragonBreath.dragonBreathTechnique,
    transitions.boRaiCho.universal.closingStrikeEnhanced,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const boRaiChoDragonBreathCombos = {
  sourcePath: "characters/bo-rai-cho/dragon-breath.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [boRaiChoDragonBreathStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
