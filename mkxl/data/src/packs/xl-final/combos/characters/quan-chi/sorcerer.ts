import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.quanChi;
const variationSlug = "sorcerer";
const variationId = `${characterId}:${variationSlug}` as const;

const quanChiSorcererStarter001Combo = {
  id: "quan-chi-sorcerer-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Quan Chi Sorcerer starter",
    fallback: "Quan Chi Sorcerer starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 29,
    meter: 1,
    position: "midscreen",
    starter: "Opening Assault",
    routeType: "metered",
    difficulty: "easy",
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
    moves.quanChi.universal.openingAssault,
    moves.quanChi.universal.risingAssault,
    moves.quanChi.sorcerer.sorcererTechnique,
    moves.quanChi.universal.closingStrikeEnhanced,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const quanChiSorcererCombos = {
  sourcePath: "characters/quan-chi/sorcerer.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [quanChiSorcererStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
