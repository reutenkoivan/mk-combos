import { mk1SeededCombos } from "../combos/value";
import { mk1CharacterGraphs, mk1KameoGraphOverlays } from "../graph/value";
import { mk1Kameos } from "../kameos/value";
import { mk1Movelists, mk1Moves } from "../movelists/value";
import { mk1Characters } from "../roster/value";
import type { Mk1CoverageTargets, Mk1DataValidationCounts } from "./type";

export const mk1CoverageTargets = {
  expectedCharacterCount: 35,
  expectedKameoCount: 21,
  expectedPairComboCount: 735,
  minimumCombosPerPair: 1,
  requireSourceProvenance: true,
  requireLocalizedLabels: true,
} as const satisfies Mk1CoverageTargets;

export const mk1DataCounts = {
  characters: mk1Characters.length,
  kameos: mk1Kameos.length,
  movelists: mk1Movelists.length,
  moves: mk1Moves.length,
  combos: mk1SeededCombos.length,
  characterGraphs: mk1CharacterGraphs.length,
  kameoGraphOverlays: mk1KameoGraphOverlays.length,
} as const satisfies Mk1DataValidationCounts;
