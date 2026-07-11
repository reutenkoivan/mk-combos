import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.ermac;
const variationSlug = "mystic";
const variationId = `${characterId}:${variationSlug}` as const;

const ermacMysticStarter001Combo = {
  id: "ermac-mystic-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Ermac Mystic starter",
    fallback: "Ermac Mystic starter",
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
    moves.ermac.universal.openingAssault,
    moves.ermac.universal.risingAssault,
    moves.ermac.mystic.mysticTechnique,
    moves.ermac.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const ermacMysticCombos = {
  sourcePath: "characters/ermac/mystic.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [ermacMysticStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
