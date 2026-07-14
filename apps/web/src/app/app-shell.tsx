import type { GameId } from "@mk-combos/contracts/identity/type";
import { appRouteKinds } from "@mk-combos/contracts/routes/value";
import {
  gameSwitcherContexts,
  gameSwitcherMenuActions,
} from "@mk-combos/ui/components/game-switcher";
import { GlobalTopBar, type GlobalTopBarProps } from "@mk-combos/ui/components/global-top-bar";
import {
  type TopBarMenuAction,
  topBarDropdownMenuChangeActions,
} from "@mk-combos/ui/components/top-bar-dropdown-menu";
import type { BreadcrumbItem, GameSwitcherOption } from "@mk-combos/ui/components/type";
import { componentOptionStatuses } from "@mk-combos/ui/components/value";
import { useNavigate } from "@tanstack/react-router";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  type InstalledGameBusiness,
  installedGames,
  resolveInstalledGame,
} from "../game-business/installed-games";
import { type AppShellRoute, appShellOnlyRouteKinds, useAppShellRoute } from "../routing/app-route";
import { ActiveGameBusinessProvider } from "./active-game";
import { useAppResponsiveMode } from "./providers";

const shellSourceSurface = "app-shell";
const breadcrumbActionPrefix = "breadcrumb:";

const shellActionIds = {
  builder: "builder",
  catalog: "catalog",
  lists: "lists",
  settings: "settings",
} as const;

const shellBreadcrumbIds = {
  builder: "builder",
  catalog: "catalog",
  comboDetail: "combo-detail",
  lists: "lists",
  recovery: "recovery",
  root: "root",
  settings: "settings",
} as const;

const installedGameOptions: readonly GameSwitcherOption[] = installedGames.map((business) => ({
  gameId: business.id,
  label: business.label,
  shortLabel: business.label,
  status: componentOptionStatuses.available,
}));

const topBarActions: readonly TopBarMenuAction[] = [
  { available: true, id: shellActionIds.catalog, label: "Catalog" },
  { available: true, id: shellActionIds.lists, label: "Named Lists" },
  { available: true, id: shellActionIds.builder, label: "Builder" },
  { available: true, id: shellActionIds.settings, label: "Settings" },
];

type AppShellProps = Readonly<{
  children: ReactNode;
}>;

type AppShellNavigationRequest = () => Promise<void>;

type AppShellSource = Readonly<{
  methods: Readonly<{
    requestGameMenuOpen: (open: boolean) => void;
    requestNavigateAction: (action: string) => void;
    requestSelectGame: (gameId: string) => void;
    requestTopBarMenuOpen: (open: boolean) => void;
  }>;
  state: Readonly<{
    activeBusiness: InstalledGameBusiness;
    gameMenuOpen: boolean;
    navigationPending: boolean;
    responsiveMode: ReturnType<typeof useAppResponsiveMode>;
    route: AppShellRoute;
    topBarMenuOpen: boolean;
  }>;
}>;

type AppShellViewProps = Readonly<{
  activeBusiness: InstalledGameBusiness;
  children: ReactNode;
  navigationPending: boolean;
  topBar: GlobalTopBarProps;
}>;

