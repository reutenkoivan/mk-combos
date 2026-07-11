import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.tremor;
const variationSlug = "aftershock";
const variationId = `${characterId}:${variationSlug}` as const;

const tremorAftershockStarter001Combo = {
  id: "tremor-aftershock-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Tremor Aftershock starter",
    fallback: "Tremor Aftershock starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 28,
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
    moves.tremor.universal.openingAssault,
    moves.tremor.universal.risingAssault,
    moves.tremor.aftershock.aftershockTechnique,
    moves.tremor.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const tremorAftershockCombos = {
  sourcePath: "characters/tremor/aftershock.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [tremorAftershockStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
