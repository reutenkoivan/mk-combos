export const mkxlCatalogContextStatuses = {
  characterSelected: "characterSelected",
  empty: "empty",
  ready: "ready",
} as const;

export const mkxlCatalogRecoveryCodes = {
  incompatibleInteractable: "incompatibleInteractable",
  invalidCharacter: "invalidCharacter",
  invalidDamageRange: "invalidDamageRange",
  invalidInteractable: "invalidInteractable",
  invalidStage: "invalidStage",
  invalidVariation: "invalidVariation",
} as const;

export const mkxlCatalogRouteQueryKeys = {
  character: "character",
  damageMax: "damageMax",
  damageMin: "damageMin",
  difficulty: "difficulty",
  interactable: "interactable",
  meter: "meter",
  position: "position",
  routeType: "routeType",
  stage: "stage",
  starter: "starter",
  tag: "tag",
  variation: "variation",
} as const;

export const mkxlCatalogOptionAvailabilities = {
  available: "available",
  disabledNoComboData: "disabledNoComboData",
} as const;
