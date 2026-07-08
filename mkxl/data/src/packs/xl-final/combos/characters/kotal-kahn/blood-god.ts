import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.kotalKahn;
const variationSlug = "blood-god";
const variationId = `${characterId}:${variationSlug}` as const;

const kotalKahnBloodGodStarter001Combo = {
  id: "kotal-kahn-blood-god-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kotal Kahn Blood God starter",
    fallback: "Kotal Kahn Blood God starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 25,
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
    transitions.kotalKahn.bloodGod.bloodGodTechnique,
    transitions.kotalKahn.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const kotalKahnBloodGodCombos = {
  sourcePath: "characters/kotal-kahn/blood-god.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [kotalKahnBloodGodStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
