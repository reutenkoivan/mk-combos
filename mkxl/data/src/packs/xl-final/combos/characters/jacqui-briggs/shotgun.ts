import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.jacquiBriggs;
const variationSlug = "shotgun";
const variationId = `${characterId}:${variationSlug}` as const;

const jacquiBriggsShotgunStarter001Combo = {
  id: "jacqui-briggs-shotgun-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jacqui Briggs Shotgun starter",
    fallback: "Jacqui Briggs Shotgun starter",
  },
  stageContext: {
    kind: "stageAgnostic",
  },
  metadata: {
    damage: 31,
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
    transitions.jacquiBriggs.universal.openingAssault,
    transitions.jacquiBriggs.universal.risingAssault,
    transitions.jacquiBriggs.shotgun.shotgunTechnique,
    transitions.jacquiBriggs.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const jacquiBriggsShotgunCombos = {
  sourcePath: "characters/jacqui-briggs/shotgun.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [jacquiBriggsShotgunStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
