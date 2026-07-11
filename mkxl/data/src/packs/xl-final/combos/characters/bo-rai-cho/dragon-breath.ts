import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

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
    moves.boRaiCho.universal.openingAssault,
    moves.boRaiCho.universal.risingAssault,
    moves.boRaiCho.dragonBreath.dragonBreathTechnique,
    moves.boRaiCho.universal.closingStrikeEnhanced,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const boRaiChoDragonBreathCombos = {
  sourcePath: "characters/bo-rai-cho/dragon-breath.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [boRaiChoDragonBreathStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
