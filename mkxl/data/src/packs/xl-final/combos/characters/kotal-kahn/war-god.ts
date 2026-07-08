import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.kotalKahn;
const variationSlug = "war-god";
const variationId = `${characterId}:${variationSlug}` as const;

const kotalKahnWarGodStarter001Combo = {
  id: "kotal-kahn-war-god-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kotal Kahn War God starter",
    fallback: "Kotal Kahn War God starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 26,
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
    transitions.kotalKahn.universal.openingAssault,
    transitions.kotalKahn.universal.risingAssault,
    transitions.kotalKahn.warGod.warGodTechnique,
    transitions.kotalKahn.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kotalKahnWarGodCommunityBeginner001Combo = {
  id: "kotal-kahn-war-god-community-beginner-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kotal Kahn War God F2-F2-F2-D2",
    fallback: "Kotal Kahn War God F2-F2-F2-D2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 32,
    meter: 0,
    position: "midscreen",
    starter: "F2",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F2-F2-F2-D2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: F2-F2-F2-D2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.dTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kotalKahnWarGodCommunityBeginner002Combo = {
  id: "kotal-kahn-war-god-community-beginner-002",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kotal Kahn War God 114+EXDF1-F2-D2",
    fallback: "Kotal Kahn War God 114+EXDF1-F2-D2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 38,
    meter: 1,
    position: "midscreen",
    starter: "114+EXDF1",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 114+EXDF1-F2-D2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 114+EXDF1-F2-D2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.kotalKahn.warGod.oneOneFourIntoExDFOne,
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.dTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kotalKahnWarGodCommunityBeginner003Combo = {
  id: "kotal-kahn-war-god-community-beginner-003",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kotal Kahn War God F34+DF2",
    fallback: "Kotal Kahn War God F34+DF2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 21,
    meter: 0,
    position: "midscreen",
    starter: "F34+DF2",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F34+DF2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: F34+DF2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [transitions.kotalKahn.warGod.fThreeFourIntoDFTwo],
} as const satisfies MkxlAuthoredSeededCombo;

const kotalKahnWarGodCommunityBeginner004Combo = {
  id: "kotal-kahn-war-god-community-beginner-004",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kotal Kahn War God F3+EXDB1-F2-D2",
    fallback: "Kotal Kahn War God F3+EXDB1-F2-D2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 33,
    meter: 1,
    position: "midscreen",
    starter: "F3+EXDB1",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: F3+EXDB1-F2-D2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: F3+EXDB1-F2-D2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.kotalKahn.warGod.fThreeIntoExDBOne,
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.dTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kotalKahnWarGodCommunityBeginner005Combo = {
  id: "kotal-kahn-war-god-community-beginner-005",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kotal Kahn War God B1+EXDB1-F2-D2",
    fallback: "Kotal Kahn War God B1+EXDB1-F2-D2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 31,
    meter: 1,
    position: "midscreen",
    starter: "B1+EXDB1",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: B1+EXDB1-F2-D2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: B1+EXDB1-F2-D2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.kotalKahn.warGod.bOneIntoExDBOne,
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.dTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kotalKahnWarGodCommunityOptimal006Combo = {
  id: "kotal-kahn-war-god-community-optimal-006",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kotal Kahn War God F2-F2-F2-B122+DB1",
    fallback: "Kotal Kahn War God F2-F2-F2-B122+DB1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 35,
    meter: 0,
    position: "midscreen",
    starter: "F2",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "optimal"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: F2-F2-F2-B122+DB1.",
    fallback: "Community combo source route. Section: optimal. Raw notation: F2-F2-F2-B122+DB1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.bOneTwoTwoIntoDBOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kotalKahnWarGodCommunityOptimal007Combo = {
  id: "kotal-kahn-war-god-community-optimal-007",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kotal Kahn War God F2-F2-F2-B14+EXDF1-B14+DF1",
    fallback: "Kotal Kahn War God F2-F2-F2-B14+EXDF1-B14+DF1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 43,
    meter: 1,
    position: "midscreen",
    starter: "F2",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "optimal", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: F2-F2-F2-B14+EXDF1-B14+DF1.",
    fallback:
      "Community combo source route. Section: optimal. Raw notation: F2-F2-F2-B14+EXDF1-B14+DF1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.bOneFourIntoExDFOne,
    transitions.kotalKahn.warGod.bOneFourIntoDFOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kotalKahnWarGodCommunityOptimal008Combo = {
  id: "kotal-kahn-war-god-community-optimal-008",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kotal Kahn War God F1B2-F2-F2-B122+DB1",
    fallback: "Kotal Kahn War God F1B2-F2-F2-B122+DB1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 31,
    meter: 0,
    position: "midscreen",
    starter: "F1B2",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "optimal"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: F1B2-F2-F2-B122+DB1.",
    fallback: "Community combo source route. Section: optimal. Raw notation: F1B2-F2-F2-B122+DB1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.kotalKahn.warGod.fOneBTwo,
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.bOneTwoTwoIntoDBOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kotalKahnWarGodCommunityOptimal009Combo = {
  id: "kotal-kahn-war-god-community-optimal-009",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kotal Kahn War God F1B2-1-F2-B122+DB1",
    fallback: "Kotal Kahn War God F1B2-1-F2-B122+DB1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 28,
    meter: 0,
    position: "midscreen",
    starter: "F1B2",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "optimal"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: F1B2-1-F2-B122+DB1.",
    fallback: "Community combo source route. Section: optimal. Raw notation: F1B2-1-F2-B122+DB1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.kotalKahn.warGod.fOneBTwo,
    transitions.kotalKahn.warGod.one,
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.bOneTwoTwoIntoDBOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kotalKahnWarGodCommunityOptimal010Combo = {
  id: "kotal-kahn-war-god-community-optimal-010",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kotal Kahn War God F1B2-1F-2-B14+EXDF1-B14+DF1",
    fallback: "Kotal Kahn War God F1B2-1F-2-B14+EXDF1-B14+DF1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 35,
    meter: 1,
    position: "midscreen",
    starter: "F1B2",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "optimal", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: F1B2-1F-2-B14+EXDF1-B14+DF1.",
    fallback:
      "Community combo source route. Section: optimal. Raw notation: F1B2-1F-2-B14+EXDF1-B14+DF1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.kotalKahn.warGod.fOneBTwo,
    transitions.kotalKahn.warGod.oneF,
    transitions.kotalKahn.warGod.two,
    transitions.kotalKahn.warGod.bOneFourIntoExDFOne,
    transitions.kotalKahn.warGod.bOneFourIntoDFOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kotalKahnWarGodCommunityOptimal011Combo = {
  id: "kotal-kahn-war-god-community-optimal-011",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kotal Kahn War God B14+EXDB1-F2-F2-B14+DF1",
    fallback: "Kotal Kahn War God B14+EXDB1-F2-F2-B14+DF1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 39,
    meter: 1,
    position: "midscreen",
    starter: "B14+EXDB1",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "optimal", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: B14+EXDB1-F2-F2-B14+DF1.",
    fallback:
      "Community combo source route. Section: optimal. Raw notation: B14+EXDB1-F2-F2-B14+DF1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.kotalKahn.warGod.bOneFourIntoExDBOne,
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.bOneFourIntoDFOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kotalKahnWarGodCommunityOptimal012Combo = {
  id: "kotal-kahn-war-god-community-optimal-012",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kotal Kahn War God B1+EXDB1-F2-F2-B14+DF1",
    fallback: "Kotal Kahn War God B1+EXDB1-F2-F2-B14+DF1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 36,
    meter: 1,
    position: "midscreen",
    starter: "B1+EXDB1",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "optimal", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: B1+EXDB1-F2-F2-B14+DF1.",
    fallback:
      "Community combo source route. Section: optimal. Raw notation: B1+EXDB1-F2-F2-B14+DF1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.kotalKahn.warGod.bOneIntoExDBOne,
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.bOneFourIntoDFOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kotalKahnWarGodCommunityOptimal013Combo = {
  id: "kotal-kahn-war-god-community-optimal-013",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kotal Kahn War God F3+EXDB1-F2-F2-B14+DF1",
    fallback: "Kotal Kahn War God F3+EXDB1-F2-F2-B14+DF1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 38,
    meter: 1,
    position: "midscreen",
    starter: "F3+EXDB1",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "optimal", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: F3+EXDB1-F2-F2-B14+DF1.",
    fallback:
      "Community combo source route. Section: optimal. Raw notation: F3+EXDB1-F2-F2-B14+DF1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.kotalKahn.warGod.fThreeIntoExDBOne,
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.bOneFourIntoDFOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kotalKahnWarGodCommunityCorner015Combo = {
  id: "kotal-kahn-war-god-community-corner-015",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kotal Kahn War God F2-F2-F2-F2-B14+EXDF1-B14+DF1",
    fallback: "Kotal Kahn War God F2-F2-F2-F2-B14+EXDF1-B14+DF1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 45,
    meter: 1,
    position: "corner",
    starter: "F2",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: F2-F2-F2-F2-B14+EXDF1-B14+DF1.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: F2-F2-F2-F2-B14+EXDF1-B14+DF1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.bOneFourIntoExDFOne,
    transitions.kotalKahn.warGod.bOneFourIntoDFOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kotalKahnWarGodCommunityCorner016Combo = {
  id: "kotal-kahn-war-god-community-corner-016",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kotal Kahn War God F1B2-F2-F2-D1-114+EXDF1-B14+DF1",
    fallback: "Kotal Kahn War God F1B2-F2-F2-D1-114+EXDF1-B14+DF1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 39,
    meter: 1,
    position: "corner",
    starter: "F1B2",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: F1B2-F2-F2-D1-114+EXDF1-B14+DF1.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: F1B2-F2-F2-D1-114+EXDF1-B14+DF1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.kotalKahn.warGod.fOneBTwo,
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.dOne,
    transitions.kotalKahn.warGod.oneOneFourIntoExDFOne,
    transitions.kotalKahn.warGod.bOneFourIntoDFOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kotalKahnWarGodCommunityCorner017Combo = {
  id: "kotal-kahn-war-god-community-corner-017",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kotal Kahn War God 114+EXDF3-D1-114EXDF1-B14+DF1",
    fallback: "Kotal Kahn War God 114+EXDF3-D1-114EXDF1-B14+DF1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 48,
    meter: 2,
    position: "corner",
    starter: "114+EXDF3",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 114+EXDF3-D1-114EXDF1-B14+DF1.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: 114+EXDF3-D1-114EXDF1-B14+DF1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.kotalKahn.warGod.oneOneFourIntoExDFThree,
    transitions.kotalKahn.warGod.dOne,
    transitions.kotalKahn.warGod.oneOneFourEXDFOne,
    transitions.kotalKahn.warGod.bOneFourIntoDFOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kotalKahnWarGodCommunityCorner018Combo = {
  id: "kotal-kahn-war-god-community-corner-018",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kotal Kahn War God 114+EXDF3-D1-D1-114+DB1",
    fallback: "Kotal Kahn War God 114+EXDF3-D1-D1-114+DB1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 37,
    meter: 1,
    position: "corner",
    starter: "114+EXDF3",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: 114+EXDF3-D1-D1-114+DB1.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: 114+EXDF3-D1-D1-114+DB1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.kotalKahn.warGod.oneOneFourIntoExDFThree,
    transitions.kotalKahn.warGod.dOne,
    transitions.kotalKahn.warGod.dOne,
    transitions.kotalKahn.warGod.oneOneFourIntoDBOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kotalKahnWarGodCommunityCorner021Combo = {
  id: "kotal-kahn-war-god-community-corner-021",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kotal Kahn War God B122+EXDF3-114+DF1",
    fallback: "Kotal Kahn War God B122+EXDF3-114+DF1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 35,
    meter: 1,
    position: "corner",
    starter: "B122+EXDF3",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B122+EXDF3-114+DF1.",
    fallback: "Community combo source route. Section: corner. Raw notation: B122+EXDF3-114+DF1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.kotalKahn.warGod.bOneTwoTwoIntoExDFThree,
    transitions.kotalKahn.warGod.oneOneFourIntoDFOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const kotalKahnWarGodCommunityCorner023Combo = {
  id: "kotal-kahn-war-god-community-corner-023",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kotal Kahn War God F1B2-F2-D2-D4+DF1",
    fallback: "Kotal Kahn War God F1B2-F2-D2-D4+DF1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 29,
    meter: 0,
    position: "corner",
    starter: "F1B2",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: F1B2-F2-D2-D4+DF1.",
    fallback: "Community combo source route. Section: corner. Raw notation: F1B2-F2-D2-D4+DF1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.kotalKahn.warGod.fOneBTwo,
    transitions.kotalKahn.warGod.fTwo,
    transitions.kotalKahn.warGod.dTwo,
    transitions.kotalKahn.warGod.dFourIntoDFOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const kotalKahnWarGodCombos = {
  sourcePath: "characters/kotal-kahn/war-god.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    kotalKahnWarGodStarter001Combo,
    kotalKahnWarGodCommunityBeginner001Combo,
    kotalKahnWarGodCommunityBeginner002Combo,
    kotalKahnWarGodCommunityBeginner003Combo,
    kotalKahnWarGodCommunityBeginner004Combo,
    kotalKahnWarGodCommunityBeginner005Combo,
    kotalKahnWarGodCommunityOptimal006Combo,
    kotalKahnWarGodCommunityOptimal007Combo,
    kotalKahnWarGodCommunityOptimal008Combo,
    kotalKahnWarGodCommunityOptimal009Combo,
    kotalKahnWarGodCommunityOptimal010Combo,
    kotalKahnWarGodCommunityOptimal011Combo,
    kotalKahnWarGodCommunityOptimal012Combo,
    kotalKahnWarGodCommunityOptimal013Combo,
    kotalKahnWarGodCommunityCorner015Combo,
    kotalKahnWarGodCommunityCorner016Combo,
    kotalKahnWarGodCommunityCorner017Combo,
    kotalKahnWarGodCommunityCorner018Combo,
    kotalKahnWarGodCommunityCorner021Combo,
    kotalKahnWarGodCommunityCorner023Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
