import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.boRaiCho;
const variationSlug = "bartitsu";
const variationId = `${characterId}:${variationSlug}` as const;

const boRaiChoBartitsuStarter001Combo = {
  id: "bo-rai-cho-bartitsu-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Bo' Rai Cho Bartitsu starter",
    fallback: "Bo' Rai Cho Bartitsu starter",
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
    transitions.boRaiCho.universal.openingAssault,
    transitions.boRaiCho.universal.risingAssault,
    transitions.boRaiCho.bartitsu.bartitsuTechnique,
    transitions.boRaiCho.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const boRaiChoBartitsuCommunityBeginner001Combo = {
  id: "bo-rai-cho-bartitsu-community-beginner-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Bo' Rai Cho Bartitsu 21-F2+BF4",
    fallback: "Bo' Rai Cho Bartitsu 21-F2+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 22,
    meter: 0,
    position: "midscreen",
    starter: "21",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 21-F2+BF4.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 21-F2+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [transitions.boRaiCho.bartitsu.twoOne, transitions.boRaiCho.bartitsu.fTwoIntoBFFour],
} as const satisfies MkxlAuthoredSeededCombo;

const boRaiChoBartitsuCommunityBeginner002Combo = {
  id: "bo-rai-cho-bartitsu-community-beginner-002",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Bo' Rai Cho Bartitsu 341-B233+BF4",
    fallback: "Bo' Rai Cho Bartitsu 341-B233+BF4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 28,
    meter: 0,
    position: "midscreen",
    starter: "341",
    routeType: "bnb",
    difficulty: "easy",
    tags: ["community", "beginner"],
  },
  notes: {
    EN: "Community combo source route. Section: beginner. Raw notation: 341-B233+BF4.",
    fallback: "Community combo source route. Section: beginner. Raw notation: 341-B233+BF4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.boRaiCho.bartitsu.threeFourOne,
    transitions.boRaiCho.bartitsu.bTwoThreeThreeIntoBFFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const boRaiChoBartitsuCombos = {
  sourcePath: "characters/bo-rai-cho/bartitsu.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    boRaiChoBartitsuStarter001Combo,
    boRaiChoBartitsuCommunityBeginner001Combo,
    boRaiChoBartitsuCommunityBeginner002Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
