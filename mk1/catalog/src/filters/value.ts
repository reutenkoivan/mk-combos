export const mk1CatalogMultiSelectFilterIds = {
  difficulty: "difficulty",
  meter: "meter",
  position: "position",
  routeType: "routeType",
  starter: "starter",
  tag: "tag",
} as const;

export const mk1CatalogRangeFilterIds = {
  damage: "damage",
} as const;

export const mk1CatalogFilterIds = {
  ...mk1CatalogMultiSelectFilterIds,
  ...mk1CatalogRangeFilterIds,
} as const;
