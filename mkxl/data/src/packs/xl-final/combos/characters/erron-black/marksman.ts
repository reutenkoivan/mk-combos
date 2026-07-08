import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.erronBlack;
const variationSlug = "marksman";
const variationId = `${characterId}:${variationSlug}` as const;

const erronBlackMarksmanStarter001Combo = {
  id: "erron-black-marksman-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Erron Black Marksman starter",
    fallback: "Erron Black Marksman starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 30,
    meter: 0,
    position: "corner",
    starter: "Opening Assault",
    routeType: "bnb",
    difficulty: "medium",
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
    transitions.erronBlack.universal.openingAssault,
    transitions.erronBlack.universal.risingAssault,
    transitions.erronBlack.marksman.marksmanTechnique,
    transitions.erronBlack.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const erronBlackMarksmanCombos = {
  sourcePath: "characters/erron-black/marksman.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [erronBlackMarksmanStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
