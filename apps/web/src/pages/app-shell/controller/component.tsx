import type { UiResponsiveMode } from "@mk-combos/ui/components/type";
import { UiRoot } from "@mk-combos/ui/primitives/layout";
import type { UiThemeMode } from "@mk-combos/ui/tokens/type";
import { uiContrastModes, uiDensityModes } from "@mk-combos/ui/tokens/value";
import type { ReactNode } from "react";

import { useControllerCommandScope } from "../../../app/controller-session/provider";
import type { ControllerCommandScope } from "../../../app/controller-session/type";

type AppShellControllerOutletProps = Readonly<{
  children: ReactNode;
  controllerConnected: boolean;
  responsiveMode: UiResponsiveMode;
  shellOverlayOpen: boolean;
  theme: UiThemeMode;
}>;

/** Keeps page focus state mounted while assigning the visible controller ring to shell overlays. */
export function AppShellControllerOutlet({
  children,
  controllerConnected,
  responsiveMode,
  shellOverlayOpen,
  theme,
}: AppShellControllerOutletProps) {
  const pageControllerFocusVisible = controllerConnected && !shellOverlayOpen;

  return (
    <div
      data-app-shell-outlet
      className="min-h-0 overflow-auto"
      data-app-shell-controller-focus-owner={
        pageControllerFocusVisible ? "page" : shellOverlayOpen ? "shell-overlay" : "none"
      }
    >
      <UiRoot
        theme={theme}
        density={uiDensityModes.small}
        responsiveMode={responsiveMode}
        data-app-shell-page-focus-boundary
        contrast={uiContrastModes.standard}
        controllerFocusVisible={pageControllerFocusVisible}
      >
        {children}
      </UiRoot>
    </div>
  );
}

AppShellControllerOutlet.displayName = "AppShellControllerOutlet";

type AppShellControllerOverlayScopesProps = Readonly<{
  gameMenuScope: ControllerCommandScope;
  globalMenuScope: ControllerCommandScope;
}>;

/** Registers shell overlays after the route outlet so they sit above page overlays. */
export function AppShellControllerOverlayScopes({
  gameMenuScope,
  globalMenuScope,
}: AppShellControllerOverlayScopesProps) {
  useControllerCommandScope(globalMenuScope);
  useControllerCommandScope(gameMenuScope);

  return null;
}

AppShellControllerOverlayScopes.displayName = "AppShellControllerOverlayScopes";
