import type { GameId } from "@mk-combos/contracts/identity/type";
import { appRouteKinds } from "@mk-combos/contracts/routes/value";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";

import {
  useLocalStateObservableState,
  useLocalStateSource,
} from "../../../app/local-state/provider";
import { useAppResponsiveMode } from "../../../app/providers/provider";
import { resolveInstalledGame } from "../../../game-business/installed-games/runtime";
import { installedGames } from "../../../game-business/installed-games/value";
import type { AppShellRoute } from "../route-state/type";
import { appShellOnlyRouteKinds } from "../route-state/value";
import { getRouteGameId } from "./runtime";
import type { AppShellNavigationRequest, AppShellSource } from "./type";
import { breadcrumbActionPrefix, shellActionIds } from "./value";

export function useAppShellSource(route: AppShellRoute): AppShellSource {
  const responsiveMode = useAppResponsiveMode();
  const navigate = useNavigate();
  const localState = useLocalStateObservableState();
  const localStateSource = useLocalStateSource();
  const routeGameId = getRouteGameId(route);
  const routeBusiness = routeGameId === undefined ? undefined : resolveInstalledGame(routeGameId);
  const [gameMenuOpen, setGameMenuOpen] = useState(false);
  const [topBarMenuOpen, setTopBarMenuOpen] = useState(false);
  const [queuedGameId, setQueuedGameId] = useState<GameId>();
  const [queuedNavigation, setQueuedNavigation] = useState<AppShellNavigationRequest>();
  const [navigationInFlight, setNavigationInFlight] = useState(false);
  const [transitionPending, startNavigationTransition] = useTransition();
  const requestedGameIdRef = useRef<GameId | undefined>(undefined);
  const navigationPendingRef = useRef(false);
  const navigationPending = navigationInFlight || transitionPending;

  const activeBusiness =
    routeBusiness ?? resolveInstalledGame(localState.resolvedActiveGameId) ?? installedGames[0];

  const closeMenus = useCallback(() => {
    setGameMenuOpen(false);
    setTopBarMenuOpen(false);
  }, []);

  const requestNavigation = useCallback(
    (request: AppShellNavigationRequest) => {
      if (navigationPendingRef.current || !localState.firstLaunchCompleted) {
        return;
      }

      navigationPendingRef.current = true;
      setQueuedNavigation(() => request);
    },
    [localState.firstLaunchCompleted],
  );

  useEffect(() => {
    if (queuedNavigation === undefined) {
      return;
    }

    setQueuedNavigation(undefined);
    setNavigationInFlight(true);
    const settleNavigation = () => {
      navigationPendingRef.current = false;
      startNavigationTransition(() => setNavigationInFlight(false));
    };

    try {
      void queuedNavigation().then(settleNavigation, settleNavigation);
    } catch {
      settleNavigation();
    }
  }, [queuedNavigation]);

  const navigateToCatalog = useCallback(
    (gameId: GameId) => {
      closeMenus();
      requestNavigation(() => navigate({ params: { gameId }, search: {}, to: "/$gameId/catalog" }));
    },
    [closeMenus, navigate, requestNavigation],
  );

  const navigateToLists = useCallback(
    (gameId: GameId) => {
      closeMenus();
      requestNavigation(() => navigate({ params: { gameId }, search: {}, to: "/$gameId/lists" }));
    },
    [closeMenus, navigate, requestNavigation],
  );

  const navigateToBuilder = useCallback(
    (gameId: GameId) => {
      closeMenus();
      requestNavigation(() => navigate({ params: { gameId }, search: {}, to: "/$gameId/builder" }));
    },
    [closeMenus, navigate, requestNavigation],
  );

  const navigateToSettings = useCallback(() => {
    switch (route.kind) {
      case appRouteKinds.builder:
      case appRouteKinds.catalog:
      case appRouteKinds.comboDetail:
      case appRouteKinds.lists:
        localStateSource.setSettingsReturnTarget(route);
        break;
      case appRouteKinds.settings:
      case appShellOnlyRouteKinds.recovery:
      case appShellOnlyRouteKinds.root:
        localStateSource.clearSettingsReturnTarget();
    }
    localStateSource.rememberLastActiveGame(activeBusiness.id);
    closeMenus();
    requestNavigation(() => navigate({ search: {}, to: "/settings" }));
  }, [activeBusiness.id, closeMenus, localStateSource, navigate, requestNavigation, route]);

  const requestSelectGame = useCallback(
    (gameId: string) => {
      if (!localState.firstLaunchCompleted) {
        return;
      }

      const selectedBusiness = resolveInstalledGame(gameId);

      if (selectedBusiness === undefined) {
        return;
      }

      requestedGameIdRef.current = selectedBusiness.id;
    },
    [localState.firstLaunchCompleted],
  );

  useEffect(() => {
    if (gameMenuOpen || requestedGameIdRef.current === undefined) {
      return;
    }

    const requestedGameId = requestedGameIdRef.current;
    requestedGameIdRef.current = undefined;
    const selectionTimer = setTimeout(() => setQueuedGameId(requestedGameId), 0);

    return () => clearTimeout(selectionTimer);
  }, [gameMenuOpen]);

  useEffect(() => {
    if (queuedGameId === undefined) {
      return;
    }

    setQueuedGameId(undefined);

    switch (route.kind) {
      case appRouteKinds.catalog:
        navigateToCatalog(queuedGameId);
        return;
      case appRouteKinds.lists:
        navigateToLists(queuedGameId);
        return;
      case appRouteKinds.builder:
        navigateToBuilder(queuedGameId);
        return;
      case appRouteKinds.comboDetail:
      case appShellOnlyRouteKinds.recovery:
      case appShellOnlyRouteKinds.root:
        navigateToCatalog(queuedGameId);
        return;
      case appRouteKinds.settings:
        localStateSource.rememberLastActiveGame(queuedGameId);
        closeMenus();
    }
  }, [
    closeMenus,
    localStateSource,
    navigateToBuilder,
    navigateToCatalog,
    navigateToLists,
    queuedGameId,
    route.kind,
  ]);

  const requestNavigateAction = useCallback(
    (action: string) => {
      const normalizedAction = action.startsWith(breadcrumbActionPrefix)
        ? action.slice(breadcrumbActionPrefix.length)
        : action;

      switch (normalizedAction) {
        case shellActionIds.catalog:
          navigateToCatalog(activeBusiness.id);
          return;
        case shellActionIds.lists:
          navigateToLists(activeBusiness.id);
          return;
        case shellActionIds.builder:
          navigateToBuilder(activeBusiness.id);
          return;
        case shellActionIds.settings:
          navigateToSettings();
      }
    },
    [activeBusiness.id, navigateToBuilder, navigateToCatalog, navigateToLists, navigateToSettings],
  );

  return {
    methods: {
      requestGameMenuOpen: setGameMenuOpen,
      requestNavigateAction,
      requestSelectGame,
      requestTopBarMenuOpen: setTopBarMenuOpen,
    },
    state: {
      activeBusiness,
      gameMenuOpen,
      language: localState.appliedSettings.language,
      navigationAvailable: localState.firstLaunchCompleted,
      navigationPending,
      responsiveMode,
      route,
      topBarMenuOpen,
    },
  };
}
