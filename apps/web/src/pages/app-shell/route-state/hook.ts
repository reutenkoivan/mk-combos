import { useMatchRoute, useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";

import { resolveAppShellRoute } from "./runtime";
import type { AppShellRoute } from "./type";

export function useAppShellRoute(): AppShellRoute {
  const matchRoute = useMatchRoute();
  const leafRouteHasError = useRouterState({
    select: (state) => state.matches.at(-1)?.status === "error",
  });
  const routeRevision = useRouterState({
    select: (state) =>
      `${state.location.href}\u0000${state.resolvedLocation?.href ?? ""}\u0000${state.status}`,
  });
  const routePathname = useRouterState({ select: (state) => state.location.pathname });

  return useMemo(
    () => resolveAppShellRoute(matchRoute, leafRouteHasError, routeRevision, routePathname),
    [leafRouteHasError, matchRoute, routePathname, routeRevision],
  );
}
