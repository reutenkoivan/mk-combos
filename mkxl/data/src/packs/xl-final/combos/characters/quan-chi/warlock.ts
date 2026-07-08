import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.quanChi;
const variationSlug = "warlock";
const variationId = `${characterId}:${variationSlug}` as const;

const quanChiWarlockStarter001Combo = {
  id: "quan-chi-warlock-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Quan Chi Warlock starter",
    fallback: "Quan Chi Warlock starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 28,
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
    transitions.quanChi.universal.openingAssault,
    transitions.quanChi.universal.risingAssault,
    transitions.quanChi.warlock.warlockTechnique,
    transitions.quanChi.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const quanChiWarlockCombos = {
  sourcePath: "characters/quan-chi/warlock.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [quanChiWarlockStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
