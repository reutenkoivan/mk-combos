import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.goro;
const variationSlug = "dragon-fangs";
const variationId = `${characterId}:${variationSlug}` as const;

const goroDragonFangsStarter001Combo = {
  id: "goro-dragon-fangs-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Goro Dragon Fangs starter",
    fallback: "Goro Dragon Fangs starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 29,
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
    transitions.goro.universal.openingAssault,
    transitions.goro.universal.risingAssault,
    transitions.goro.dragonFangs.dragonFangsTechnique,
    transitions.goro.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const goroDragonFangsCombos = {
  sourcePath: "characters/goro/dragon-fangs.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [goroDragonFangsStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
