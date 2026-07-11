import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalMoveRegistry as moves } from "../../../moves/registry";

const characterId = characterIds.jax;
const variationSlug = "wrestler";
const variationId = `${characterId}:${variationSlug}` as const;

const jaxWrestlerStarter001Combo = {
  id: "jax-wrestler-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Jax Wrestler starter",
    fallback: "Jax Wrestler starter",
  },
  stageContext: {
    kind: "stageSpecific",
    stageId: "destroyed-city",
    zoneId: "destroyed-city:mid",
    segmentId: "destroyed-city:mid-screen",
    interactableIds: ["destroyed-city:position-escape"],
  },
  metadata: {
    damage: 27,
    meter: 0,
    position: "corner",
    starter: "Opening Assault",
    routeType: "stage",
    difficulty: "medium",
    tags: ["starter", "stage"],
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
    moves.jax.universal.openingAssault,
    moves.jax.universal.risingAssault,
    moves.jax.wrestler.wrestlerTechnique,
    moves.jax.universal.closingStrike,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const jaxWrestlerCombos = {
  sourcePath: "characters/jax/wrestler.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [jaxWrestlerStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
