export const mkxlCatalogMultiSelectFilterIds = {
  difficulty: "difficulty",
  interactable: "interactable",
  meter: "meter",
  position: "position",
  routeClass: "routeClass",
  source: "source",
} as const;

export const mkxlCatalogSingleSelectFilterIds = {
  stage: "stage",
} as const;

export const mkxlCatalogFilterIds = {
  ...mkxlCatalogMultiSelectFilterIds,
  ...mkxlCatalogSingleSelectFilterIds,
} as const;

export const mkxlCatalogSources = {
  curated: "curated",
  community: "community",
  personal: "personal",
} as const;

export const mkxlCatalogFilterQueryKeys = {
  difficulty: "difficulty",
  interactable: "interactable",
  meter: "meter",
  position: "position",
  routeClass: "routeClass",
  source: "source",
  stage: "stage",
} as const;
