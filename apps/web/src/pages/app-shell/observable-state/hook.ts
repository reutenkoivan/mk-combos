import {
  gameSwitcherContexts,
  gameSwitcherMenuActions,
} from "@mk-combos/ui/components/game-switcher";
import type { GlobalTopBarProps } from "@mk-combos/ui/components/global-top-bar";
import { topBarDropdownMenuChangeActions } from "@mk-combos/ui/components/top-bar-dropdown-menu";
import { useMemo } from "react";

import { getAppCopy } from "../../../app/localization/runtime";
import { installedGameOptions } from "../../../game-business/installed-games/presentation";
import type { AppShellSource } from "../navigation-source/type";
import { shellActionIds } from "../navigation-source/value";
import { getBreadcrumbs } from "./runtime";
import type { AppShellViewModel } from "./type";
import { shellSourceSurface } from "./value";

export function useAppShellObservableState(source: AppShellSource): AppShellViewModel {
  const copy = getAppCopy(source.state.language).shell;
  const breadcrumbs = useMemo(() => {
    const routeBreadcrumbs = getBreadcrumbs(
      source.state.route,
      source.state.activeBusiness.id,
      source.state.language,
      copy,
    );

    if (source.state.navigationAvailable && !source.state.navigationPending) {
      return routeBreadcrumbs;
    }

    return routeBreadcrumbs.map((item) => (item.current ? item : { ...item, disabled: true }));
  }, [
    copy,
    source.state.activeBusiness.id,
    source.state.language,
    source.state.navigationAvailable,
    source.state.navigationPending,
    source.state.route,
  ]);
  const topBarActions = useMemo(
    () => [
      {
        available: source.state.navigationAvailable,
        id: shellActionIds.catalog,
        label: copy.catalog,
      },
      {
        available: source.state.navigationAvailable,
        id: shellActionIds.lists,
        label: copy.namedLists,
      },
      {
        available: source.state.navigationAvailable,
        id: shellActionIds.builder,
        label: copy.builder,
      },
      {
        available: source.state.navigationAvailable,
        id: shellActionIds.settings,
        label: copy.settings,
      },
    ],
    [copy, source.state.navigationAvailable],
  );
  const menuActions = useMemo(() => {
    const breadcrumbIds = new Set(breadcrumbs.map((item) => item.id));

    return topBarActions.filter((action) => !breadcrumbIds.has(action.id));
  }, [breadcrumbs, topBarActions]);

  const gameSwitcher = {
    availableGames: installedGameOptions,
    busy: source.state.navigationPending,
    context: gameSwitcherContexts.breadcrumbs,
    disabled: !source.state.navigationAvailable,
    label: copy.chooseGame,
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
      ariaLabel: copy.breadcrumbs,
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
      disabled: !source.state.navigationAvailable,
      label: copy.openGlobalMenu,
      layoutMode: source.state.responsiveMode,
      navigationPending: source.state.navigationPending,
      onRequestAction: ({ action }) => source.methods.requestNavigateAction(action),
      onRequestMenuChange: ({ action }) =>
        source.methods.requestTopBarMenuOpen(action === topBarDropdownMenuChangeActions.open),
      open: source.state.topBarMenuOpen,
      responsiveCloseLabel: copy.closeNavigation,
      responsiveGameSwitcher: gameSwitcher,
      responsiveNavigationLabel: copy.navigation,
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
