import { useResponsiveMode } from "@mk-combos/ui/hooks/responsive-mode";
import { UiRoot } from "@mk-combos/ui/primitives/layout";
import { uiContrastModes, uiDensityModes, uiThemeModes } from "@mk-combos/ui/tokens/value";
import type { ReactNode } from "react";

type AppProvidersProps = Readonly<{
  children: ReactNode;
}>;

export function AppProviders({ children }: AppProvidersProps) {
  const { responsiveMode } = useResponsiveMode().state;

  return (
    <UiRoot
      className="min-h-dvh"
      contrast={uiContrastModes.standard}
      density={uiDensityModes.small}
      responsiveMode={responsiveMode}
      theme={uiThemeModes.dark}
    >
      {children}
    </UiRoot>
  );
}

AppProviders.displayName = "AppProviders";
