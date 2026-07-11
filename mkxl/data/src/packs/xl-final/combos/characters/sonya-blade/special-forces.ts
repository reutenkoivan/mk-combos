import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.sonyaBlade;
const variationSlug = "special-forces";
const variationId = `${characterId}:${variationSlug}` as const;

const sonyaBladeSpecialForcesStarter001Combo = {
  id: "sonya-blade-special-forces-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Sonya Blade Special Forces starter",
    fallback: "Sonya Blade Special Forces starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 25,
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
    moves.sonyaBlade.universal.openingAssault,
    moves.sonyaBlade.universal.risingAssault,
    moves.sonyaBlade.specialForces.specialForcesTechnique,
    moves.sonyaBlade.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const sonyaBladeSpecialForcesCombos = {
  sourcePath: "characters/sonya-blade/special-forces.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [sonyaBladeSpecialForcesStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
