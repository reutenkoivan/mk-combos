import { knownControllerCommandIds } from "@mk-combos/controller-bridge/command/value";
import type { GlobalTopBarProps } from "@mk-combos/ui/components/global-top-bar";
import { uiResponsiveModes } from "@mk-combos/ui/components/value";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useControllerCommandScope } from "../../../app/controller-session/provider";
import type { ControllerCommandScope } from "../../../app/controller-session/type";
import {
  controllerCommandRibbonShellPolicies,
  controllerCommandScopeLayers,
} from "../../../app/controller-session/value";
import { getAppCopy } from "../../../app/localization/runtime";
import type { AppShellSource } from "../navigation-source/type";
import { getControllerGameMenuOptions, moveCircular } from "./runtime";

const navigationCommandIds = [
  knownControllerCommandIds.navUp,
  knownControllerCommandIds.navDown,
  knownControllerCommandIds.navLeft,
  knownControllerCommandIds.navRight,
] as const;

type ShellMenuTarget = Readonly<{
  action?: string;
  id: string;
  kind: "game-switcher" | "navigation";
  label: string;
}>;

export function useAppShellController(source: AppShellSource, topBar: GlobalTopBarProps) {
  const copy = getAppCopy(source.state.language);
  const [focusedMenuTargetId, setFocusedMenuTargetId] = useState<string>();
  const [focusedGameId, setFocusedGameId] = useState<string>(source.state.activeBusiness.id);
  const menuTargets = useMemo(() => {
    const targets: ShellMenuTarget[] = [];

    if (source.state.responsiveMode === uiResponsiveModes.mobile) {
      if (topBar.menu.responsiveGameSwitcher && !topBar.menu.responsiveGameSwitcher.disabled) {
        targets.push({
          id: "app-shell-game-switcher",
          kind: "game-switcher",
          label: topBar.menu.responsiveGameSwitcher.label,
        });
      }

      for (const breadcrumb of topBar.menu.breadcrumbs ?? []) {
        if (breadcrumb.current || breadcrumb.disabled || !breadcrumb.target) {
          continue;
        }

        targets.push({
          action: `breadcrumb:${breadcrumb.id}`,
          id: `breadcrumb:${breadcrumb.id}`,
          kind: "navigation",
          label: breadcrumb.label,
        });
      }
    }

    for (const action of topBar.menu.actions) {
      if (!action.available || action.disabledReason) {
        continue;
      }

      targets.push({
        action: action.id,
        id: action.id,
        kind: "navigation",
        label: action.label,
      });
    }

    return targets;
  }, [source.state.responsiveMode, topBar.menu]);
  const focusedMenuTarget =
    menuTargets.find((target) => target.id === focusedMenuTargetId) ?? menuTargets[0];
  const controllerGameOptions = useMemo(
    () =>
      getControllerGameMenuOptions(
        topBar.menu.responsiveGameSwitcher?.availableGames ?? [],
        source.state.activeBusiness.id,
      ),
    [source.state.activeBusiness.id, topBar.menu.responsiveGameSwitcher?.availableGames],
  );
  const focusedGame =
    controllerGameOptions.find((game) => game.gameId === focusedGameId) ?? controllerGameOptions[0];

  useEffect(() => {
    if (!source.state.topBarMenuOpen) {
      return;
    }

    if (!menuTargets.some((target) => target.id === focusedMenuTargetId)) {
      setFocusedMenuTargetId(menuTargets[0]?.id);
    }
  }, [focusedMenuTargetId, menuTargets, source.state.topBarMenuOpen]);

  useEffect(() => {
    if (
      source.state.gameMenuOpen &&
      !controllerGameOptions.some((game) => game.gameId === focusedGameId)
    ) {
      const fallbackGameId = controllerGameOptions[0]?.gameId;

      if (fallbackGameId !== undefined) {
        setFocusedGameId(fallbackGameId);
      }
    }
  }, [controllerGameOptions, focusedGameId, source.state.gameMenuOpen]);

  const closeGlobalMenu = useCallback(() => {
    source.methods.requestGameMenuOpen(false);
    source.methods.requestTopBarMenuOpen(false);
  }, [source.methods]);

  useControllerCommandScope({
    commandIds: [knownControllerCommandIds.openGlobalMenu],
    enabled: source.state.navigationAvailable && !source.state.navigationPending,
    handleCommand: (event) => {
      if (event.commandId !== knownControllerCommandIds.openGlobalMenu) {
        return false;
      }

      source.methods.requestTopBarMenuOpen(!source.state.topBarMenuOpen);
      return true;
    },
    id: "app-shell-global-menu",
    layer: controllerCommandScopeLayers.shell,
    ribbon: {
      accessibleLabel: copy.shell.navigation,
      commands: [
        {
          commandIds: [knownControllerCommandIds.openGlobalMenu],
          id: "app-shell-menu",
          label: copy.shell.openGlobalMenu,
        },
      ],
      shellPolicy: controllerCommandRibbonShellPolicies.append,
    },
  });

  const globalMenuScope = {
    commandIds: [
      ...navigationCommandIds,
      knownControllerCommandIds.confirm,
      knownControllerCommandIds.back,
      knownControllerCommandIds.openGlobalMenu,
    ],
    enabled:
      source.state.navigationAvailable &&
      !source.state.navigationPending &&
      source.state.topBarMenuOpen &&
      !source.state.gameMenuOpen,
    exclusive: true,
    handleCommand: (event) => {
      switch (event.commandId) {
        case knownControllerCommandIds.navUp:
        case knownControllerCommandIds.navLeft:
        case knownControllerCommandIds.navDown:
        case knownControllerCommandIds.navRight: {
          const next = moveCircular(
            menuTargets,
            menuTargets.findIndex((target) => target.id === focusedMenuTarget?.id),
            event.commandId === knownControllerCommandIds.navUp ||
              event.commandId === knownControllerCommandIds.navLeft
              ? -1
              : 1,
          );
          setFocusedMenuTargetId(next?.id);
          return true;
        }
        case knownControllerCommandIds.confirm:
          if (!focusedMenuTarget) {
            return false;
          }
          if (focusedMenuTarget.kind === "game-switcher") {
            setFocusedGameId(controllerGameOptions[0]?.gameId ?? source.state.activeBusiness.id);
            source.methods.requestGameMenuOpen(true);
          } else if (focusedMenuTarget.action) {
            source.methods.requestNavigateAction(focusedMenuTarget.action);
          }
          return true;
        case knownControllerCommandIds.back:
        case knownControllerCommandIds.openGlobalMenu:
          closeGlobalMenu();
          return true;
        default:
          return false;
      }
    },
    id: "app-shell-global-menu-overlay",
    layer: controllerCommandScopeLayers.overlay,
    ribbon: {
      accessibleLabel: copy.shell.navigation,
      commands: [
        {
          commandIds: navigationCommandIds,
          id: "app-shell-menu-navigation",
          label: copy.catalog.navigateCommand,
        },
        ...(focusedMenuTarget
          ? [
              {
                commandIds: [knownControllerCommandIds.confirm],
                id: "app-shell-menu-confirm",
                label: focusedMenuTarget.label,
              },
            ]
          : []),
        {
          commandIds: [knownControllerCommandIds.back],
          id: "app-shell-menu-back",
          label: copy.shell.closeNavigation,
        },
        {
          commandIds: [knownControllerCommandIds.openGlobalMenu],
          id: "app-shell-menu-toggle",
          label: copy.shell.closeNavigation,
        },
      ],
      shellPolicy: controllerCommandRibbonShellPolicies.append,
    },
  } satisfies ControllerCommandScope;

  const gameMenuScope = {
    commandIds: [
      ...navigationCommandIds,
      knownControllerCommandIds.confirm,
      knownControllerCommandIds.back,
      knownControllerCommandIds.openGlobalMenu,
    ],
    enabled:
      source.state.navigationAvailable &&
      !source.state.navigationPending &&
      source.state.topBarMenuOpen &&
      source.state.gameMenuOpen,
    exclusive: true,
    handleCommand: (event) => {
      switch (event.commandId) {
        case knownControllerCommandIds.navUp:
        case knownControllerCommandIds.navLeft:
        case knownControllerCommandIds.navDown:
        case knownControllerCommandIds.navRight: {
          const next = moveCircular(
            controllerGameOptions,
            controllerGameOptions.findIndex((game) => game.gameId === focusedGame?.gameId),
            event.commandId === knownControllerCommandIds.navUp ||
              event.commandId === knownControllerCommandIds.navLeft
              ? -1
              : 1,
          );
          if (next !== undefined) {
            setFocusedGameId(next.gameId);
          }
          return true;
        }
        case knownControllerCommandIds.confirm:
          if (!focusedGame) {
            return false;
          }
          source.methods.requestSelectGame(focusedGame.gameId);
          source.methods.requestGameMenuOpen(false);
          return true;
        case knownControllerCommandIds.back:
          source.methods.requestGameMenuOpen(false);
          setFocusedMenuTargetId("app-shell-game-switcher");
          return true;
        case knownControllerCommandIds.openGlobalMenu:
          closeGlobalMenu();
          return true;
        default:
          return false;
      }
    },
    id: "app-shell-game-menu-overlay",
    layer: controllerCommandScopeLayers.overlay,
    ribbon: {
      accessibleLabel: copy.shell.chooseGame,
      commands: [
        {
          commandIds: navigationCommandIds,
          id: "app-shell-game-navigation",
          label: copy.catalog.navigateCommand,
        },
        ...(focusedGame
          ? [
              {
                commandIds: [knownControllerCommandIds.confirm],
                id: "app-shell-game-confirm",
                label: focusedGame.label,
              },
            ]
          : []),
        {
          commandIds: [knownControllerCommandIds.back],
          id: "app-shell-game-back",
          label: copy.shell.closeNavigation,
        },
        {
          commandIds: [knownControllerCommandIds.openGlobalMenu],
          id: "app-shell-game-menu-toggle",
          label: copy.shell.closeNavigation,
        },
      ],
      shellPolicy: controllerCommandRibbonShellPolicies.append,
    },
  } satisfies ControllerCommandScope;

  return {
    focusedMenuTargetId:
      source.state.topBarMenuOpen && !source.state.gameMenuOpen ? focusedMenuTarget?.id : undefined,
    gameMenuScope,
    globalMenuScope,
    responsiveGameSwitcher: topBar.menu.responsiveGameSwitcher
      ? {
          ...topBar.menu.responsiveGameSwitcher,
          controllerFocused:
            source.state.topBarMenuOpen &&
            !source.state.gameMenuOpen &&
            focusedMenuTarget?.kind === "game-switcher",
          controllerFocusedGameId: source.state.gameMenuOpen ? focusedGame?.gameId : undefined,
        }
      : undefined,
  };
}
