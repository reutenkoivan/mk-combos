import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.ferraTorr;
const variationSlug = "lackey";
const variationId = `${characterId}:${variationSlug}` as const;

const ferraTorrLackeyStarter001Combo = {
  id: "ferra-torr-lackey-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Ferra/Torr Lackey starter",
    fallback: "Ferra/Torr Lackey starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 24,
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
    moves.ferraTorr.universal.openingAssault,
    moves.ferraTorr.universal.risingAssault,
    moves.ferraTorr.lackey.lackeyTechnique,
    moves.ferraTorr.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const ferraTorrLackeyCombos = {
  sourcePath: "characters/ferra-torr/lackey.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [ferraTorrLackeyStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
