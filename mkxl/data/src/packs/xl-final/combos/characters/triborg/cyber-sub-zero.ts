import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.triborg;
const variationSlug = "cyber-sub-zero";
const variationId = `${characterId}:${variationSlug}` as const;

const triborgCyberSubZeroStarter001Combo = {
  id: "triborg-cyber-sub-zero-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Triborg Cyber Sub-Zero starter",
    fallback: "Triborg Cyber Sub-Zero starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 24,
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
    moves.triborg.universal.openingAssault,
    moves.triborg.universal.risingAssault,
    moves.triborg.cyberSubZero.cyberSubZeroTechnique,
    moves.triborg.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const triborgCyberSubZeroCombos = {
  sourcePath: "characters/triborg/cyber-sub-zero.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [triborgCyberSubZeroStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
