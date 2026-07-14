import { AppRouteSchema } from "@mk-combos/contracts/routes/schema";
import type { AppRoute } from "@mk-combos/contracts/routes/type";
import { appRouteKinds } from "@mk-combos/contracts/routes/value";
import type { useMatchRoute } from "@tanstack/react-router";

import { resolveInstalledGame } from "../../../game-business/installed-games/runtime";
import type { AppShellRoute } from "./type";
import { appShellOnlyRouteKinds } from "./value";

function parseInstalledAppRoute(input: unknown): AppRoute | undefined {
  const parsed = AppRouteSchema.safeParse(input);

  if (!parsed.success) {
    return undefined;
  }

  if ("gameId" in parsed.data && resolveInstalledGame(parsed.data.gameId) === undefined) {
    return undefined;
  }

  return parsed.data;
}

export function resolveAppShellRoute(
  matchRoute: ReturnType<typeof useMatchRoute>,
  leafRouteHasError: boolean,
  routeRevision: string,
): AppShellRoute {
  // `useMatchRoute` reads the router snapshot behind a stable callback. Keep
  // that snapshot in this resolver's data contract so React Compiler cannot
  // cache matches only by the callback identity.
  if (routeRevision.length === 0 || leafRouteHasError) {
    return { kind: appShellOnlyRouteKinds.recovery };
  }

  const comboDetailParams = matchRoute({
    fuzzy: false,
    to: "/$gameId/combos/$source/$comboId",
  });

  if (comboDetailParams !== false) {
    const parsed = parseInstalledAppRoute({
      comboId: comboDetailParams.comboId,
      gameId: comboDetailParams.gameId,
      kind: appRouteKinds.comboDetail,
      source: comboDetailParams.source,
    });

    if (parsed !== undefined) {
      return parsed;
    }
  }

  const catalogParams = matchRoute({ fuzzy: false, to: "/$gameId/catalog" });

  if (catalogParams !== false) {
    const parsed = parseInstalledAppRoute({
      gameId: catalogParams.gameId,
      kind: appRouteKinds.catalog,
    });

    if (parsed !== undefined) {
      return parsed;
    }
  }

  const listsParams = matchRoute({ fuzzy: false, to: "/$gameId/lists" });

  if (listsParams !== false) {
    const parsed = parseInstalledAppRoute({
      gameId: listsParams.gameId,
      kind: appRouteKinds.lists,
    });

    if (parsed !== undefined) {
      return parsed;
    }
  }

  const builderParams = matchRoute({ fuzzy: false, to: "/$gameId/builder" });

  if (builderParams !== false) {
    const parsed = parseInstalledAppRoute({
      gameId: builderParams.gameId,
      kind: appRouteKinds.builder,
    });

    if (parsed !== undefined) {
      return parsed;
    }
  }

  if (matchRoute({ fuzzy: false, to: "/settings" }) !== false) {
    return (
      parseInstalledAppRoute({ kind: appRouteKinds.settings }) ?? {
        kind: appShellOnlyRouteKinds.recovery,
      }
    );
  }

  if (matchRoute({ fuzzy: false, to: "/" }) !== false) {
    return { kind: appShellOnlyRouteKinds.root };
  }

  return { kind: appShellOnlyRouteKinds.recovery };
}
