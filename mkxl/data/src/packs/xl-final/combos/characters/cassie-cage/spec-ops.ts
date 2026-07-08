import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.cassieCage;
const variationSlug = "spec-ops";
const variationId = `${characterId}:${variationSlug}` as const;

const cassieCageSpecOpsStarter001Combo = {
  id: "cassie-cage-spec-ops-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Cassie Cage Spec Ops starter",
    fallback: "Cassie Cage Spec Ops starter",
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
    transitions.cassieCage.universal.openingAssault,
    transitions.cassieCage.universal.risingAssault,
    transitions.cassieCage.specOps.specOpsTechnique,
    transitions.cassieCage.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const cassieCageSpecOpsCombos = {
  sourcePath: "characters/cassie-cage/spec-ops.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [cassieCageSpecOpsStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
