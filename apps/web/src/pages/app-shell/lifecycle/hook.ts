import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import {
  useLocalStateObservableState,
  useLocalStateSource,
} from "../../../app/local-state/provider";
import { localStateHydrationStatuses } from "../../../app/local-state/value";
import { getRouteGameId } from "../navigation-source/runtime";
import type { AppShellRoute } from "../route-state/type";
import { appShellOnlyRouteKinds } from "../route-state/value";

export function useAppShellLifecycle(route: AppShellRoute) {
  const navigate = useNavigate();
  const localState = useLocalStateObservableState();
  const localStateSource = useLocalStateSource();
  const routeGameId = getRouteGameId(route);
  const hydrated = localState.hydrationStatus === localStateHydrationStatuses.ready;

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!localState.firstLaunchCompleted) {
      if (routeGameId !== undefined) {
        localStateSource.autoCompleteFromDeepLink(routeGameId);
        return;
      }

      if (route.kind !== appShellOnlyRouteKinds.root) {
        void navigate({ replace: true, search: {}, to: "/" });
      }
      return;
    }

    if (route.kind === appShellOnlyRouteKinds.root) {
      void navigate({
        params: { gameId: localState.resolvedActiveGameId },
        replace: true,
        search: {},
        to: "/$gameId/catalog",
      });
      return;
    }

    if (routeGameId !== undefined && localState.appliedSettings.lastActiveGameId !== routeGameId) {
      localStateSource.rememberLastActiveGame(routeGameId);
    }
  }, [
    hydrated,
    localState.appliedSettings.lastActiveGameId,
    localState.firstLaunchCompleted,
    localState.resolvedActiveGameId,
    localStateSource,
    navigate,
    route.kind,
    routeGameId,
  ]);

  const redirecting =
    !hydrated ||
    (!localState.firstLaunchCompleted &&
      (routeGameId !== undefined || route.kind !== appShellOnlyRouteKinds.root)) ||
    (localState.firstLaunchCompleted && route.kind === appShellOnlyRouteKinds.root);

  return {
    redirecting,
  };
}
