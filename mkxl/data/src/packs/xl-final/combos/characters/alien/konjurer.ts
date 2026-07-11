import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.alien;
const variationSlug = "konjurer";
const variationId = `${characterId}:${variationSlug}` as const;

const alienKonjurerStarter001Combo = {
  id: "alien-konjurer-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Alien Konjurer starter",
    fallback: "Alien Konjurer starter",
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
    moves.alien.universal.openingAssault,
    moves.alien.universal.risingAssault,
    moves.alien.konjurer.konjurerTechnique,
    moves.alien.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const alienKonjurerCombos = {
  sourcePath: "characters/alien/konjurer.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [alienKonjurerStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
