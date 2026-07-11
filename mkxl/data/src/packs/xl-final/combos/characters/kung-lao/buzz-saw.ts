import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

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
    moves.kungLao.universal.openingAssault,
    moves.kungLao.universal.risingAssault,
    moves.kungLao.buzzSaw.buzzSawTechnique,
    moves.kungLao.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const kungLaoBuzzSawCombos = {
  sourcePath: "characters/kung-lao/buzz-saw.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [kungLaoBuzzSawStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
