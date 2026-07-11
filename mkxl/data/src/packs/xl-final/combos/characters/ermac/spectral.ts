import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.ermac;
const variationSlug = "spectral";
const variationId = `${characterId}:${variationSlug}` as const;

const ermacSpectralStarter001Combo = {
  id: "ermac-spectral-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Ermac Spectral starter",
    fallback: "Ermac Spectral starter",
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
    moves.ermac.universal.openingAssault,
    moves.ermac.universal.risingAssault,
    moves.ermac.spectral.spectralTechnique,
    moves.ermac.universal.closingStrikeEnhanced,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const ermacSpectralCombos = {
  sourcePath: "characters/ermac/spectral.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [ermacSpectralStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
