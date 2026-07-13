import { createContext, useContext } from "react";

import type { UiResponsiveMode } from "../components/type";
import { uiResponsiveModes } from "../components/value";
import type { UiContrastMode, UiDensityMode, UiThemeMode } from "../tokens/type";
import { uiContrastModes, uiDensityModes, uiThemeModes } from "../tokens/value";

export type UiRootContextValue = {
  contrast: UiContrastMode;
  density: UiDensityMode;
  responsiveMode: UiResponsiveMode;
  theme: UiThemeMode;
};

const defaultUiRootContextValue: UiRootContextValue = {
  contrast: uiContrastModes.standard,
  density: uiDensityModes.small,
  responsiveMode: uiResponsiveModes.desktop,
  theme: uiThemeModes.dark,
};

export const UiRootContext = createContext<UiRootContextValue>(defaultUiRootContextValue);

export function useUiRootContext() {
  return useContext(UiRootContext);
}
