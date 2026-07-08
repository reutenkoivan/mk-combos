import { mkxlXlFinalInputNotationValues } from "../packs/xl-final/notation";

export const mkxlMoveCategories = [
  "normal",
  "string",
  "throw",
  "special",
  "enhanced",
  "xray",
  "variation",
  "stage",
  "mechanic",
] as const;

export const mkxlInputNotationValues = mkxlXlFinalInputNotationValues;

export const mkxlMoveNotationValues = mkxlInputNotationValues;

export const mkxlInputsRegistry = mkxlInputNotationValues.map((notation) => ({ notation }));
