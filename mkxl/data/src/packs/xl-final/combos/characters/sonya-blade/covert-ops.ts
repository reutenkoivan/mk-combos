import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.sonyaBlade;
const variationSlug = "covert-ops";
const variationId = `${characterId}:${variationSlug}` as const;

const sonyaBladeCovertOpsStarter001Combo = {
  id: "sonya-blade-covert-ops-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Sonya Blade Covert Ops starter",
    fallback: "Sonya Blade Covert Ops starter",
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
    transitions.sonyaBlade.universal.openingAssault,
    transitions.sonyaBlade.universal.risingAssault,
    transitions.sonyaBlade.covertOps.covertOpsTechnique,
    transitions.sonyaBlade.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const sonyaBladeCovertOpsCombos = {
  sourcePath: "characters/sonya-blade/covert-ops.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [sonyaBladeCovertOpsStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
