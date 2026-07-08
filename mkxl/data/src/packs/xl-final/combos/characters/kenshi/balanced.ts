import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.kenshi;
const variationSlug = "balanced";
const variationId = `${characterId}:${variationSlug}` as const;

const kenshiBalancedStarter001Combo = {
  id: "kenshi-balanced-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kenshi Balanced starter",
    fallback: "Kenshi Balanced starter",
  },
  stageContext: {
    kind: "stageSpecific",
    stageId: "the-pit",
    zoneId: "the-pit:mid",
    segmentId: "the-pit:mid-screen",
    interactableIds: ["the-pit:position-escape"],
  },
  metadata: {
    damage: 28,
    meter: 1,
    position: "corner",
    starter: "Opening Assault",
    routeType: "stage",
    difficulty: "easy",
    tags: ["starter", "stage"],
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
    transitions.kenshi.universal.openingAssault,
    transitions.kenshi.universal.risingAssault,
    transitions.kenshi.balanced.balancedTechnique,
    transitions.kenshi.universal.closingStrikeEnhanced,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const kenshiBalancedCombos = {
  sourcePath: "characters/kenshi/balanced.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [kenshiBalancedStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
