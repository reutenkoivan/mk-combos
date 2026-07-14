import { AppRouteSchema } from "@mk-combos/contracts/routes/schema";
import type { AppRoute } from "@mk-combos/contracts/routes/type";
import { appRouteKinds } from "@mk-combos/contracts/routes/value";
import { useMatchRoute, useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";
import { resolveInstalledGame } from "../game-business/installed-games";

export const appShellOnlyRouteKinds = {
  recovery: "recovery",
  root: "root",
} as const;

export type AppShellRoute =
  | AppRoute
  | Readonly<{ kind: typeof appShellOnlyRouteKinds.recovery }>
  | Readonly<{ kind: typeof appShellOnlyRouteKinds.root }>;

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

function resolveAppShellRoute(
  matchRoute: ReturnType<typeof useMatchRoute>,
  leafRouteHasError: boolean,
  routeRevision: string,
): AppShellRoute {
  // `useMatchRoute` reads the router snapshot behind a stable callback. Keep
  // that snapshot in this resolver's data contract so React Compiler cannot
  // cache matches only by the callback identity.
  if (routeRevision.length === 0) {
    return { kind: appShellOnlyRouteKinds.recovery };
  }

  if (leafRouteHasError) {
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

export function useAppShellRoute(): AppShellRoute {
  const matchRoute = useMatchRoute();
  const leafRouteHasError = useRouterState({
    select: (state) => state.matches.at(-1)?.status === "error",
  });
  const routeRevision = useRouterState({
    select: (state) =>
      `${state.location.href}\u0000${state.resolvedLocation?.href ?? ""}\u0000${state.status}`,
  });

  // `useMatchRoute` intentionally exposes a stable callback. The router revision
  // keeps same-pattern param changes (for example mkxl -> mk1) observable here.
  return useMemo(
    () => resolveAppShellRoute(matchRoute, leafRouteHasError, routeRevision),
    [leafRouteHasError, matchRoute, routeRevision],
  );
}
