import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.mileena;
const variationSlug = "ethereal";
const variationId = `${characterId}:${variationSlug}` as const;

const mileenaEtherealStarter001Combo = {
  id: "mileena-ethereal-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Mileena Ethereal starter",
    fallback: "Mileena Ethereal starter",
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
    transitions.mileena.universal.openingAssault,
    transitions.mileena.universal.risingAssault,
    transitions.mileena.ethereal.etherealTechnique,
    transitions.mileena.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const mileenaEtherealCombos = {
  sourcePath: "characters/mileena/ethereal.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [mileenaEtherealStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
