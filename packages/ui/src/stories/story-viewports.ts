import type { UiResponsiveMode } from "../components/type";
import { uiResponsiveModes } from "../components/value";

export const storyViewportOptions = {
  [uiResponsiveModes.desktop]: {
    name: "Desktop 1440 × 900",
    styles: { height: "900px", width: "1440px" },
    type: "desktop",
  },
  [uiResponsiveModes.mobile]: {
    name: "Mobile 390 × 844",
    styles: { height: "844px", width: "390px" },
    type: "mobile",
  },
  [uiResponsiveModes.tablet]: {
    name: "Tablet 834 × 1112",
    styles: { height: "1112px", width: "834px" },
    type: "tablet",
  },
} as const;

export const storyViewportGlobals = {
  [uiResponsiveModes.desktop]: {
    viewport: { isRotated: false, value: uiResponsiveModes.desktop },
  },
  [uiResponsiveModes.mobile]: {
    viewport: { isRotated: false, value: uiResponsiveModes.mobile },
  },
  [uiResponsiveModes.tablet]: {
    viewport: { isRotated: false, value: uiResponsiveModes.tablet },
  },
} as const satisfies Record<UiResponsiveMode, { viewport: { isRotated: false; value: string } }>;
