import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.goro;
const variationSlug = "tigrar-fury";
const variationId = `${characterId}:${variationSlug}` as const;

const goroTigrarFuryStarter001Combo = {
  id: "goro-tigrar-fury-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Goro Tigrar Fury starter",
    fallback: "Goro Tigrar Fury starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 27,
    meter: 0,
    position: "midscreen",
    starter: "Opening Assault",
    routeType: "bnb",
    difficulty: "hard",
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
    moves.goro.universal.openingAssault,
    moves.goro.universal.risingAssault,
    moves.goro.tigrarFury.tigrarFuryTechnique,
    moves.goro.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const goroTigrarFuryCombos = {
  sourcePath: "characters/goro/tigrar-fury.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [goroTigrarFuryStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
