import { mkxlXlFinalInputNotationValues } from "../packs/xl-final/notation";

export const mkxlMoveCategories = {
  enhanced: "enhanced",
  mechanic: "mechanic",
  normal: "normal",
  special: "special",
  stage: "stage",
  string: "string",
  throw: "throw",
  variation: "variation",
  xray: "xray",
} as const;

export const mkxlInputNotationValues = mkxlXlFinalInputNotationValues;

export const mkxlMoveNotationValues = mkxlInputNotationValues;

export const mkxlInputsRegistry = Object.values(mkxlInputNotationValues).map((notation) => ({
  notation,
}));
