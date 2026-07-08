import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.kungJin;
const variationSlug = "ancestral";
const variationId = `${characterId}:${variationSlug}` as const;

const kungJinAncestralStarter001Combo = {
  id: "kung-jin-ancestral-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kung Jin Ancestral starter",
    fallback: "Kung Jin Ancestral starter",
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
    difficulty: "hard",
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
    transitions.kungJin.universal.openingAssault,
    transitions.kungJin.universal.risingAssault,
    transitions.kungJin.ancestral.ancestralTechnique,
    transitions.kungJin.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const kungJinAncestralCombos = {
  sourcePath: "characters/kung-jin/ancestral.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [kungJinAncestralStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
