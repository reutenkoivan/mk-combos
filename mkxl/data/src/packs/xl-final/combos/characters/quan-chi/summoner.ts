import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.quanChi;
const variationSlug = "summoner";
const variationId = `${characterId}:${variationSlug}` as const;

const quanChiSummonerStarter001Combo = {
  id: "quan-chi-summoner-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Quan Chi Summoner starter",
    fallback: "Quan Chi Summoner starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 27,
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
    moves.quanChi.universal.openingAssault,
    moves.quanChi.universal.risingAssault,
    moves.quanChi.summoner.summonerTechnique,
    moves.quanChi.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const quanChiSummonerCommunityBeginner001Combo = {
  id: "quan-chi-summoner-community-beginner-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Quan Chi Summoner 12+BF3-B324-141",
    fallback: "Quan Chi Summoner 12+BF3-B324-141",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 22,
    meter: 0,
    position: "midscreen",
    starter: "12+BF3",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 12+BF3-B324-141.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 12+BF3-B324-141.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.quanChi.summoner.oneTwo,
    moves.quanChi.summoner.bFThree,
    moves.quanChi.summoner.bThreeTwoFour,
    moves.quanChi.summoner.oneFourOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const quanChiSummonerCommunityBeginner004Combo = {
  id: "quan-chi-summoner-community-beginner-004",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Quan Chi Summoner F4+BF3-B324-141",
    fallback: "Quan Chi Summoner F4+BF3-B324-141",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 25,
    meter: 0,
    position: "midscreen",
    starter: "F4+BF3",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F4+BF3-B324-141.",
    fallback: "Community combo source route. Section: beginner. Raw notation: F4+BF3-B324-141.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.quanChi.summoner.fFour,
    moves.quanChi.summoner.bFThree,
    moves.quanChi.summoner.bThreeTwoFour,
    moves.quanChi.summoner.oneFourOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const quanChiSummonerCombos = {
  sourcePath: "characters/quan-chi/summoner.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    quanChiSummonerStarter001Combo,
    quanChiSummonerCommunityBeginner001Combo,
    quanChiSummonerCommunityBeginner004Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
