import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.kungLao;
const variationSlug = "tempest";
const variationId = `${characterId}:${variationSlug}` as const;

const kungLaoTempestStarter001Combo = {
  id: "kung-lao-tempest-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kung Lao Tempest starter",
    fallback: "Kung Lao Tempest starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 31,
    meter: 1,
    position: "midscreen",
    starter: "Opening Assault",
    routeType: "metered",
    difficulty: "easy",
    tags: ["starter", "metered"],
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
    moves.kungLao.tempest.tempestTechnique,
    moves.kungLao.universal.closingStrikeEnhanced,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kungLaoTempestCommunityBeginner001Combo = {
  id: "kung-lao-tempest-community-beginner-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kung Lao Tempest B12+DB1-B12+DF1-D2",
    fallback: "Kung Lao Tempest B12+DB1-B12+DF1-D2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 23,
    meter: 0,
    position: "midscreen",
    starter: "B12+DB1",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B12+DB1-B12+DF1-D2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B12+DB1-B12+DF1-D2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.kungLao.tempest.bOneTwo,
    moves.kungLao.tempest.dBOne,
    moves.kungLao.tempest.bOneTwo,
    moves.kungLao.tempest.dFOne,
    moves.kungLao.tempest.dTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kungLaoTempestCommunityBeginner002Combo = {
  id: "kung-lao-tempest-community-beginner-002",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kung Lao Tempest F23+DB1-B12+DF1-D2",
    fallback: "Kung Lao Tempest F23+DB1-B12+DF1-D2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 24,
    meter: 0,
    position: "midscreen",
    starter: "F23+DB1",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F23+DB1-B12+DF1-D2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: F23+DB1-B12+DF1-D2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.kungLao.tempest.fTwoThree,
    moves.kungLao.tempest.dBOne,
    moves.kungLao.tempest.bOneTwo,
    moves.kungLao.tempest.dFOne,
    moves.kungLao.tempest.dTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kungLaoTempestCommunityBeginner003Combo = {
  id: "kung-lao-tempest-community-beginner-003",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kung Lao Tempest B2+DB1-B12+DF1-D2",
    fallback: "Kung Lao Tempest B2+DB1-B12+DF1-D2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 22,
    meter: 0,
    position: "midscreen",
    starter: "B2+DB1",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B2+DB1-B12+DF1-D2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B2+DB1-B12+DF1-D2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.kungLao.tempest.bTwo,
    moves.kungLao.tempest.dBOne,
    moves.kungLao.tempest.bOneTwo,
    moves.kungLao.tempest.dFOne,
    moves.kungLao.tempest.dTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kungLaoTempestCommunityBeginner004Combo = {
  id: "kung-lao-tempest-community-beginner-004",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kung Lao Tempest B321+DB1-B321",
    fallback: "Kung Lao Tempest B321+DB1-B321",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 24,
    meter: 0,
    position: "midscreen",
    starter: "B321+DB1",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B321+DB1-B321.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B321+DB1-B321.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.kungLao.tempest.bThreeTwoOne,
    moves.kungLao.tempest.dBOne,
    moves.kungLao.tempest.bThreeTwoOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kungLaoTempestCommunityBeginner006Combo = {
  id: "kung-lao-tempest-community-beginner-006",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kung Lao Tempest F23+DB1-B12+DF1-B321+EXDF1-D2",
    fallback: "Kung Lao Tempest F23+DB1-B12+DF1-B321+EXDF1-D2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 32,
    meter: 1,
    position: "midscreen",
    starter: "F23+DB1",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F23+DB1-B12+DF1-B321+EXDF1-D2.",
    fallback:
      "Community combo source route. Section: beginner. Raw notation: F23+DB1-B12+DF1-B321+EXDF1-D2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.kungLao.tempest.fTwoThree,
    moves.kungLao.tempest.dBOne,
    moves.kungLao.tempest.bOneTwo,
    moves.kungLao.tempest.dFOne,
    moves.kungLao.tempest.bThreeTwoOne,
    moves.kungLao.tempest.exDFOne,
    moves.kungLao.tempest.dTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const kungLaoTempestCombos = {
  sourcePath: "characters/kung-lao/tempest.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    kungLaoTempestStarter001Combo,
    kungLaoTempestCommunityBeginner001Combo,
    kungLaoTempestCommunityBeginner002Combo,
    kungLaoTempestCommunityBeginner003Combo,
    kungLaoTempestCommunityBeginner004Combo,
    kungLaoTempestCommunityBeginner006Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
