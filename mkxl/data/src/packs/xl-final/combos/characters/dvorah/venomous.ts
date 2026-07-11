import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.dvorah;
const variationSlug = "venomous";
const variationId = `${characterId}:${variationSlug}` as const;

const dvorahVenomousStarter001Combo = {
  id: "dvorah-venomous-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "D'Vorah Venomous starter",
    fallback: "D'Vorah Venomous starter",
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
    moves.dvorah.universal.openingAssault,
    moves.dvorah.universal.risingAssault,
    moves.dvorah.venomous.venomousTechnique,
    moves.dvorah.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const dvorahVenomousCombos = {
  sourcePath: "characters/dvorah/venomous.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [dvorahVenomousStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
