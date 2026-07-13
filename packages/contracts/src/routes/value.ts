export const gameRouteKinds = {
  builder: "builder",
  catalog: "catalog",
  comboDetail: "comboDetail",
  lists: "lists",
} as const;

export const appRouteKinds = {
  ...gameRouteKinds,
  settings: "settings",
} as const;
