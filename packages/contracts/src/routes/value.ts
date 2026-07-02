export const gameRouteKinds = ["catalog", "comboDetail", "lists", "builder"] as const;

export const appRouteKinds = [...gameRouteKinds, "settings"] as const;
