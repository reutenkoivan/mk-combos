import type { UiResponsiveMode } from "@mk-combos/ui/components/type";
import { useResponsiveMode } from "@mk-combos/ui/hooks/responsive-mode";
import { UiRoot } from "@mk-combos/ui/primitives/layout";
import type { UiThemeMode } from "@mk-combos/ui/tokens/type";
import { uiContrastModes, uiDensityModes } from "@mk-combos/ui/tokens/value";
import { createContext, type ReactNode, useContext } from "react";

import {
  ControllerSessionProvider,
  useControllerSessionObservableState,
} from "../controller-session/provider";
import { LocalStateProvider, useLocalStateObservableState } from "../local-state/provider";
import { useSystemTheme } from "../theme/hook";
import { resolveThemePreference } from "../theme/runtime";

type AppProvidersProps = Readonly<{
  children: ReactNode;
}>;

const AppResponsiveModeContext = createContext<UiResponsiveMode | undefined>(undefined);
const AppUiThemeContext = createContext<UiThemeMode | undefined>(undefined);

type AppUiRootProps = Readonly<{
  children: ReactNode;
  responsiveMode: UiResponsiveMode;
}>;

export function useAppResponsiveMode(): UiResponsiveMode {
  const responsiveMode = useContext(AppResponsiveModeContext);

  if (responsiveMode === undefined) {
    throw new Error("useAppResponsiveMode must be used within AppProviders");
  }

  return responsiveMode;
}

export function useAppUiTheme(): UiThemeMode {
  const theme = useContext(AppUiThemeContext);

  if (theme === undefined) {
    throw new Error("useAppUiTheme must be used within AppProviders");
  }

  return theme;
}

function AppUiRoot({ children, responsiveMode }: AppUiRootProps) {
  const controllerSession = useControllerSessionObservableState();
  const localState = useLocalStateObservableState();
  const systemTheme = useSystemTheme();
  const theme = resolveThemePreference(localState.appliedSettings.themePreference, systemTheme);

  return (
    <AppUiThemeContext value={theme}>
      <UiRoot
        theme={theme}
        className="min-h-dvh"
        density={uiDensityModes.small}
        responsiveMode={responsiveMode}
        contrast={uiContrastModes.standard}
        controllerFocusVisible={controllerSession.connected}
      >
        {children}
      </UiRoot>
    </AppUiThemeContext>
  );
}

export function AppProviders({ children }: AppProvidersProps) {
  const { responsiveMode } = useResponsiveMode().state;

  return (
    <LocalStateProvider>
      <ControllerSessionProvider>
        <AppResponsiveModeContext value={responsiveMode}>
          <AppUiRoot responsiveMode={responsiveMode}>{children}</AppUiRoot>
        </AppResponsiveModeContext>
      </ControllerSessionProvider>
    </LocalStateProvider>
  );
}

AppProviders.displayName = "AppProviders";
