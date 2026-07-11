import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.kenshi;
const variationSlug = "kenjutsu";
const variationId = `${characterId}:${variationSlug}` as const;

const kenshiKenjutsuStarter001Combo = {
  id: "kenshi-kenjutsu-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Kenshi Kenjutsu starter",
    fallback: "Kenshi Kenjutsu starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 27,
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
    moves.kenshi.universal.openingAssault,
    moves.kenshi.universal.risingAssault,
    moves.kenshi.kenjutsu.kenjutsuTechnique,
    moves.kenshi.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const kenshiKenjutsuCombos = {
  sourcePath: "characters/kenshi/kenjutsu.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [kenshiKenjutsuStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
