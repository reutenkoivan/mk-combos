import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

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
    transitions.raiden.universal.openingAssault,
    transitions.raiden.universal.risingAssault,
    transitions.raiden.masterOfStorms.masterOfStormsTechnique,
    transitions.raiden.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const raidenMasterOfStormsCombos = {
  sourcePath: "characters/raiden/master-of-storms.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [raidenMasterOfStormsStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
