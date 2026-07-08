import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.kotalKahn;
const variationSlug = "sun-god";
const variationId = `${characterId}:${variationSlug}` as const;

const kotalKahnSunGodStarter001Combo = {
  id: "kotal-kahn-sun-god-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kotal Kahn Sun God starter",
    fallback: "Kotal Kahn Sun God starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 24,
    meter: 0,
    position: "corner",
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
    transitions.kotalKahn.universal.openingAssault,
    transitions.kotalKahn.universal.risingAssault,
    transitions.kotalKahn.sunGod.sunGodTechnique,
    transitions.kotalKahn.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const kotalKahnSunGodCombos = {
  sourcePath: "characters/kotal-kahn/sun-god.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [kotalKahnSunGodStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
