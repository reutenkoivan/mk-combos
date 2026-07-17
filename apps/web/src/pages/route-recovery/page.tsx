import { knownControllerCommandIds } from "@mk-combos/controller-bridge/command/value";
import {
  ErrorState,
  errorStateActionKinds,
  errorStateSeverities,
} from "@mk-combos/ui/components/error-state";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { useControllerCommandScope } from "../../app/controller-session/provider";
import {
  controllerCommandRibbonShellPolicies,
  controllerCommandScopeLayers,
} from "../../app/controller-session/value";
import { useLocalStateObservableState } from "../../app/local-state/provider";
import { formatGameCopy, getAppCopy } from "../../app/localization/runtime";
import { installedGames } from "../../game-business/installed-games/value";

export function RouteRecoveryPage() {
  const fallbackBusiness = installedGames[0];
  const localState = useLocalStateObservableState();
  const copy = getAppCopy(localState.appliedSettings.language);
  const navigate = useNavigate();
  const openFallbackCatalog = useCallback(
    () =>
      navigate({
        params: { gameId: fallbackBusiness.id },
        search: {},
        to: "/$gameId/catalog",
      }),
    [navigate],
  );
  const actionLabel = formatGameCopy(copy.shell.openCatalog, fallbackBusiness.label);

  useControllerCommandScope({
    commandIds: [knownControllerCommandIds.confirm],
    handleCommand: (event) => {
      if (event.commandId !== knownControllerCommandIds.confirm) {
        return false;
      }
      void openFallbackCatalog();
      return true;
    },
    id: "route-recovery",
    layer: controllerCommandScopeLayers.page,
    ribbon: {
      accessibleLabel: copy.shell.unavailableRoute,
      commands: [
        {
          commandIds: [knownControllerCommandIds.confirm],
          id: "route-recovery-open-catalog",
          label: actionLabel,
        },
      ],
      shellPolicy: controllerCommandRibbonShellPolicies.append,
    },
  });

  return (
    <main
      data-ui-page="route-recovery"
      className="grid min-h-full content-start bg-(--ui-window) p-6 text-(--ui-text)"
    >
      <ErrorState
        errorToken="invalid-route"
        controllerFocusedActionId="catalog"
        sourceSurface="app-shell-route-recovery"
        title={copy.shell.routeUnavailableTitle}
        severity={errorStateSeverities.recoverable}
        onRequestAction={() => void openFallbackCatalog()}
        message={copy.shell.routeUnavailableDescription}
        technicalReference="route.invalid_or_unavailable"
        actions={[
          {
            available: true,
            id: "catalog",
            kind: errorStateActionKinds.fallback,
            label: actionLabel,
          },
        ]}
      />
    </main>
  );
}
