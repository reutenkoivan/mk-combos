import type { MkxlDataPack } from "../type";
import { mkxlXlFinalCombos } from "./combos";
import { mkxlXlFinalDataSources, mkxlXlFinalGame } from "./game";
import { mkxlXlFinalMoves } from "./moves";
import { mkxlXlFinalInputNotationValues } from "./notation";
import { mkxlXlFinalRoster } from "./roster";
import { mkxlXlFinalStages } from "./stages";
import { mkxlXlFinalTransitions } from "./transitions";
import { mkxlXlFinalVariations } from "./variations";

export const mkxlXlFinalPack = {
  id: "xl-final",
  gameVersion: "XL-final",
  sources: mkxlXlFinalDataSources,
  game: mkxlXlFinalGame,
  roster: mkxlXlFinalRoster,
  variations: mkxlXlFinalVariations,
  stages: mkxlXlFinalStages,
  inputNotationValues: mkxlXlFinalInputNotationValues,
  transitions: mkxlXlFinalTransitions,
  moves: mkxlXlFinalMoves,
  combos: mkxlXlFinalCombos,
} as const satisfies MkxlDataPack;