function getRouteGameId(route: AppShellRoute): GameId | undefined {
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

function useAppShellSource(route: AppShellRoute): AppShellSource {
  const responsiveMode = useAppResponsiveMode();
  const navigate = useNavigate();
  const routeGameId = getRouteGameId(route);
  const routeBusiness = routeGameId === undefined ? undefined : resolveInstalledGame(routeGameId);
  const [sessionGameId, setSessionGameId] = useState<GameId>(installedGames[0].id);
  const [gameMenuOpen, setGameMenuOpen] = useState(false);
  const [topBarMenuOpen, setTopBarMenuOpen] = useState(false);
  const [queuedGameId, setQueuedGameId] = useState<GameId>();
  const [queuedNavigation, setQueuedNavigation] = useState<AppShellNavigationRequest>();
  const [navigationInFlight, setNavigationInFlight] = useState(false);
  const [transitionPending, startNavigationTransition] = useTransition();
  const requestedGameIdRef = useRef<GameId | undefined>(undefined);
  const navigationPendingRef = useRef(false);
  const navigationPending = navigationInFlight || transitionPending;

  useEffect(() => {
    if (routeBusiness !== undefined) {
      setSessionGameId(routeBusiness.id);
    }
  }, [routeBusiness]);

  const activeBusiness = routeBusiness ?? resolveInstalledGame(sessionGameId) ?? installedGames[0];

  const closeMenus = useCallback(() => {
    setGameMenuOpen(false);
    setTopBarMenuOpen(false);
  }, []);

  const requestNavigation = useCallback((request: AppShellNavigationRequest) => {
    if (navigationPendingRef.current) {
      return;
    }

    navigationPendingRef.current = true;
    setQueuedNavigation(() => request);
  }, []);

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
    setSessionGameId(activeBusiness.id);
    closeMenus();
    requestNavigation(() => navigate({ search: {}, to: "/settings" }));
  }, [activeBusiness.id, closeMenus, navigate, requestNavigation]);

  const requestSelectGame = useCallback((gameId: string) => {
    const selectedBusiness = resolveInstalledGame(gameId);

    if (selectedBusiness === undefined) {
      return;
    }

    requestedGameIdRef.current = selectedBusiness.id;
  }, []);

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
        setSessionGameId(queuedGameId);
        closeMenus();
    }
  }, [closeMenus, navigateToBuilder, navigateToCatalog, navigateToLists, queuedGameId, route.kind]);

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
      requestGameMenuOpen: (open) => setGameMenuOpen(open),
      requestNavigateAction,
      requestSelectGame,
      requestTopBarMenuOpen: setTopBarMenuOpen,
    },
    state: {
      activeBusiness,
      gameMenuOpen,
      navigationPending,
      responsiveMode,
      route,
      topBarMenuOpen,
    },
  };
}

function getBreadcrumbs(route: AppShellRoute, activeGameId: GameId): readonly BreadcrumbItem[] {
  const catalog: BreadcrumbItem = {
    current: false,
    disabled: false,
    id: shellBreadcrumbIds.catalog,
    kind: appRouteKinds.catalog,
    label: "Catalog",
    target: {
      params: { gameId: activeGameId },
      route: "/$gameId/catalog",
      surfaceCode: "UI-PAGE-003",
    },
  };

  switch (route.kind) {
    case appRouteKinds.catalog:
      return [{ ...catalog, current: true, target: undefined }];
    case appRouteKinds.lists:
      return [
        catalog,
        {
          current: true,
          disabled: false,
          id: shellBreadcrumbIds.lists,
          kind: appRouteKinds.lists,
          label: "Named Lists",
        },
      ];
    case appRouteKinds.builder:
      return [
        catalog,
        {
          current: true,
          disabled: false,
          id: shellBreadcrumbIds.builder,
          kind: appRouteKinds.builder,
          label: "Builder",
        },
      ];
    case appRouteKinds.comboDetail:
      return [
        catalog,
        {
          current: true,
          disabled: false,
          id: shellBreadcrumbIds.comboDetail,
          kind: appRouteKinds.comboDetail,
          label: route.comboId,
          truncationLabel: `Combo ${route.comboId}`,
        },
      ];
    case appRouteKinds.settings:
      return [
        {
          current: true,
          disabled: false,
          id: shellBreadcrumbIds.settings,
          kind: appRouteKinds.settings,
          label: "Settings",
        },
      ];
    case appShellOnlyRouteKinds.root:
      return [
        {
          current: true,
          disabled: false,
          id: shellBreadcrumbIds.root,
          kind: appShellOnlyRouteKinds.root,
          label: "First launch",
        },
      ];
    case appShellOnlyRouteKinds.recovery:
      return [
        {
          current: true,
          disabled: false,
          id: shellBreadcrumbIds.recovery,
          kind: appShellOnlyRouteKinds.recovery,
          label: "Unavailable route",
        },
      ];
  }
}

