import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.shinnok;
const variationSlug = "bone-shaper";
const variationId = `${characterId}:${variationSlug}` as const;

const shinnokBoneShaperStarter001Combo = {
  id: "shinnok-bone-shaper-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Shinnok Bone Shaper starter",
    fallback: "Shinnok Bone Shaper starter",
  },
  stageContext: {
    kind: "stageSpecific",
    stageId: "sky-temple",
    zoneId: "sky-temple:mid",
    segmentId: "sky-temple:mid-screen",
    interactableIds: ["sky-temple:position-escape"],
  },
  metadata: {
    damage: 32,
    meter: 1,
    position: "corner",
    starter: "Opening Assault",
    routeType: "stage",
    difficulty: "easy",
    tags: ["starter", "stage"],
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
    moves.shinnok.universal.openingAssault,
    moves.shinnok.universal.risingAssault,
    moves.shinnok.boneShaper.boneShaperTechnique,
    moves.shinnok.universal.closingStrikeEnhanced,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const shinnokBoneShaperCommunityBeginner001Combo = {
  id: "shinnok-bone-shaper-community-beginner-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Shinnok Bone Shaper F41D2+BF3",
    fallback: "Shinnok Bone Shaper F41D2+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 15,
    meter: 0,
    position: "midscreen",
    starter: "F41D2+BF3",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F41D2+BF3.",
    fallback: "Community combo source route. Section: beginner. Raw notation: F41D2+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [moves.shinnok.boneShaper.fFourOneDTwo, moves.shinnok.boneShaper.bFThree],
} as const satisfies MkxlAuthoredSeededCombo;

const shinnokBoneShaperCommunityBeginner002Combo = {
  id: "shinnok-bone-shaper-community-beginner-002",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Shinnok Bone Shaper B3-B1+BF3",
    fallback: "Shinnok Bone Shaper B3-B1+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 18,
    meter: 0,
    position: "midscreen",
    starter: "B3",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B3-B1+BF3.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B3-B1+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.shinnok.boneShaper.bThree,
    moves.shinnok.boneShaper.bOne,
    moves.shinnok.boneShaper.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const shinnokBoneShaperCommunityBeginner003Combo = {
  id: "shinnok-bone-shaper-community-beginner-003",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Shinnok Bone Shaper 112+BF3",
    fallback: "Shinnok Bone Shaper 112+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 17,
    meter: 0,
    position: "midscreen",
    starter: "112+BF3",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 112+BF3.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 112+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [moves.shinnok.boneShaper.oneOneTwo, moves.shinnok.boneShaper.bFThree],
} as const satisfies MkxlAuthoredSeededCombo;

const shinnokBoneShaperCommunityBeginner004Combo = {
  id: "shinnok-bone-shaper-community-beginner-004",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Shinnok Bone Shaper F41D2+DB2(MB)-DASH-D2",
    fallback: "Shinnok Bone Shaper F41D2+DB2(MB)-DASH-D2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 26,
    meter: 1,
    position: "midscreen",
    starter: "F41D2+DB2(MB)",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F41D2+DB2(MB)-DASH-D2.",
    fallback:
      "Community combo source route. Section: beginner. Raw notation: F41D2+DB2(MB)-DASH-D2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.shinnok.boneShaper.fFourOneDTwo,
    moves.shinnok.boneShaper.dBTwo,
    moves.shinnok.boneShaper.mb,
    moves.general.universal.dash,
    moves.shinnok.boneShaper.dTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const shinnokBoneShaperCommunityBeginner006Combo = {
  id: "shinnok-bone-shaper-community-beginner-006",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Shinnok Bone Shaper B3-B1+BF3(MB)-D2",
    fallback: "Shinnok Bone Shaper B3-B1+BF3(MB)-D2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 27,
    meter: 1,
    position: "midscreen",
    starter: "B3",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B3-B1+BF3(MB)-D2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B3-B1+BF3(MB)-D2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.shinnok.boneShaper.bThree,
    moves.shinnok.boneShaper.bOne,
    moves.shinnok.boneShaper.bFThree,
    moves.shinnok.boneShaper.mb,
    moves.shinnok.boneShaper.dTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const shinnokBoneShaperCommunityCorner013Combo = {
  id: "shinnok-bone-shaper-community-corner-013",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Shinnok Bone Shaper F41D2-D1-D1-D1-112+BF3",
    fallback: "Shinnok Bone Shaper F41D2-D1-D1-D1-112+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 24,
    meter: 0,
    position: "corner",
    starter: "F41D2",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: F41D2-D1-D1-D1-112+BF3.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: F41D2-D1-D1-D1-112+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.shinnok.boneShaper.fFourOneDTwo,
    moves.shinnok.boneShaper.dOne,
    moves.shinnok.boneShaper.dOne,
    moves.shinnok.boneShaper.dOne,
    moves.shinnok.boneShaper.oneOneTwo,
    moves.shinnok.boneShaper.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const shinnokBoneShaperCommunityCorner015Combo = {
  id: "shinnok-bone-shaper-community-corner-015",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Shinnok Bone Shaper B3-B3-D1-D1-112+BF3",
    fallback: "Shinnok Bone Shaper B3-B3-D1-D1-112+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 25,
    meter: 0,
    position: "corner",
    starter: "B3",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B3-B3-D1-D1-112+BF3.",
    fallback: "Community combo source route. Section: corner. Raw notation: B3-B3-D1-D1-112+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.shinnok.boneShaper.bThree,
    moves.shinnok.boneShaper.bThree,
    moves.shinnok.boneShaper.dOne,
    moves.shinnok.boneShaper.dOne,
    moves.shinnok.boneShaper.oneOneTwo,
    moves.shinnok.boneShaper.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const shinnokBoneShaperCommunityCorner016Combo = {
  id: "shinnok-bone-shaper-community-corner-016",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Shinnok Bone Shaper B3-B3-112+DB2(MB)-D2-112+BF3",
    fallback: "Shinnok Bone Shaper B3-B3-112+DB2(MB)-D2-112+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 35,
    meter: 1,
    position: "corner",
    starter: "B3",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B3-B3-112+DB2(MB)-D2-112+BF3.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: B3-B3-112+DB2(MB)-D2-112+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.shinnok.boneShaper.bThree,
    moves.shinnok.boneShaper.bThree,
    moves.shinnok.boneShaper.oneOneTwo,
    moves.shinnok.boneShaper.dBTwo,
    moves.shinnok.boneShaper.mb,
    moves.shinnok.boneShaper.dTwo,
    moves.shinnok.boneShaper.oneOneTwo,
    moves.shinnok.boneShaper.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const shinnokBoneShaperCommunityCorner017Combo = {
  id: "shinnok-bone-shaper-community-corner-017",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Shinnok Bone Shaper 312-D1-112+BF3",
    fallback: "Shinnok Bone Shaper 312-D1-112+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 28,
    meter: 0,
    position: "corner",
    starter: "312",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 312-D1-112+BF3.",
    fallback: "Community combo source route. Section: corner. Raw notation: 312-D1-112+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.shinnok.boneShaper.threeOneTwo,
    moves.shinnok.boneShaper.dOne,
    moves.shinnok.boneShaper.oneOneTwo,
    moves.shinnok.boneShaper.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const shinnokBoneShaperCommunityCorner018Combo = {
  id: "shinnok-bone-shaper-community-corner-018",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Shinnok Bone Shaper 312-D1-112+DB2(MB)-D2-11+BF3",
    fallback: "Shinnok Bone Shaper 312-D1-112+DB2(MB)-D2-11+BF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 38,
    meter: 1,
    position: "corner",
    starter: "312",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 312-D1-112+DB2(MB)-D2-11+BF3.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: 312-D1-112+DB2(MB)-D2-11+BF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.shinnok.boneShaper.threeOneTwo,
    moves.shinnok.boneShaper.dOne,
    moves.shinnok.boneShaper.oneOneTwo,
    moves.shinnok.boneShaper.dBTwo,
    moves.shinnok.boneShaper.mb,
    moves.shinnok.boneShaper.dTwo,
    moves.shinnok.boneShaper.oneOne,
    moves.shinnok.boneShaper.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const shinnokBoneShaperCombos = {
  sourcePath: "characters/shinnok/bone-shaper.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    shinnokBoneShaperStarter001Combo,
    shinnokBoneShaperCommunityBeginner001Combo,
    shinnokBoneShaperCommunityBeginner002Combo,
    shinnokBoneShaperCommunityBeginner003Combo,
    shinnokBoneShaperCommunityBeginner004Combo,
    shinnokBoneShaperCommunityBeginner006Combo,
    shinnokBoneShaperCommunityCorner013Combo,
    shinnokBoneShaperCommunityCorner015Combo,
    shinnokBoneShaperCommunityCorner016Combo,
    shinnokBoneShaperCommunityCorner017Combo,
    shinnokBoneShaperCommunityCorner018Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
