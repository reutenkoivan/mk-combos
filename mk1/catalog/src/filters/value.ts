export const mk1CatalogMultiSelectFilterIds = {
  difficulty: "difficulty",
  meter: "meter",
  position: "position",
  routeClass: "routeClass",
  source: "source",
} as const;

export const mk1CatalogFilterIds = {
  ...mk1CatalogMultiSelectFilterIds,
} as const;

export const mk1CatalogSources = {
  curated: "curated",
  community: "community",
  personal: "personal",
} as const;

export const mk1CatalogFilterQueryKeys = {
  difficulty: "difficulty",
  meter: "meter",
  position: "position",
  routeClass: "routeClass",
  source: "source",
} as const;
