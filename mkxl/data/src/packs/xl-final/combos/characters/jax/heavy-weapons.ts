import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.jax;
const variationSlug = "heavy-weapons";
const variationId = `${characterId}:${variationSlug}` as const;

const jaxHeavyWeaponsStarter001Combo = {
  id: "jax-heavy-weapons-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jax Heavy Weapons starter",
    fallback: "Jax Heavy Weapons starter",
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
    transitions.jax.universal.openingAssault,
    transitions.jax.universal.risingAssault,
    transitions.jax.heavyWeapons.heavyWeaponsTechnique,
    transitions.jax.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const jaxHeavyWeaponsCommunityOptimal008Combo = {
  id: "jax-heavy-weapons-community-optimal-008",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jax Heavy Weapons 3B2-F21-11-F212D+2+4",
    fallback: "Jax Heavy Weapons 3B2-F21-11-F212D+2+4",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 26,
    meter: 0,
    position: "midscreen",
    starter: "3B2",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "optimal"],
  },
  notes: {
    EN: "Community combo source route. Section: optimal. Raw notation: 3B2-F21-11-F212D+2+4.",
    fallback: "Community combo source route. Section: optimal. Raw notation: 3B2-F21-11-F212D+2+4.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.jax.heavyWeapons.threeBTwo,
    transitions.jax.heavyWeapons.fTwoOne,
    transitions.jax.heavyWeapons.oneOne,
    transitions.jax.heavyWeapons.fTwoOneTwoDIntoTwoIntoFour,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const jaxHeavyWeaponsCommunityCorner015Combo = {
  id: "jax-heavy-weapons-community-corner-015",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jax Heavy Weapons B2+EXBF2D-F21-11-F212-124+EXDB1-12+DB1",
    fallback: "Jax Heavy Weapons B2+EXBF2D-F21-11-F212-124+EXDB1-12+DB1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 47,
    meter: 2,
    position: "corner",
    starter: "B2+EXBF2D",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B2+EXBF2D-F21-11-F212-124+EXDB1-12+DB1.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: B2+EXBF2D-F21-11-F212-124+EXDB1-12+DB1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.jax.heavyWeapons.bTwoIntoExBFTwoD,
    transitions.jax.heavyWeapons.fTwoOne,
    transitions.jax.heavyWeapons.oneOne,
    transitions.jax.heavyWeapons.fTwoOneTwo,
    transitions.jax.heavyWeapons.oneTwoFourIntoExDBOne,
    transitions.jax.heavyWeapons.oneTwoIntoDBOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const jaxHeavyWeaponsCommunityCorner016Combo = {
  id: "jax-heavy-weapons-community-corner-016",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jax Heavy Weapons B3+BF2D-11-B34+EXDB1-124+DB1",
    fallback: "Jax Heavy Weapons B3+BF2D-11-B34+EXDB1-124+DB1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 41,
    meter: 1,
    position: "corner",
    starter: "B3+BF2D",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B3+BF2D-11-B34+EXDB1-124+DB1.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: B3+BF2D-11-B34+EXDB1-124+DB1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.jax.heavyWeapons.bThreeIntoBFTwoD,
    transitions.jax.heavyWeapons.oneOne,
    transitions.jax.heavyWeapons.bThreeFourIntoExDBOne,
    transitions.jax.heavyWeapons.oneTwoFourIntoDBOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const jaxHeavyWeaponsCommunityCorner017Combo = {
  id: "jax-heavy-weapons-community-corner-017",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jax Heavy Weapons B34+EXBF2D-B34+EXDB1-124+EXDB1-11+DB1",
    fallback: "Jax Heavy Weapons B34+EXBF2D-B34+EXDB1-124+EXDB1-11+DB1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 53,
    meter: 3,
    position: "corner",
    starter: "B34+EXBF2D",
    routeType: "metered",
    difficulty: "medium",
    tags: ["community", "corner", "metered"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: B34+EXBF2D-B34+EXDB1-124+EXDB1-11+DB1.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: B34+EXBF2D-B34+EXDB1-124+EXDB1-11+DB1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.jax.heavyWeapons.bThreeFourIntoExBFTwoD,
    transitions.jax.heavyWeapons.bThreeFourIntoExDBOne,
    transitions.jax.heavyWeapons.oneTwoFourIntoExDBOne,
    transitions.jax.heavyWeapons.oneOneIntoDBOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

const jaxHeavyWeaponsCommunityCorner018Combo = {
  id: "jax-heavy-weapons-community-corner-018",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jax Heavy Weapons F212-D12-11-F212-124+DB1",
    fallback: "Jax Heavy Weapons F212-D12-11-F212-124+DB1",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 34,
    meter: 0,
    position: "corner",
    starter: "F212",
    routeType: "bnb",
    difficulty: "medium",
    tags: ["community", "corner"],
  },
  notes: {
    EN: "Community combo source route. Section: corner. Raw notation: F212-D12-11-F212-124+DB1.",
    fallback:
      "Community combo source route. Section: corner. Raw notation: F212-D12-11-F212-124+DB1.",
  },
  gameVersion: "XL-final",
  sourceIds: ["community-combo-source"],
  route: [
    transitions.jax.heavyWeapons.fTwoOneTwo,
    transitions.jax.heavyWeapons.dOneTwo,
    transitions.jax.heavyWeapons.oneOne,
    transitions.jax.heavyWeapons.fTwoOneTwo,
    transitions.jax.heavyWeapons.oneTwoFourIntoDBOne,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const jaxHeavyWeaponsCombos = {
  sourcePath: "characters/jax/heavy-weapons.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [
    jaxHeavyWeaponsStarter001Combo,
    jaxHeavyWeaponsCommunityOptimal008Combo,
    jaxHeavyWeaponsCommunityCorner015Combo,
    jaxHeavyWeaponsCommunityCorner016Combo,
    jaxHeavyWeaponsCommunityCorner017Combo,
    jaxHeavyWeaponsCommunityCorner018Combo,
  ],
} as const satisfies MkxlAuthoredVariationCombos;
