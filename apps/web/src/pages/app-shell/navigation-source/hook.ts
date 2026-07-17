import type { GameId } from "@mk-combos/contracts/identity/type";
import { gameRouteKinds } from "@mk-combos/contracts/routes/value";
import { useNavigate, useRouter } from "@tanstack/react-router";
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
import { withSettingsTabSearch } from "../settings-modal/navigation/runtime";
import { settingsTabs } from "../settings-modal/navigation/value";
import { getRouteGameId } from "./runtime";
import type { AppShellNavigationRequest, AppShellSource } from "./type";
import { breadcrumbActionPrefix, shellActionIds } from "./value";

export function useAppShellSource(route: AppShellRoute): AppShellSource {
  const responsiveMode = useAppResponsiveMode();
  const navigate = useNavigate();
  const router = useRouter();
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

  const navigateToCatalogCharacter = useCallback(
    (gameId: GameId, character: string) => {
      closeMenus();
      requestNavigation(() =>
        navigate({
          params: { character, gameId },
          search: {},
          to: "/$gameId/catalog/$character",
        }),
      );
    },
    [closeMenus, navigate, requestNavigation],
  );

  const navigateToCatalogResult = useCallback(
    (gameId: GameId, character: string, specification: string) => {
      closeMenus();
      requestNavigation(() =>
        navigate({
          params: { character, gameId, specification },
          search: {},
          to: "/$gameId/catalog/$character/$specification",
        }),
      );
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
    localStateSource.rememberLastActiveGame(activeBusiness.id);
    closeMenus();
    requestNavigation(() =>
      navigate({
        href: withSettingsTabSearch(router.state.location.href, settingsTabs.interface),
        resetScroll: false,
        state: (state) => ({ ...state, settingsModalEntry: true }),
      }),
    );
  }, [activeBusiness.id, closeMenus, localStateSource, navigate, requestNavigation, router]);

  const requestSelectGame = useCallback(
    (gameId: string) => {
      if (!localState.firstLaunchCompleted) {
        return;
      }

      const selectedBusiness = resolveInstalledGame(gameId);

      if (selectedBusiness === undefined || selectedBusiness.id === activeBusiness.id) {
        return;
      }

      requestedGameIdRef.current = selectedBusiness.id;
    },
    [activeBusiness.id, localState.firstLaunchCompleted],
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
      case gameRouteKinds.catalog:
        navigateToCatalog(queuedGameId);
        return;
      case gameRouteKinds.lists:
        navigateToLists(queuedGameId);
        return;
      case gameRouteKinds.builder:
        navigateToBuilder(queuedGameId);
        return;
      case gameRouteKinds.comboDetail:
      case appShellOnlyRouteKinds.recovery:
      case appShellOnlyRouteKinds.root:
        navigateToCatalog(queuedGameId);
        return;
    }
  }, [navigateToBuilder, navigateToCatalog, navigateToLists, queuedGameId, route.kind]);

  const requestNavigateAction = useCallback(
    (action: string) => {
      const normalizedAction = action.startsWith(breadcrumbActionPrefix)
        ? action.slice(breadcrumbActionPrefix.length)
        : action;

      switch (normalizedAction) {
        case shellActionIds.catalog:
          navigateToCatalog(activeBusiness.id);
          return;
        case shellActionIds.catalogCharacter:
          if (route.kind === gameRouteKinds.catalog && route.characterSlug) {
            navigateToCatalogCharacter(activeBusiness.id, route.characterSlug);
            return;
          }
          if (route.kind === gameRouteKinds.comboDetail) {
            navigateToCatalogCharacter(activeBusiness.id, route.characterSlug);
          }
          return;
        case shellActionIds.catalogSpecification:
          if (route.kind === gameRouteKinds.comboDetail) {
            navigateToCatalogResult(
              activeBusiness.id,
              route.characterSlug,
              route.specificationSlug,
            );
          }
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
    [
      activeBusiness.id,
      navigateToBuilder,
      navigateToCatalog,
      navigateToCatalogCharacter,
      navigateToCatalogResult,
      navigateToLists,
      navigateToSettings,
      route,
    ],
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
