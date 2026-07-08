import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.raiden;
const variationSlug = "displacer";
const variationId = `${characterId}:${variationSlug}` as const;

const raidenDisplacerStarter001Combo = {
  id: "raiden-displacer-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Raiden Displacer starter",
    fallback: "Raiden Displacer starter",
  },
  stageContext: {
    kind: "stageSpecific",
    stageId: "crossroads",
    zoneId: "crossroads:mid",
    segmentId: "crossroads:mid-screen",
    interactableIds: ["crossroads:position-escape"],
  },
  metadata: {
    damage: 31,
    meter: 0,
    position: "corner",
    starter: "Opening Assault",
    routeType: "stage",
    difficulty: "hard",
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
    transitions.raiden.universal.openingAssault,
    transitions.raiden.universal.risingAssault,
    transitions.raiden.displacer.displacerTechnique,
    transitions.raiden.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const raidenDisplacerCombos = {
  sourcePath: "characters/raiden/displacer.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [raidenDisplacerStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
