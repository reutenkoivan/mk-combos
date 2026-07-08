import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.boRaiCho;
const variationSlug = "drunken-master";
const variationId = `${characterId}:${variationSlug}` as const;

const boRaiChoDrunkenMasterStarter001Combo = {
  id: "bo-rai-cho-drunken-master-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Bo' Rai Cho Drunken Master starter",
    fallback: "Bo' Rai Cho Drunken Master starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 29,
    meter: 0,
    position: "corner",
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
    transitions.boRaiCho.universal.openingAssault,
    transitions.boRaiCho.universal.risingAssault,
    transitions.boRaiCho.drunkenMaster.drunkenMasterTechnique,
    transitions.boRaiCho.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const boRaiChoDrunkenMasterCombos = {
  sourcePath: "characters/bo-rai-cho/drunken-master.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [boRaiChoDrunkenMasterStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