function AppShellView(props: AppShellViewProps) {
  return (
    <ActiveGameBusinessProvider business={props.activeBusiness}>
      <div
        aria-busy={props.navigationPending || undefined}
        className="grid min-h-dvh grid-rows-[auto_minmax(0,1fr)] bg-[var(--ui-window)]"
        data-active-game={props.activeBusiness.id}
        data-ui-page="UI-PAGE-001"
      >
        <GlobalTopBar {...props.topBar} />
        <div className="min-h-0 overflow-auto">{props.children}</div>
      </div>
    </ActiveGameBusinessProvider>
  );
}

function useAppShellObservableState(
  source: AppShellSource,
  children: ReactNode,
): AppShellViewProps {
  const breadcrumbs = useMemo(() => {
    const routeBreadcrumbs = getBreadcrumbs(source.state.route, source.state.activeBusiness.id);

    if (!source.state.navigationPending) {
      return routeBreadcrumbs;
    }

    return routeBreadcrumbs.map((item) => (item.current ? item : { ...item, disabled: true }));
  }, [source.state.activeBusiness.id, source.state.navigationPending, source.state.route]);
  const menuActions = useMemo(() => {
    const breadcrumbIds = new Set(breadcrumbs.map((item) => item.id));

    return topBarActions.filter((action) => !breadcrumbIds.has(action.id));
  }, [breadcrumbs]);

  const gameSwitcher = {
    availableGames: installedGameOptions,
    busy: source.state.navigationPending,
    context: gameSwitcherContexts.breadcrumbs,
    label: "Choose game",
    menuOpen: source.state.gameMenuOpen,
    onRequestMenuChange: ({ action }) =>
      source.methods.requestGameMenuOpen(action === gameSwitcherMenuActions.open),
    onRequestSelectGame: ({ value }) => source.methods.requestSelectGame(value),
    selectedGameId: source.state.activeBusiness.id,
    sourceFocusTarget: "app-shell-game-switcher",
    sourceSurface: shellSourceSurface,
  } satisfies GlobalTopBarProps["breadcrumbs"]["gameSwitcher"];

  const topBar: GlobalTopBarProps = {
    breadcrumbs: {
      ariaLabel: "Breadcrumbs",
      gameSwitcher,
      items: breadcrumbs,
      layoutMode: source.state.responsiveMode,
      onRequestNavigate: ({ value }) => source.methods.requestNavigateAction(value),
      sourceFocusTarget: "app-shell-breadcrumbs",
      sourceSurface: shellSourceSurface,
    },
    layoutMode: source.state.responsiveMode,
    menu: {
      actions: menuActions,
      breadcrumbs,
      label: "Open global menu",
      layoutMode: source.state.responsiveMode,
      navigationPending: source.state.navigationPending,
      onRequestAction: ({ action }) => source.methods.requestNavigateAction(action),
      onRequestMenuChange: ({ action }) =>
        source.methods.requestTopBarMenuOpen(action === topBarDropdownMenuChangeActions.open),
      open: source.state.topBarMenuOpen,
      responsiveCloseLabel: "Close navigation",
      responsiveGameSwitcher: gameSwitcher,
      responsiveNavigationLabel: "Navigation",
      sourceFocusTarget: "app-shell-global-menu",
      sourceSurface: shellSourceSurface,
    },
  };

  return {
    activeBusiness: source.state.activeBusiness,
    children,
    navigationPending: source.state.navigationPending,
    topBar,
  };
}

export function AppShell({ children }: AppShellProps) {
  const route = useAppShellRoute();
  const source = useAppShellSource(route);
  const viewProps = useAppShellObservableState(source, children);

  return <AppShellView {...viewProps} />;
}

AppShell.displayName = "AppShell";
