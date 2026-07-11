import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.tanya;
const variationSlug = "dragon-naginata";
const variationId = `${characterId}:${variationSlug}` as const;

const tanyaDragonNaginataStarter001Combo = {
  id: "tanya-dragon-naginata-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Tanya Dragon Naginata starter",
    fallback: "Tanya Dragon Naginata starter",
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
    moves.tanya.universal.openingAssault,
    moves.tanya.universal.risingAssault,
    moves.tanya.dragonNaginata.dragonNaginataTechnique,
    moves.tanya.universal.closingStrikeEnhanced,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const tanyaDragonNaginataCombos = {
  sourcePath: "characters/tanya/dragon-naginata.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [tanyaDragonNaginataStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
