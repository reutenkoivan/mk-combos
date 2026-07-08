import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.dvorah;
const variationSlug = "swarm-queen";
const variationId = `${characterId}:${variationSlug}` as const;

const dvorahSwarmQueenStarter001Combo = {
  id: "dvorah-swarm-queen-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "D'Vorah Swarm Queen starter",
    fallback: "D'Vorah Swarm Queen starter",
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
    transitions.dvorah.universal.openingAssault,
    transitions.dvorah.universal.risingAssault,
    transitions.dvorah.swarmQueen.swarmQueenTechnique,
    transitions.dvorah.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const dvorahSwarmQueenCombos = {
  sourcePath: "characters/dvorah/swarm-queen.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [dvorahSwarmQueenStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
