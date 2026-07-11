import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

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
    moves.kungLao.universal.openingAssault,
    moves.kungLao.universal.risingAssault,
    moves.kungLao.hatTrick.hatTrickTechnique,
    moves.kungLao.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const kungLaoHatTrickCombos = {
  sourcePath: "characters/kung-lao/hat-trick.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [kungLaoHatTrickStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
