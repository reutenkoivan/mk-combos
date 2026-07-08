export const mkxlXlFinalFgcNotation = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  block: "BLK",
  stanceSwitch: "SS",
  interactable: "INT",
  amplify: "AMP",
  up: "U",
  down: "D",
  back: "B",
  forward: "F",
} as const;

type MkxlXlFinalFgcNotationValue =
  (typeof mkxlXlFinalFgcNotation)[keyof typeof mkxlXlFinalFgcNotation];

export const mkxlXlFinalInputNotationValues = [
  "1",
  "2",
  "3",
  "4",
  "BLK",
  "SS",
  "INT",
  "AMP",
  "U",
  "D",
  "B",
  "F",
] as const satisfies readonly [MkxlXlFinalFgcNotationValue, ...MkxlXlFinalFgcNotationValue[]];
