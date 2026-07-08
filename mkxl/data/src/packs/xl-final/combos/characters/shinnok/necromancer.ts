import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.shinnok;
const variationSlug = "necromancer";
const variationId = `${characterId}:${variationSlug}` as const;

const shinnokNecromancerStarter001Combo = {
  id: "shinnok-necromancer-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Shinnok Necromancer starter",
    fallback: "Shinnok Necromancer starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 30,
    meter: 0,
    position: "midscreen",
    starter: "Opening Assault",
    routeType: "bnb",
    difficulty: "medium",
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
    transitions.shinnok.universal.openingAssault,
    transitions.shinnok.universal.risingAssault,
    transitions.shinnok.necromancer.necromancerTechnique,
    transitions.shinnok.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const shinnokNecromancerCombos = {
  sourcePath: "characters/shinnok/necromancer.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [shinnokNecromancerStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
