import { useCallback, useMemo, useSyncExternalStore } from "react";
import { z } from "zod/v4";

import { UiResponsiveModeSchema } from "../components/schema";
import type { UiResponsiveMode } from "../components/type";
import { uiResponsiveModes } from "../components/value";

const desktopMediaQuery = "(min-width: 70rem)";
const tabletMediaQuery = "(min-width: 40rem)";
const serverResponsiveMode = UiResponsiveModeSchema.parse(uiResponsiveModes.desktop);

const ResponsiveMediaSnapshotSchema = z
  .object({ desktopMatches: z.boolean(), tabletMatches: z.boolean() })
  .strict()
  .transform((snapshot): UiResponsiveMode => {
    if (snapshot.desktopMatches) {
      return uiResponsiveModes.desktop;
    }
    return snapshot.tabletMatches ? uiResponsiveModes.tablet : uiResponsiveModes.mobile;
  });

const getMatchMedia = () =>
  typeof globalThis.window === "undefined" || typeof globalThis.window.matchMedia !== "function"
    ? undefined
    : globalThis.window.matchMedia.bind(globalThis.window);

const readBrowserResponsiveMode = (): UiResponsiveMode | undefined => {
  const matchMedia = getMatchMedia();
  if (!matchMedia) {
    return undefined;
  }

  return ResponsiveMediaSnapshotSchema.parse({
    desktopMatches: matchMedia(desktopMediaQuery).matches,
    tabletMatches: matchMedia(tabletMediaQuery).matches,
  });
};

const readResponsiveMode = () => readBrowserResponsiveMode() ?? serverResponsiveMode;
const readServerResponsiveMode = () => serverResponsiveMode;

const subscribeResponsiveMode = (onStoreChange: () => void) => {
  const matchMedia = getMatchMedia();
  if (!matchMedia) {
    return () => undefined;
  }

  const desktop = matchMedia(desktopMediaQuery);
  const tablet = matchMedia(tabletMediaQuery);
  desktop.addEventListener("change", onStoreChange);
  tablet.addEventListener("change", onStoreChange);

  return () => {
    desktop.removeEventListener("change", onStoreChange);
    tablet.removeEventListener("change", onStoreChange);
  };
};

type ResponsiveModeState = {
  isDesktop: boolean;
  isMobile: boolean;
  isTablet: boolean;
  responsiveMode: UiResponsiveMode;
};

/** Stable responsive read model and mode-matching API. */
export type UseResponsiveModeResult = {
  methods: {
    matchesMode: (mode: UiResponsiveMode) => boolean;
  };
  state: ResponsiveModeState;
};

/**
 * Subscribes one owning page surface to the canonical UI responsive mode.
 * Server rendering and browsers without `matchMedia` use the parsed desktop fallback.
 */
export function useResponsiveMode(): UseResponsiveModeResult {
  const responsiveMode = useSyncExternalStore(
    subscribeResponsiveMode,
    readResponsiveMode,
    readServerResponsiveMode,
  );
  const matchesMode = useCallback(
    (mode: UiResponsiveMode) => responsiveMode === mode,
    [responsiveMode],
  );
  const state = useMemo<ResponsiveModeState>(
    () => ({
      isDesktop: responsiveMode === uiResponsiveModes.desktop,
      isMobile: responsiveMode === uiResponsiveModes.mobile,
      isTablet: responsiveMode === uiResponsiveModes.tablet,
      responsiveMode,
    }),
    [responsiveMode],
  );
  const methods = useMemo(() => ({ matchesMode }), [matchesMode]);

  return useMemo(() => ({ methods, state }), [methods, state]);
}
