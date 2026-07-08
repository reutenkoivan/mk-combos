import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.raiden;
const variationSlug = "thunder-god";
const variationId = `${characterId}:${variationSlug}` as const;

const raidenThunderGodStarter001Combo = {
  id: "raiden-thunder-god-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Raiden Thunder God starter",
    fallback: "Raiden Thunder God starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 30,
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
    transitions.raiden.universal.openingAssault,
    transitions.raiden.universal.risingAssault,
    transitions.raiden.thunderGod.thunderGodTechnique,
    transitions.raiden.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const raidenThunderGodCommunityBeginner001Combo = {
  id: "raiden-thunder-god-community-beginner-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Raiden Thunder God 214 – df2",
    fallback: "Raiden Thunder God 214 – df2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 20,
    meter: 0,
    position: "midscreen",
    starter: "214",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 214 – df2.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 214 – df2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [transitions.raiden.thunderGod.twoOneFour, transitions.raiden.thunderGod.dFTwo],
} as const satisfies MkxlAuthoredSeededCombo;

const raidenThunderGodCommunityBeginner002Combo = {
  id: "raiden-thunder-god-community-beginner-002",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Raiden Thunder God 214 – exdf2 – b14 – bf3",
    fallback: "Raiden Thunder God 214 – exdf2 – b14 – bf3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 32,
    meter: 1,
    position: "midscreen",
    starter: "214",
    routeType: "metered",
    difficulty: "easy",
    tags: ["community", "beginner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 214 – exdf2 – b14 – bf3.",
    fallback:
      "Community combo source route. Section: beginner. Raw notation: 214 – exdf2 – b14 – bf3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.raiden.thunderGod.twoOneFour,
    transitions.raiden.thunderGod.exDFTwo,
    transitions.raiden.thunderGod.bOneFour,
    transitions.raiden.thunderGod.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const raidenThunderGodCommunityBeginner017Combo = {
  id: "raiden-thunder-god-community-beginner-017",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Raiden Thunder God f12b2 b14 CansRun 214 bf3",
    fallback: "Raiden Thunder God f12b2 b14 CansRun 214 bf3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 25,
    meter: 0,
    position: "midscreen",
    starter: "F12B2 B14 CANSRUN 214 BF3",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: f12b2 b14 CansRun 214 bf3.",
    fallback:
      "Community combo source route. Section: beginner. Raw notation: f12b2 b14 CansRun 214 bf3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.raiden.thunderGod.fOneTwoBTwo,
    transitions.raiden.thunderGod.bOneFour,
    transitions.general.run,
    transitions.raiden.thunderGod.twoOneFour,
    transitions.raiden.thunderGod.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const raidenThunderGodCommunityBeginner019Combo = {
  id: "raiden-thunder-god-community-beginner-019",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Raiden Thunder God b32 b14 CansRun 214 bf3",
    fallback: "Raiden Thunder God b32 b14 CansRun 214 bf3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 25,
    meter: 0,
    position: "midscreen",
    starter: "B32 B14 CANSRUN 214 BF3",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: b32 b14 CansRun 214 bf3.",
    fallback:
      "Community combo source route. Section: beginner. Raw notation: b32 b14 CansRun 214 bf3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.raiden.thunderGod.bThreeTwo,
    transitions.raiden.thunderGod.bOneFour,
    transitions.general.run,
    transitions.raiden.thunderGod.twoOneFour,
    transitions.raiden.thunderGod.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const raidenThunderGodCommunityOptimal023Combo = {
  id: "raiden-thunder-god-community-optimal-023",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Raiden Thunder God b11 CansRun 214 exdf2 b34 bf3",
    fallback: "Raiden Thunder God b11 CansRun 214 exdf2 b34 bf3",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 33,
    meter: 1,
    position: "midscreen",
    starter: "B11 CANSRUN 214 EXDF2 B34 BF3",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "optimal", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: b11 CansRun 214 exdf2 b34 bf3.",
    fallback:
      "Community combo source route. Section: optimal. Raw notation: b11 CansRun 214 exdf2 b34 bf3.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.raiden.thunderGod.bOneOne,
    transitions.general.run,
    transitions.raiden.thunderGod.twoOneFour,
    transitions.raiden.thunderGod.exDFTwo,
    transitions.raiden.thunderGod.bThreeFour,
    transitions.raiden.thunderGod.bFThree,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const raidenThunderGodCommunityCorner026Combo = {
  id: "raiden-thunder-god-community-corner-026",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Raiden Thunder God b2 – b2 – b14 CansRun 214 df2",
    fallback: "Raiden Thunder God b2 – b2 – b14 CansRun 214 df2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 36,
    meter: 0,
    position: "corner",
    starter: "B2",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: b2 – b2 – b14 CansRun 214 df2.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: b2 – b2 – b14 CansRun 214 df2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.raiden.thunderGod.bTwo,
    transitions.raiden.thunderGod.bTwo,
    transitions.raiden.thunderGod.bOneFour,
    transitions.general.run,
    transitions.raiden.thunderGod.twoOneFour,
    transitions.raiden.thunderGod.dFTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const raidenThunderGodCommunityCorner029Combo = {
  id: "raiden-thunder-god-community-corner-029",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Raiden Thunder God b32 – 213 – b14 CansRun 214 exdf2 b14 db2",
    fallback: "Raiden Thunder God b32 – 213 – b14 CansRun 214 exdf2 b14 db2",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 33,
    meter: 1,
    position: "corner",
    starter: "B32",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: b32 – 213 – b14 CansRun 214 exdf2 b14 db2.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: b32 – 213 – b14 CansRun 214 exdf2 b14 db2.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.raiden.thunderGod.bThreeTwo,
    transitions.raiden.thunderGod.twoOneThree,
    transitions.raiden.thunderGod.bOneFour,
    transitions.general.run,
    transitions.raiden.thunderGod.twoOneFour,
    transitions.raiden.thunderGod.exDFTwo,
    transitions.raiden.thunderGod.bOneFourIntoDBTwo,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const raidenThunderGodCombos = {
  sourcePath: "characters/raiden/thunder-god.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    raidenThunderGodStarter001Combo,
    raidenThunderGodCommunityBeginner001Combo,
    raidenThunderGodCommunityBeginner002Combo,
    raidenThunderGodCommunityBeginner017Combo,
    raidenThunderGodCommunityBeginner019Combo,
    raidenThunderGodCommunityOptimal023Combo,
    raidenThunderGodCommunityCorner026Combo,
    raidenThunderGodCommunityCorner029Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
