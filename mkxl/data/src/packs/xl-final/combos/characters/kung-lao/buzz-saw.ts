import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.kungLao;
const variationSlug = "buzz-saw";
const variationId = `${characterId}:${variationSlug}` as const;

const kungLaoBuzzSawStarter001Combo = {
  id: "kung-lao-buzz-saw-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kung Lao Buzz Saw starter",
    fallback: "Kung Lao Buzz Saw starter",
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
    transitions.kungLao.universal.openingAssault,
    transitions.kungLao.universal.risingAssault,
    transitions.kungLao.buzzSaw.buzzSawTechnique,
    transitions.kungLao.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const kungLaoBuzzSawCombos = {
  sourcePath: "characters/kung-lao/buzz-saw.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [kungLaoBuzzSawStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
