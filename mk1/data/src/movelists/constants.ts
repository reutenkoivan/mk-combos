export const mk1InputNotationValues = {
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  AMP: "AMP",
  B: "B",
  D: "D",
  F: "F",
  K: "K",
  SS: "SS",
  U: "U",
} as const;

export const mk1MoveNotationValues = { ...mk1InputNotationValues } as const;

export const mk1MoveCategories = {
  kameo: "kameo",
  mechanic: "mechanic",
  normal: "normal",
  special: "special",
} as const;

export const mk1MoveOwnerKinds = {
  character: "character",
  general: "general",
  kameo: "kameo",
} as const;

export const mk1AttackLevels = {
  high: "high",
  low: "low",
  mid: "mid",
  overhead: "overhead",
  throw: "throw",
  unblockable: "unblockable",
} as const;

export const mk1MoveTacticalFactKinds = {
  attackLevel: "attackLevel",
  duckable: "duckable",
  internalGap: "internalGap",
} as const;
