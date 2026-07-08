import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.johnnyCage;
const variationSlug = "fisticuffs";
const variationId = `${characterId}:${variationSlug}` as const;

const johnnyCageFisticuffsStarter001Combo = {
  id: "johnny-cage-fisticuffs-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Johnny Cage Fisticuffs starter",
    fallback: "Johnny Cage Fisticuffs starter",
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
    transitions.johnnyCage.universal.openingAssault,
    transitions.johnnyCage.universal.risingAssault,
    transitions.johnnyCage.fisticuffs.fisticuffsTechnique,
    transitions.johnnyCage.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const johnnyCageFisticuffsCombos = {
  sourcePath: "characters/johnny-cage/fisticuffs.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [johnnyCageFisticuffsStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
