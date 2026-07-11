import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

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
    moves.kano.universal.openingAssault,
    moves.kano.universal.risingAssault,
    moves.kano.commando.commandoTechnique,
    moves.kano.universal.closingStrikeEnhanced,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const kanoCommandoCombos = {
  sourcePath: "characters/kano/commando.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [kanoCommandoStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
