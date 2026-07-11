import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.cassieCage;
const variationSlug = "brawler";
const variationId = `${characterId}:${variationSlug}` as const;

const cassieCageBrawlerStarter001Combo = {
  id: "cassie-cage-brawler-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Cassie Cage Brawler starter",
    fallback: "Cassie Cage Brawler starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 32,
    meter: 1,
    position: "midscreen",
    starter: "Opening Assault",
    routeType: "metered",
    difficulty: "easy",
    tags: ["starter", "metered"],
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
    moves.cassieCage.universal.openingAssault,
    moves.cassieCage.universal.risingAssault,
    moves.cassieCage.brawler.brawlerTechnique,
    moves.cassieCage.universal.closingStrikeEnhanced,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const cassieCageBrawlerCombos = {
  sourcePath: "characters/cassie-cage/brawler.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [cassieCageBrawlerStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
