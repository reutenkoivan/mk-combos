import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.tanya;
const variationSlug = "pyromancer";
const variationId = `${characterId}:${variationSlug}` as const;

const tanyaPyromancerStarter001Combo = {
  id: "tanya-pyromancer-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Tanya Pyromancer starter",
    fallback: "Tanya Pyromancer starter",
  },
  stageContext: {
    kind: "stageSpecific",
    stageId: "lin-kuei-temple",
    zoneId: "lin-kuei-temple:mid",
    segmentId: "lin-kuei-temple:mid-screen",
    interactableIds: ["lin-kuei-temple:position-escape"],
  },
  metadata: {
    damage: 24,
    meter: 0,
    position: "corner",
    starter: "Opening Assault",
    routeType: "stage",
    difficulty: "medium",
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
    transitions.tanya.universal.openingAssault,
    transitions.tanya.universal.risingAssault,
    transitions.tanya.pyromancer.pyromancerTechnique,
    transitions.tanya.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const tanyaPyromancerCombos = {
  sourcePath: "characters/tanya/pyromancer.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [tanyaPyromancerStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
