export const mkxlCatalogContextStatuses = ["empty", "characterSelected", "ready"] as const;

export const mkxlCatalogRecoveryCodes = [
  "invalidCharacter",
  "invalidVariation",
  "invalidStage",
  "invalidInteractable",
  "incompatibleInteractable",
  "invalidDamageRange",
] as const;

export const mkxlCatalogRouteQueryKeys = [
  "character",
  "variation",
  "starter",
  "position",
  "meter",
  "damageMin",
  "damageMax",
  "difficulty",
  "routeType",
  "tag",
  "stage",
  "interactable",
] as const;
