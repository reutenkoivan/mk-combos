import type { GameId } from "@mk-combos/contracts/identity/type";
import { gameRouteKinds } from "@mk-combos/contracts/routes/value";

import type { AppShellRoute } from "../route-state/type";
import { appShellOnlyRouteKinds } from "../route-state/value";

export function getRouteGameId(route: AppShellRoute): GameId | undefined {
  switch (route.kind) {
    case gameRouteKinds.builder:
    case gameRouteKinds.catalog:
    case gameRouteKinds.comboDetail:
    case gameRouteKinds.lists:
      return route.gameId;
    case appShellOnlyRouteKinds.recovery:
    case appShellOnlyRouteKinds.root:
      return undefined;
  }
}
