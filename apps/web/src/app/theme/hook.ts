import { UiThemeModeSchema } from "@mk-combos/ui/tokens/schema";
import type { UiThemeMode } from "@mk-combos/ui/tokens/type";
import { uiThemeModes } from "@mk-combos/ui/tokens/value";
import { useSyncExternalStore } from "react";
import { z } from "zod/v4";

import { systemDarkThemeMediaQuery } from "./value";

const serverSystemTheme = UiThemeModeSchema.parse(uiThemeModes.dark);
const SystemThemeSnapshotSchema = z
  .object({ prefersDark: z.boolean() })
  .strict()
  .transform(
    (snapshot): UiThemeMode => (snapshot.prefersDark ? uiThemeModes.dark : uiThemeModes.light),
  );

function getMatchMedia(): typeof window.matchMedia | undefined {
  return typeof globalThis.window === "undefined" ||
    typeof globalThis.window.matchMedia !== "function"
    ? undefined
    : globalThis.window.matchMedia.bind(globalThis.window);
}

function readBrowserSystemTheme(): UiThemeMode | undefined {
  const matchMedia = getMatchMedia();

  if (matchMedia === undefined) {
    return undefined;
  }

  try {
    return SystemThemeSnapshotSchema.parse({
      prefersDark: matchMedia(systemDarkThemeMediaQuery).matches,
    });
  } catch {
    return undefined;
  }
}

const readSystemTheme = () => readBrowserSystemTheme() ?? serverSystemTheme;
const readServerSystemTheme = () => serverSystemTheme;

function subscribeSystemTheme(onStoreChange: () => void): () => void {
  const matchMedia = getMatchMedia();

  if (matchMedia === undefined) {
    return () => undefined;
  }

  try {
    const mediaQuery = matchMedia(systemDarkThemeMediaQuery);
    mediaQuery.addEventListener("change", onStoreChange);

    return () => mediaQuery.removeEventListener("change", onStoreChange);
  } catch {
    return () => undefined;
  }
}

/** Observes the browser color scheme; SSR and unavailable browser APIs resolve to dark. */
export function useSystemTheme(): UiThemeMode {
  return useSyncExternalStore(subscribeSystemTheme, readSystemTheme, readServerSystemTheme);
}
