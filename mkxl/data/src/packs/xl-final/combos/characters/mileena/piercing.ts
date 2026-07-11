import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.mileena;
const variationSlug = "piercing";
const variationId = `${characterId}:${variationSlug}` as const;

const mileenaPiercingStarter001Combo = {
  id: "mileena-piercing-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Mileena Piercing starter",
    fallback: "Mileena Piercing starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 31,
    meter: 0,
    position: "midscreen",
    starter: "Opening Assault",
    routeType: "bnb",
    difficulty: "easy",
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
    moves.mileena.universal.openingAssault,
    moves.mileena.universal.risingAssault,
    moves.mileena.piercing.piercingTechnique,
    moves.mileena.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const mileenaPiercingCombos = {
  sourcePath: "characters/mileena/piercing.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [mileenaPiercingStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
