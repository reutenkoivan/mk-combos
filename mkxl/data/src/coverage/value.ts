import { mkxlSeededCombos } from "../combos/value";
import { mkxlStageGraphFragments, mkxlVariationGraphs } from "../graph/value";
import { mkxlMovelists, mkxlMoves } from "../movelists/value";
import { mkxlCharacters } from "../roster/value";
import { mkxlInteractableIds, mkxlStages } from "../stages/value";
import { mkxlVariations } from "../variations/value";
import type { MkxlCoverageTargets, MkxlDataValidationCounts } from "./type";

export const mkxlCoverageTargets = {
  expectedCharacterCount: 33,
  expectedVariationCount: 100,
  expectedStageCount: 14,
  minimumCombosPerVariation: 1,
  requireSourceProvenance: true,
  requireLocalizedLabels: true,
} as const satisfies MkxlCoverageTargets;

export const mkxlDataCounts = {
  characters: mkxlCharacters.length,
  variations: mkxlVariations.length,
  movelists: mkxlMovelists.length,
  moves: mkxlMoves.length,
  combos: mkxlSeededCombos.length,
  variationGraphs: mkxlVariationGraphs.length,
  stageGraphFragments: mkxlStageGraphFragments.length,
  stages: mkxlStages.length,
  interactables: mkxlInteractableIds.length,
} as const satisfies MkxlDataValidationCounts;
