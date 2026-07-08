import type { MkxlAuthoredSeededCombo, MkxlAuthoredVariationCombos } from "../../../../type";
import { mkxlXlFinalCharacterIds as characterIds } from "../../../character-ids";
import { mkxlXlFinalTransitionRegistry as transitions } from "../../../transitions";

const characterId = characterIds.mileena;
const variationSlug = "ravenous";
const variationId = `${characterId}:${variationSlug}` as const;

const mileenaRavenousStarter001Combo = {
  id: "mileena-ravenous-starter-001",
  source: "seeded",
  gameId: "mkxl",
  title: {
    EN: "Mileena Ravenous starter",
    fallback: "Mileena Ravenous starter",
  },
  stageContext: {
    kind: "stageSpecific",
    stageId: "jinsei-chamber",
    zoneId: "jinsei-chamber:mid",
    segmentId: "jinsei-chamber:mid-screen",
    interactableIds: ["jinsei-chamber:position-escape"],
  },
  metadata: {
    damage: 30,
    meter: 1,
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
    transitions.mileena.universal.openingAssault,
    transitions.mileena.universal.risingAssault,
    transitions.mileena.ravenous.ravenousTechnique,
    transitions.mileena.universal.closingStrikeEnhanced,
  ],
} as const satisfies MkxlAuthoredSeededCombo;

export const mileenaRavenousCombos = {
  sourcePath: "characters/mileena/ravenous.ts",
  characterId,
  variationSlug,
  variationId,
  combos: [mileenaRavenousStarter001Combo],
} as const satisfies MkxlAuthoredVariationCombos;
