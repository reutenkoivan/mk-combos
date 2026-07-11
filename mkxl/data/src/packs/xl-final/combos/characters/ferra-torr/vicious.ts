import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.ferraTorr;
const variationSlug = "vicious";
const variationId = `${characterId}:${variationSlug}` as const;

const ferraTorrViciousStarter001Combo = {
  id: "ferra-torr-vicious-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Ferra/Torr Vicious starter",
    fallback: "Ferra/Torr Vicious starter",
  },
  stageContext: {
    kind: "stageSpecific",
    stageId: "lin-kuei-temple",
    zoneId: "lin-kuei-temple:mid",
    segmentId: "lin-kuei-temple:mid-screen",
    interactableIds: ["lin-kuei-temple:position-escape"],
  },
  metadata: {
    damage: 26,
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
    moves.ferraTorr.universal.openingAssault,
    moves.ferraTorr.universal.risingAssault,
    moves.ferraTorr.vicious.viciousTechnique,
    moves.ferraTorr.universal.closingStrikeEnhanced,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const ferraTorrViciousCombos = {
  sourcePath: "characters/ferra-torr/vicious.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [ferraTorrViciousStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
