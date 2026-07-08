import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.jasonVoorhees;
const variationSlug = "unstoppable";
const variationId = `${characterId}:${variationSlug}` as const;

const jasonVoorheesUnstoppableStarter001Combo = {
  id: "jason-voorhees-unstoppable-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jason Voorhees Unstoppable starter",
    fallback: "Jason Voorhees Unstoppable starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 24,
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
    transitions.jasonVoorhees.universal.openingAssault,
    transitions.jasonVoorhees.universal.risingAssault,
    transitions.jasonVoorhees.unstoppable.unstoppableTechnique,
    transitions.jasonVoorhees.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const jasonVoorheesUnstoppableCombos = {
  sourcePath: "characters/jason-voorhees/unstoppable.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [jasonVoorheesUnstoppableStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
