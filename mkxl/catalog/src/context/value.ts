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

export const mkxlCatalogOptionAvailabilities = {
  available: "available",
  disabledNoComboData: "disabledNoComboData",
} as const;
