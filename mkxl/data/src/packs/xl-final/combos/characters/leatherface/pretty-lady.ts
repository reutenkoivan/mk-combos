import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.leatherface;
const variationSlug = "pretty-lady";
const variationId = `${characterId}:${variationSlug}` as const;

const leatherfacePrettyLadyStarter001Combo = {
  id: "leatherface-pretty-lady-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Leatherface Pretty Lady starter",
    fallback: "Leatherface Pretty Lady starter",
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
    moves.leatherface.universal.openingAssault,
    moves.leatherface.universal.risingAssault,
    moves.leatherface.prettyLady.prettyLadyTechnique,
    moves.leatherface.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const leatherfacePrettyLadyCombos = {
  sourcePath: "characters/leatherface/pretty-lady.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [leatherfacePrettyLadyStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
