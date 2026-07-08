import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.kano;
const variationSlug = "commando";
const variationId = `${characterId}:${variationSlug}` as const;

const kanoCommandoStarter001Combo = {
  id: "kano-commando-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kano Commando starter",
    fallback: "Kano Commando starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 24,
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
    transitions.kano.universal.openingAssault,
    transitions.kano.universal.risingAssault,
    transitions.kano.commando.commandoTechnique,
    transitions.kano.universal.closingStrikeEnhanced,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const kanoCommandoCombos = {
  sourcePath: "characters/kano/commando.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [kanoCommandoStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
