import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.leatherface;
const variationSlug = "butcher";
const variationId = `${characterId}:${variationSlug}` as const;

const leatherfaceButcherStarter001Combo = {
  id: "leatherface-butcher-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Leatherface Butcher starter",
    fallback: "Leatherface Butcher starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 26,
    meter: 1,
    position: "midscreen",
    starter: "Opening Assault",
    routeType: "metered",
    difficulty: "hard",
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
    moves.leatherface.universal.openingAssault,
    moves.leatherface.universal.risingAssault,
    moves.leatherface.butcher.butcherTechnique,
    moves.leatherface.universal.closingStrikeEnhanced,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const leatherfaceButcherCombos = {
  sourcePath: "characters/leatherface/butcher.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [leatherfaceButcherStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
