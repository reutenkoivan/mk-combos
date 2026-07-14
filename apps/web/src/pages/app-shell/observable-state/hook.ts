import {
  gameSwitcherContexts,
  gameSwitcherMenuActions,
} from "@mk-combos/ui/components/game-switcher";
import type { GlobalTopBarProps } from "@mk-combos/ui/components/global-top-bar";
import { topBarDropdownMenuChangeActions } from "@mk-combos/ui/components/top-bar-dropdown-menu";
import { useMemo } from "react";

import type { AppShellSource } from "../navigation-source/type";
import { getBreadcrumbs } from "./runtime";
import type { AppShellViewModel } from "./type";
import { installedGameOptions, shellSourceSurface, topBarActions } from "./value";

export function useAppShellObservableState(source: AppShellSource): AppShellViewModel {
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
    navigationPending: source.state.navigationPending,
    topBar,
  };
}
