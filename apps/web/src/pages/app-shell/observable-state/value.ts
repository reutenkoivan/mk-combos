import type { TopBarMenuAction } from "@mk-combos/ui/components/top-bar-dropdown-menu";
import type { GameSwitcherOption } from "@mk-combos/ui/components/type";
import { componentOptionStatuses } from "@mk-combos/ui/components/value";

import { installedGames } from "../../../game-business/installed-games/value";
import { shellActionIds } from "../navigation-source/value";

export const shellSourceSurface = "app-shell";

export const shellBreadcrumbIds = {
  builder: "builder",
  catalog: "catalog",
  comboDetail: "combo-detail",
  lists: "lists",
  recovery: "recovery",
  root: "root",
  settings: "settings",
} as const;

export const installedGameOptions: readonly GameSwitcherOption[] = installedGames.map(
  (business) => ({
    gameId: business.id,
    label: business.label,
    shortLabel: business.label,
    status: componentOptionStatuses.available,
  }),
);

export const topBarActions: readonly TopBarMenuAction[] = [
  { available: true, id: shellActionIds.catalog, label: "Catalog" },
  { available: true, id: shellActionIds.lists, label: "Named Lists" },
  { available: true, id: shellActionIds.builder, label: "Builder" },
  { available: true, id: shellActionIds.settings, label: "Settings" },
];
