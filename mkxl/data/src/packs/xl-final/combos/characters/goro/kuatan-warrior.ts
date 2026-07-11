import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.goro;
const variationSlug = "kuatan-warrior";
const variationId = `${characterId}:${variationSlug}` as const;

const goroKuatanWarriorStarter001Combo = {
  id: "goro-kuatan-warrior-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Goro Kuatan Warrior starter",
    fallback: "Goro Kuatan Warrior starter",
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
    moves.goro.universal.openingAssault,
    moves.goro.universal.risingAssault,
    moves.goro.kuatanWarrior.kuatanWarriorTechnique,
    moves.goro.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const goroKuatanWarriorCommunityBeginner002Combo = {
  id: "goro-kuatan-warrior-community-beginner-002",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Goro Kuatan Warrior B12U2-B2-F3+BF2",
    fallback: "Goro Kuatan Warrior B12U2-B2-F3+BF2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 28,
    meter: 0,
    position: "midscreen",
    starter: "B12U2",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B12U2-B2-F3+BF2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B12U2-B2-F3+BF2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.goro.kuatanWarrior.bOneTwoUTwo,
    moves.goro.kuatanWarrior.bTwo,
    moves.goro.kuatanWarrior.fThree,
    moves.goro.kuatanWarrior.bFTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const goroKuatanWarriorCommunityBeginner004Combo = {
  id: "goro-kuatan-warrior-community-beginner-004",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Goro Kuatan Warrior 3D3+BF4-MB-F3+BF2",
    fallback: "Goro Kuatan Warrior 3D3+BF4-MB-F3+BF2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 29,
    meter: 1,
    position: "midscreen",
    starter: "3D3+BF4",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 3D3+BF4-MB-F3+BF2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 3D3+BF4-MB-F3+BF2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.goro.kuatanWarrior.threeDThree,
    moves.goro.kuatanWarrior.bFFour,
    moves.goro.kuatanWarrior.mb,
    moves.goro.kuatanWarrior.fThree,
    moves.goro.kuatanWarrior.bFTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const goroKuatanWarriorCommunityOptimal012Combo = {
  id: "goro-kuatan-warrior-community-optimal-012",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Goro Kuatan Warrior 3D3+BF4-MB-F3+DBF3",
    fallback: "Goro Kuatan Warrior 3D3+BF4-MB-F3+DBF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 30,
    meter: 1,
    position: "midscreen",
    starter: "3D3+BF4",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "optimal", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: 3D3+BF4-MB-F3+DBF3.",
    fallback: "Community combo source route. Section: optimal. Raw notation: 3D3+BF4-MB-F3+DBF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.goro.kuatanWarrior.threeDThree,
    moves.goro.kuatanWarrior.bFFour,
    moves.goro.kuatanWarrior.mb,
    moves.goro.kuatanWarrior.fThree,
    moves.goro.kuatanWarrior.dBFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const goroKuatanWarriorCommunityCorner016Combo = {
  id: "goro-kuatan-warrior-community-corner-016",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Goro Kuatan Warrior B12U2-4+EXBF1-D1-121+DBF3",
    fallback: "Goro Kuatan Warrior B12U2-4+EXBF1-D1-121+DBF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 40,
    meter: 1,
    position: "corner",
    starter: "B12U2",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B12U2-4+EXBF1-D1-121+DBF3.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: B12U2-4+EXBF1-D1-121+DBF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.goro.kuatanWarrior.bOneTwoUTwo,
    moves.goro.kuatanWarrior.four,
    moves.goro.kuatanWarrior.exBFOne,
    moves.goro.kuatanWarrior.dOne,
    moves.goro.kuatanWarrior.oneTwoOne,
    moves.goro.kuatanWarrior.dBFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const goroKuatanWarriorCommunityCorner017Combo = {
  id: "goro-kuatan-warrior-community-corner-017",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Goro Kuatan Warrior B12U2-4+EXBF1-D1-121+EXDBF3",
    fallback: "Goro Kuatan Warrior B12U2-4+EXBF1-D1-121+EXDBF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 45,
    meter: 2,
    position: "corner",
    starter: "B12U2",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B12U2-4+EXBF1-D1-121+EXDBF3.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: B12U2-4+EXBF1-D1-121+EXDBF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.goro.kuatanWarrior.bOneTwoUTwo,
    moves.goro.kuatanWarrior.four,
    moves.goro.kuatanWarrior.exBFOne,
    moves.goro.kuatanWarrior.dOne,
    moves.goro.kuatanWarrior.oneTwoOne,
    moves.goro.kuatanWarrior.exDBFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const goroKuatanWarriorCommunityCorner019Combo = {
  id: "goro-kuatan-warrior-community-corner-019",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Goro Kuatan Warrior 3D3-B12U2-4+DBF3",
    fallback: "Goro Kuatan Warrior 3D3-B12U2-4+DBF3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 31,
    meter: 0,
    position: "corner",
    starter: "3D3",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 3D3-B12U2-4+DBF3.",
    fallback: "Community combo source route. Section: corner. Raw notation: 3D3-B12U2-4+DBF3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.goro.kuatanWarrior.threeDThree,
    moves.goro.kuatanWarrior.bOneTwoUTwo,
    moves.goro.kuatanWarrior.four,
    moves.goro.kuatanWarrior.dBFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const goroKuatanWarriorCombos = {
  sourcePath: "characters/goro/kuatan-warrior.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    goroKuatanWarriorStarter001Combo,
    goroKuatanWarriorCommunityBeginner002Combo,
    goroKuatanWarriorCommunityBeginner004Combo,
    goroKuatanWarriorCommunityOptimal012Combo,
    goroKuatanWarriorCommunityCorner016Combo,
    goroKuatanWarriorCommunityCorner017Combo,
    goroKuatanWarriorCommunityCorner019Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
