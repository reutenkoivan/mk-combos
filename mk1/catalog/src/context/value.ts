export const mk1CatalogContextStatuses = {
  characterSelected: "characterSelected",
  empty: "empty",
  ready: "ready",
} as const;

export const mk1CatalogRecoveryCodes = {
  invalidCharacter: "invalidCharacter",
  invalidKameo: "invalidKameo",
} as const;

export const mk1CatalogRouteQueryKeys = {
  character: "character",
  damageMax: "damageMax",
  damageMin: "damageMin",
  difficulty: "difficulty",
  kameo: "kameo",
  meter: "meter",
  position: "position",
  routeType: "routeType",
  starter: "starter",
  tag: "tag",
} as const;

export const mk1CatalogOptionAvailabilities = {
  available: "available",
  disabledNoComboData: "disabledNoComboData",
} as const;
