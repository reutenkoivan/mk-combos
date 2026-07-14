import type { GameRoute } from "@mk-combos/contracts/routes/type";
import { appRouteKinds } from "@mk-combos/contracts/routes/value";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

import {
  useLocalStateObservableState,
  useLocalStateSource,
} from "../../../app/local-state/provider";
import { formatGameCopy } from "../../../app/localization/runtime";
import type { AppCopy } from "../../../app/localization/type";
import { resolveInstalledGame } from "../../../game-business/installed-games/runtime";
import { settingsSections } from "../search/value";
import { isSettingsTab } from "./runtime";
import { settingsTabs } from "./value";

function getReturnLabel(target: GameRoute, copy: AppCopy["settings"]): string {
  const gameLabel = resolveInstalledGame(target.gameId)?.label ?? target.gameId;

  switch (target.kind) {
    case appRouteKinds.catalog:
      return formatGameCopy(copy.returnCatalog, gameLabel);
    case appRouteKinds.lists:
      return formatGameCopy(copy.returnLists, gameLabel);
    case appRouteKinds.builder:
      return formatGameCopy(copy.returnBuilder, gameLabel);
    case appRouteKinds.comboDetail:
      return formatGameCopy(copy.returnCombo, gameLabel);
  }
}

export function useSettingsNavigation(copy: AppCopy["settings"]) {
  const navigate = useNavigate();
  const localState = useLocalStateObservableState();
  const localStateSource = useLocalStateSource();
  const returnTarget = localState.settingsReturnTarget ?? {
    gameId: localState.resolvedActiveGameId,
    kind: appRouteKinds.catalog,
  };
  const returnLabel = getReturnLabel(returnTarget, copy);

  const selectSection = useCallback(
    (tab: string) => {
      if (!isSettingsTab(tab)) {
        return;
      }

      void navigate({
        replace: true,
        search: tab === settingsTabs.backup ? { section: settingsSections.backup } : {},
        to: "/settings",
      });
    },
    [navigate],
  );

  const returnFromSettings = useCallback(() => {
    localStateSource.clearSettingsReturnTarget();

    switch (returnTarget.kind) {
      case appRouteKinds.catalog:
        void navigate({
          params: { gameId: returnTarget.gameId },
          replace: true,
          search: {},
          to: "/$gameId/catalog",
        });
        return;
      case appRouteKinds.lists:
        void navigate({
          params: { gameId: returnTarget.gameId },
          replace: true,
          search: {},
          to: "/$gameId/lists",
        });
        return;
      case appRouteKinds.builder:
        void navigate({
          params: { gameId: returnTarget.gameId },
          replace: true,
          search: {},
          to: "/$gameId/builder",
        });
        return;
      case appRouteKinds.comboDetail:
        void navigate({
          params: {
            comboId: returnTarget.comboId,
            gameId: returnTarget.gameId,
            source: returnTarget.source,
          },
          replace: true,
          search: {},
          to: "/$gameId/combos/$source/$comboId",
        });
    }
  }, [localStateSource, navigate, returnTarget]);

  return { returnFromSettings, returnLabel, selectSection };
}
