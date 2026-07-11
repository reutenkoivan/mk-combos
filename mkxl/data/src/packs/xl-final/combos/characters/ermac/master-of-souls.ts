import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.ermac;
const variationSlug = "master-of-souls";
const variationId = `${characterId}:${variationSlug}` as const;

const ermacMasterOfSoulsStarter001Combo = {
  id: "ermac-master-of-souls-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Ermac Master of Souls starter",
    fallback: "Ermac Master of Souls starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 29,
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
    moves.ermac.universal.openingAssault,
    moves.ermac.universal.risingAssault,
    moves.ermac.masterOfSouls.masterOfSoulsTechnique,
    moves.ermac.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const ermacMasterOfSoulsCommunityBeginner002Combo = {
  id: "ermac-master-of-souls-community-beginner-002",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Ermac Master of Souls 112+BF2-DB4-D2",
    fallback: "Ermac Master of Souls 112+BF2-DB4-D2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 25,
    meter: 0,
    position: "midscreen",
    starter: "112+BF2",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 112+BF2-DB4-D2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 112+BF2-DB4-D2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.ermac.masterOfSouls.oneOneTwo,
    moves.ermac.masterOfSouls.bFTwo,
    moves.ermac.masterOfSouls.dBFour,
    moves.ermac.masterOfSouls.dTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const ermacMasterOfSoulsCombos = {
  sourcePath: "characters/ermac/master-of-souls.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [ermacMasterOfSoulsStarter001Combo, ermacMasterOfSoulsCommunityBeginner002Combo],
} as const satisfies MkxlAuthoredVariationCombos;
