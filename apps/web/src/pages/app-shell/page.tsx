import { GlobalTopBar } from "@mk-combos/ui/components/global-top-bar";
import { Show } from "@mk-combos/ui/primitives/conditional";
import { LoadingIndicator } from "@mk-combos/ui/primitives/state";
import type { ReactNode } from "react";

import {
  useControllerCommandRibbonModel,
  useControllerSessionObservableState,
} from "../../app/controller-session/provider";
import { useLocalStateObservableState } from "../../app/local-state/provider";
import { useAppUiTheme } from "../../app/providers/provider";
import { ActiveGameBusinessProvider } from "../../game-business/active-game/provider";
import { ControllerCommandRibbon } from "./command-ribbon/component";
import { AppShellControllerOutlet, AppShellControllerOverlayScopes } from "./controller/component";
import { useAppShellController } from "./controller/hook";
import { useAppShellLifecycle } from "./lifecycle/hook";
import { useAppShellSource } from "./navigation-source/hook";
import { useAppShellObservableState } from "./observable-state/hook";
import { useAppShellRoute } from "./route-state/hook";
import { SettingsModal } from "./settings-modal/component";
import { settingsTabs } from "./settings-modal/navigation/value";
import type { SettingsModalSearch } from "./settings-modal/search/type";

type AppShellProps = Readonly<{
  children: ReactNode;
  settingsSearch: SettingsModalSearch;
}>;

export function AppShell({ children, settingsSearch }: AppShellProps) {
  const route = useAppShellRoute();
  const lifecycle = useAppShellLifecycle(route);
  const source = useAppShellSource(route);
  const viewModel = useAppShellObservableState(source);
  const controllerSession = useControllerSessionObservableState();
  const controllerRibbon = useControllerCommandRibbonModel();
  const localState = useLocalStateObservableState();
  const theme = useAppUiTheme();
  const shellController = useAppShellController(source, viewModel.topBar);
  const topBar = {
    ...viewModel.topBar,
    menu: {
      ...viewModel.topBar.menu,
      controllerFocusedActionId: shellController.focusedMenuTargetId,
      responsiveGameSwitcher: shellController.responsiveGameSwitcher,
    },
  };
  const showControllerRibbon =
    controllerSession.connected &&
    controllerRibbon !== null &&
    controllerRibbon.commands.length > 0;
  const settingsModalOpen = settingsSearch.settings !== undefined;
  const settingsSection = settingsSearch.settings ?? settingsTabs.interface;

  return (
    <Show
      when={!lifecycle.redirecting}
      fallback={() => (
        <main className="grid min-h-dvh place-items-center bg-(--ui-window)">
          <LoadingIndicator label="Loading application" />
        </main>
      )}
    >
      {() => (
        <ActiveGameBusinessProvider business={viewModel.activeBusiness}>
          <div
            data-ui-page="UI-PAGE-001"
            data-active-game={viewModel.activeBusiness.id}
            aria-busy={viewModel.navigationPending || undefined}
            className="grid h-dvh grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden bg-(--ui-window)"
          >
            <GlobalTopBar {...topBar} />
            <AppShellControllerOutlet
              theme={theme}
              responsiveMode={source.state.responsiveMode}
              shellOverlayOpen={source.state.topBarMenuOpen || settingsModalOpen}
              controllerConnected={controllerSession.connected}
            >
              {children}
            </AppShellControllerOutlet>
            <AppShellControllerOverlayScopes
              gameMenuScope={shellController.gameMenuScope}
              globalMenuScope={shellController.globalMenuScope}
            />
            <SettingsModal open={settingsModalOpen} section={settingsSection} />
            <Show when={showControllerRibbon}>
              {() => {
                if (controllerRibbon === null) {
                  return null;
                }

                return (
                  <ControllerCommandRibbon
                    commands={controllerRibbon.commands}
                    accessibleLabel={controllerRibbon.accessibleLabel}
                    notationDisplayMode={
                      controllerRibbon.notationDisplayModeOverride ??
                      localState.appliedSettings.notationDisplayMode
                    }
                  />
                );
              }}
            </Show>
          </div>
        </ActiveGameBusinessProvider>
      )}
    </Show>
  );
}

AppShell.displayName = "AppShell";
