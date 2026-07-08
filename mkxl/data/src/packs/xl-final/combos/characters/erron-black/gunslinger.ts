import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.erronBlack;
const variationSlug = "gunslinger";
const variationId = `${characterId}:${variationSlug}` as const;

const erronBlackGunslingerStarter001Combo = {
  id: "erron-black-gunslinger-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Erron Black Gunslinger starter",
    fallback: "Erron Black Gunslinger starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 31,
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
    transitions.erronBlack.universal.openingAssault,
    transitions.erronBlack.universal.risingAssault,
    transitions.erronBlack.gunslinger.gunslingerTechnique,
    transitions.erronBlack.universal.closingStrikeEnhanced,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const erronBlackGunslingerCombos = {
  sourcePath: "characters/erron-black/gunslinger.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [erronBlackGunslingerStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
