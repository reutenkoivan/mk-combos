export const mk1CatalogMultiSelectFilterIds = [
  "starter",
  "position",
  "meter",
  "difficulty",
  "routeType",
  "tag",
] as const;

export const mk1CatalogRangeFilterIds = ["damage"] as const;

export const mk1CatalogFilterIds = [
  ...mk1CatalogMultiSelectFilterIds,
  ...mk1CatalogRangeFilterIds,
] as const;
