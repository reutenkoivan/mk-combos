import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

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
    moves.kotalKahn.universal.openingAssault,
    moves.kotalKahn.universal.risingAssault,
    moves.kotalKahn.bloodGod.bloodGodTechnique,
    moves.kotalKahn.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const kotalKahnBloodGodCombos = {
  sourcePath: "characters/kotal-kahn/blood-god.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [kotalKahnBloodGodStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
