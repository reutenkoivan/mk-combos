import { useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import { useCallback } from "react";

import { isSettingsTab, withSettingsTabSearch } from "./runtime";

type SettingsModalHistoryState = Readonly<{
  settingsModalEntry?: boolean;
}>;

export function useSettingsNavigation() {
  const navigate = useNavigate();
  const router = useRouter();
  const href = useRouterState({ select: (state) => state.location.href });
  const openedFromShell = useRouterState({
    select: (state) =>
      (state.location.state as SettingsModalHistoryState).settingsModalEntry === true,
  });

  const closeSettings = useCallback(() => {
    if (openedFromShell) {
      router.history.back();
      return;
    }

    void navigate({
      href: withSettingsTabSearch(href),
      replace: true,
      resetScroll: false,
      state: (state) => ({ ...state, settingsModalEntry: undefined }),
    });
  }, [href, navigate, openedFromShell, router.history]);

  const selectSection = useCallback(
    (tab: string) => {
      if (!isSettingsTab(tab)) {
        return;
      }

      void navigate({
        href: withSettingsTabSearch(href, tab),
        replace: true,
        resetScroll: false,
        state: true,
      });
    },
    [href, navigate],
  );

  return { closeSettings, selectSection };
}
