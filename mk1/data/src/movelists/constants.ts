export const mk1InputNotationValues = [
  "1",
  "2",
  "3",
  "4",
  "K",
  "AMP",
  "U",
  "D",
  "B",
  "F",
  "SS",
] as const;

export const mk1MoveNotationValues = [...mk1InputNotationValues] as const;

export const mk1MoveCategories = ["normal", "special", "kameo", "mechanic"] as const;
