import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

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
    moves.jax.universal.openingAssault,
    moves.jax.universal.risingAssault,
    moves.jax.heavyWeapons.heavyWeaponsTechnique,
    moves.jax.universal.closingStrike,
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
    moves.jax.heavyWeapons.threeBTwo,
    moves.jax.heavyWeapons.fTwoOne,
    moves.jax.heavyWeapons.oneOne,
    moves.jax.heavyWeapons.fTwoOneTwoD,
    moves.jax.heavyWeapons.two,
    moves.jax.heavyWeapons.four,
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
    moves.jax.heavyWeapons.bTwo,
    moves.jax.heavyWeapons.exBFTwoD,
    moves.jax.heavyWeapons.fTwoOne,
    moves.jax.heavyWeapons.oneOne,
    moves.jax.heavyWeapons.fTwoOneTwo,
    moves.jax.heavyWeapons.oneTwoFour,
    moves.jax.heavyWeapons.exDBOne,
    moves.jax.heavyWeapons.oneTwo,
    moves.jax.heavyWeapons.dBOne,
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
    moves.jax.heavyWeapons.bThree,
    moves.jax.heavyWeapons.bFTwoD,
    moves.jax.heavyWeapons.oneOne,
    moves.jax.heavyWeapons.bThreeFour,
    moves.jax.heavyWeapons.exDBOne,
    moves.jax.heavyWeapons.oneTwoFour,
    moves.jax.heavyWeapons.dBOne,
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
    moves.jax.heavyWeapons.bThreeFour,
    moves.jax.heavyWeapons.exBFTwoD,
    moves.jax.heavyWeapons.bThreeFour,
    moves.jax.heavyWeapons.exDBOne,
    moves.jax.heavyWeapons.oneTwoFour,
    moves.jax.heavyWeapons.exDBOne,
    moves.jax.heavyWeapons.oneOne,
    moves.jax.heavyWeapons.dBOne,
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
    moves.jax.heavyWeapons.fTwoOneTwo,
    moves.jax.heavyWeapons.dOneTwo,
    moves.jax.heavyWeapons.oneOne,
    moves.jax.heavyWeapons.fTwoOneTwo,
    moves.jax.heavyWeapons.oneTwoFour,
    moves.jax.heavyWeapons.dBOne,
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
