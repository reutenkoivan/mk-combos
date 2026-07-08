import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.johnnyCage;
const variationSlug = "a-list";
const variationId = `${characterId}:${variationSlug}` as const;

const johnnyCageAListStarter001Combo = {
  id: "johnny-cage-a-list-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Johnny Cage A-List starter",
    fallback: "Johnny Cage A-List starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 30,
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
    transitions.johnnyCage.universal.openingAssault,
    transitions.johnnyCage.universal.risingAssault,
    transitions.johnnyCage.aList.aListTechnique,
    transitions.johnnyCage.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const johnnyCageAListCombos = {
  sourcePath: "characters/johnny-cage/a-list.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [johnnyCageAListStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
