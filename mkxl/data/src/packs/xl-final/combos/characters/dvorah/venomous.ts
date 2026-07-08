import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

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
    transitions.dvorah.universal.openingAssault,
    transitions.dvorah.universal.risingAssault,
    transitions.dvorah.venomous.venomousTechnique,
    transitions.dvorah.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const dvorahVenomousCombos = {
  sourcePath: "characters/dvorah/venomous.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [dvorahVenomousStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
