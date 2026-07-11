import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.jasonVoorhees;
const variationSlug = "relentless";
const variationId = `${characterId}:${variationSlug}` as const;

const jasonVoorheesRelentlessStarter001Combo = {
  id: "jason-voorhees-relentless-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jason Voorhees Relentless starter",
    fallback: "Jason Voorhees Relentless starter",
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
    moves.jasonVoorhees.universal.openingAssault,
    moves.jasonVoorhees.universal.risingAssault,
    moves.jasonVoorhees.relentless.relentlessTechnique,
    moves.jasonVoorhees.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const jasonVoorheesRelentlessCombos = {
  sourcePath: "characters/jason-voorhees/relentless.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [jasonVoorheesRelentlessStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
