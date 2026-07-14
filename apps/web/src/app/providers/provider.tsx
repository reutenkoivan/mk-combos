import type { UiResponsiveMode } from "@mk-combos/ui/components/type";
import { useResponsiveMode } from "@mk-combos/ui/hooks/responsive-mode";
import { UiRoot } from "@mk-combos/ui/primitives/layout";
import { uiContrastModes, uiDensityModes, uiThemeModes } from "@mk-combos/ui/tokens/value";
import { createContext, type ReactNode, useContext } from "react";

import { LocalStateProvider } from "../local-state/provider";

type AppProvidersProps = Readonly<{
  children: ReactNode;
}>;

const AppResponsiveModeContext = createContext<UiResponsiveMode | undefined>(undefined);

export function useAppResponsiveMode(): UiResponsiveMode {
  const responsiveMode = useContext(AppResponsiveModeContext);

  if (responsiveMode === undefined) {
    throw new Error("useAppResponsiveMode must be used within AppProviders");
  }

  return responsiveMode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const { responsiveMode } = useResponsiveMode().state;

  return (
    <LocalStateProvider>
      <AppResponsiveModeContext value={responsiveMode}>
        <UiRoot
          className="min-h-dvh"
          contrast={uiContrastModes.standard}
          density={uiDensityModes.small}
          responsiveMode={responsiveMode}
          theme={uiThemeModes.dark}
        >
          {children}
        </UiRoot>
      </AppResponsiveModeContext>
    </LocalStateProvider>
  );
}

AppProviders.displayName = "AppProviders";
