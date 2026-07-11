import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.raiden;
const variationSlug = "master-of-storms";
const variationId = `${characterId}:${variationSlug}` as const;

const raidenMasterOfStormsStarter001Combo = {
  id: "raiden-master-of-storms-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Raiden Master of Storms starter",
    fallback: "Raiden Master of Storms starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 32,
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
    moves.raiden.universal.openingAssault,
    moves.raiden.universal.risingAssault,
    moves.raiden.masterOfStorms.masterOfStormsTechnique,
    moves.raiden.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const raidenMasterOfStormsCombos = {
  sourcePath: "characters/raiden/master-of-storms.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [raidenMasterOfStormsStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
