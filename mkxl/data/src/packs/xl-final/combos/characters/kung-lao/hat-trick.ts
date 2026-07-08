import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.kungLao;
const variationSlug = "hat-trick";
const variationId = `${characterId}:${variationSlug}` as const;

const kungLaoHatTrickStarter001Combo = {
  id: "kung-lao-hat-trick-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kung Lao Hat Trick starter",
    fallback: "Kung Lao Hat Trick starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 30,
    meter: 0,
    position: "midscreen",
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
    transitions.kungLao.universal.openingAssault,
    transitions.kungLao.universal.risingAssault,
    transitions.kungLao.hatTrick.hatTrickTechnique,
    transitions.kungLao.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const kungLaoHatTrickCombos = {
  sourcePath: "characters/kung-lao/hat-trick.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [kungLaoHatTrickStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
