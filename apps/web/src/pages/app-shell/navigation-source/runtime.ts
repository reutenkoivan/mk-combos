import type { GameId } from "@mk-combos/contracts/identity/type";
import { appRouteKinds } from "@mk-combos/contracts/routes/value";

import type { AppShellRoute } from "../route-state/type";
import { appShellOnlyRouteKinds } from "../route-state/value";

export function getRouteGameId(route: AppShellRoute): GameId | undefined {
  switch (route.kind) {
    case appRouteKinds.builder:
    case appRouteKinds.catalog:
    case appRouteKinds.comboDetail:
    case appRouteKinds.lists:
      return route.gameId;
    case appRouteKinds.settings:
    case appShellOnlyRouteKinds.recovery:
    case appShellOnlyRouteKinds.root:
      return undefined;
  }
}
