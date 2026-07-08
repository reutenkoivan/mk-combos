import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.kungJin;
const variationSlug = "shaolin";
const variationId = `${characterId}:${variationSlug}` as const;

const kungJinShaolinStarter001Combo = {
  id: "kung-jin-shaolin-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kung Jin Shaolin starter",
    fallback: "Kung Jin Shaolin starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 27,
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
    transitions.kungJin.universal.openingAssault,
    transitions.kungJin.universal.risingAssault,
    transitions.kungJin.shaolin.shaolinTechnique,
    transitions.kungJin.universal.closingStrikeEnhanced,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const kungJinShaolinCombos = {
  sourcePath: "characters/kung-jin/shaolin.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [kungJinShaolinStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
