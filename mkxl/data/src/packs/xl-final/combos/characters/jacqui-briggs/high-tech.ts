import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.jacquiBriggs;
const variationSlug = "high-tech";
const variationId = `${characterId}:${variationSlug}` as const;

const jacquiBriggsHighTechStarter001Combo = {
  id: "jacqui-briggs-high-tech-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jacqui Briggs High Tech starter",
    fallback: "Jacqui Briggs High Tech starter",
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
    transitions.jacquiBriggs.universal.openingAssault,
    transitions.jacquiBriggs.universal.risingAssault,
    transitions.jacquiBriggs.highTech.highTechTechnique,
    transitions.jacquiBriggs.universal.closingStrikeEnhanced,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const jacquiBriggsHighTechCombos = {
  sourcePath: "characters/jacqui-briggs/high-tech.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [jacquiBriggsHighTechStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
