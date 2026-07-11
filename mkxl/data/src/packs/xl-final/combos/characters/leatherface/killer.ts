import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.leatherface;
const variationSlug = "killer";
const variationId = `${characterId}:${variationSlug}` as const;

const leatherfaceKillerStarter001Combo = {
  id: "leatherface-killer-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Leatherface Killer starter",
    fallback: "Leatherface Killer starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 25,
    meter: 0,
    position: "corner",
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
    moves.leatherface.universal.openingAssault,
    moves.leatherface.universal.risingAssault,
    moves.leatherface.killer.killerTechnique,
    moves.leatherface.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const leatherfaceKillerCommunityBeginner001Combo = {
  id: "leatherface-killer-community-beginner-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Leatherface Killer 122-12+BD4-F12+DB1",
    fallback: "Leatherface Killer 122-12+BD4-F12+DB1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 29,
    meter: 0,
    position: "midscreen",
    starter: "122",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 122-12+BD4-F12+DB1.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 122-12+BD4-F12+DB1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.leatherface.killer.oneTwoTwo,
    moves.leatherface.killer.oneTwo,
    moves.leatherface.killer.bDFour,
    moves.leatherface.killer.fOneTwo,
    moves.leatherface.killer.dBOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const leatherfaceKillerCommunityBeginner002Combo = {
  id: "leatherface-killer-community-beginner-002",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Leatherface Killer F12+BD4-F21D2-F12+DB1",
    fallback: "Leatherface Killer F12+BD4-F21D2-F12+DB1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 32,
    meter: 0,
    position: "midscreen",
    starter: "F12+BD4",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F12+BD4-F21D2-F12+DB1.",
    fallback:
      "Community combo source route. Section: beginner. Raw notation: F12+BD4-F21D2-F12+DB1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.leatherface.killer.fOneTwo,
    moves.leatherface.killer.bDFour,
    moves.leatherface.killer.fTwoOneDTwo,
    moves.leatherface.killer.fOneTwo,
    moves.leatherface.killer.dBOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const leatherfaceKillerCommunityBeginner003Combo = {
  id: "leatherface-killer-community-beginner-003",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Leatherface Killer F12+DB3+1-(MB)-12+BD4-F12+DB1",
    fallback: "Leatherface Killer F12+DB3+1-(MB)-12+BD4-F12+DB1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 39,
    meter: 1,
    position: "midscreen",
    starter: "F12+DB3+1",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F12+DB3+1-(MB)-12+BD4-F12+DB1.",
    fallback:
      "Community combo source route. Section: beginner. Raw notation: F12+DB3+1-(MB)-12+BD4-F12+DB1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.leatherface.killer.fOneTwo,
    moves.leatherface.killer.dBThree,
    moves.leatherface.killer.one,
    moves.leatherface.killer.mb,
    moves.leatherface.killer.oneTwo,
    moves.leatherface.killer.bDFour,
    moves.leatherface.killer.fOneTwo,
    moves.leatherface.killer.dBOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const leatherfaceKillerCommunityBeginner004Combo = {
  id: "leatherface-killer-community-beginner-004",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Leatherface Killer F21D2-12+BD4-F12+DB1",
    fallback: "Leatherface Killer F21D2-12+BD4-F12+DB1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 32,
    meter: 0,
    position: "midscreen",
    starter: "F21D2",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F21D2-12+BD4-F12+DB1.",
    fallback:
      "Community combo source route. Section: beginner. Raw notation: F21D2-12+BD4-F12+DB1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.leatherface.killer.fTwoOneDTwo,
    moves.leatherface.killer.oneTwo,
    moves.leatherface.killer.bDFour,
    moves.leatherface.killer.fOneTwo,
    moves.leatherface.killer.dBOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const leatherfaceKillerCommunityBeginner005Combo = {
  id: "leatherface-killer-community-beginner-005",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Leatherface Killer F3+BD4-F21D2-F12+DB1",
    fallback: "Leatherface Killer F3+BD4-F21D2-F12+DB1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 29,
    meter: 0,
    position: "midscreen",
    starter: "F3+BD4",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F3+BD4-F21D2-F12+DB1.",
    fallback:
      "Community combo source route. Section: beginner. Raw notation: F3+BD4-F21D2-F12+DB1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.leatherface.killer.fThree,
    moves.leatherface.killer.bDFour,
    moves.leatherface.killer.fTwoOneDTwo,
    moves.leatherface.killer.fOneTwo,
    moves.leatherface.killer.dBOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const leatherfaceKillerCommunityBeginner006Combo = {
  id: "leatherface-killer-community-beginner-006",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Leatherface Killer B1+DB3+1-(MB)-12+BD4-F12+DB1",
    fallback: "Leatherface Killer B1+DB3+1-(MB)-12+BD4-F12+DB1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 38,
    meter: 1,
    position: "midscreen",
    starter: "B1+DB3+1",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B1+DB3+1-(MB)-12+BD4-F12+DB1.",
    fallback:
      "Community combo source route. Section: beginner. Raw notation: B1+DB3+1-(MB)-12+BD4-F12+DB1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.leatherface.killer.bOne,
    moves.leatherface.killer.dBThree,
    moves.leatherface.killer.one,
    moves.leatherface.killer.mb,
    moves.leatherface.killer.oneTwo,
    moves.leatherface.killer.bDFour,
    moves.leatherface.killer.fOneTwo,
    moves.leatherface.killer.dBOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const leatherfaceKillerCommunityBeginner007Combo = {
  id: "leatherface-killer-community-beginner-007",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Leatherface Killer F3+DB3+1-(MB)-12+BD4-F12+DB1",
    fallback: "Leatherface Killer F3+DB3+1-(MB)-12+BD4-F12+DB1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 36,
    meter: 1,
    position: "midscreen",
    starter: "F3+DB3+1",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F3+DB3+1-(MB)-12+BD4-F12+DB1.",
    fallback:
      "Community combo source route. Section: beginner. Raw notation: F3+DB3+1-(MB)-12+BD4-F12+DB1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.leatherface.killer.fThree,
    moves.leatherface.killer.dBThree,
    moves.leatherface.killer.one,
    moves.leatherface.killer.mb,
    moves.leatherface.killer.oneTwo,
    moves.leatherface.killer.bDFour,
    moves.leatherface.killer.fOneTwo,
    moves.leatherface.killer.dBOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const leatherfaceKillerCommunityCorner019Combo = {
  id: "leatherface-killer-community-corner-019",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Leatherface Killer B1+BD4-F21D2-F12+DB4-F12+DB4",
    fallback: "Leatherface Killer B1+BD4-F21D2-F12+DB4-F12+DB4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 35,
    meter: 0,
    position: "corner",
    starter: "B1+BD4",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B1+BD4-F21D2-F12+DB4-F12+DB4.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: B1+BD4-F21D2-F12+DB4-F12+DB4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.leatherface.killer.bOne,
    moves.leatherface.killer.bDFour,
    moves.leatherface.killer.fTwoOneDTwo,
    moves.leatherface.killer.fOneTwo,
    moves.leatherface.killer.dBFour,
    moves.leatherface.killer.fOneTwo,
    moves.leatherface.killer.dBFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const leatherfaceKillerCommunityCorner021Combo = {
  id: "leatherface-killer-community-corner-021",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Leatherface Killer F3+BD4-F21D2-F12+DB4-F12+DB4",
    fallback: "Leatherface Killer F3+BD4-F21D2-F12+DB4-F12+DB4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 33,
    meter: 0,
    position: "corner",
    starter: "F3+BD4",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: F3+BD4-F21D2-F12+DB4-F12+DB4.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: F3+BD4-F21D2-F12+DB4-F12+DB4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    moves.leatherface.killer.fThree,
    moves.leatherface.killer.bDFour,
    moves.leatherface.killer.fTwoOneDTwo,
    moves.leatherface.killer.fOneTwo,
    moves.leatherface.killer.dBFour,
    moves.leatherface.killer.fOneTwo,
    moves.leatherface.killer.dBFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const leatherfaceKillerCombos = {
  sourcePath: "characters/leatherface/killer.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    leatherfaceKillerStarter001Combo,
    leatherfaceKillerCommunityBeginner001Combo,
    leatherfaceKillerCommunityBeginner002Combo,
    leatherfaceKillerCommunityBeginner003Combo,
    leatherfaceKillerCommunityBeginner004Combo,
    leatherfaceKillerCommunityBeginner005Combo,
    leatherfaceKillerCommunityBeginner006Combo,
    leatherfaceKillerCommunityBeginner007Combo,
    leatherfaceKillerCommunityCorner019Combo,
    leatherfaceKillerCommunityCorner021Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
