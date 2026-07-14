import {
  ErrorState,
  errorStateActionKinds,
  errorStateSeverities,
} from "@mk-combos/ui/components/error-state";
import { useNavigate } from "@tanstack/react-router";
import { installedGames } from "../../game-business/installed-games/value";

export function RouteRecoveryPage() {
  const fallbackBusiness = installedGames[0];
  const navigate = useNavigate();

  return (
    <main
      className="grid min-h-full content-start bg-[var(--ui-window)] p-6 text-[var(--ui-text)]"
      data-ui-page="route-recovery"
    >
      <ErrorState
        actions={[
          {
            available: true,
            id: "catalog",
            kind: errorStateActionKinds.fallback,
            label: `Open ${fallbackBusiness.label} Catalog`,
          },
        ]}
        errorToken="invalid-route"
        message="The requested route does not match an installed game or supported application surface."
        onRequestAction={() =>
          navigate({
            params: { gameId: fallbackBusiness.id },
            search: {},
            to: "/$gameId/catalog",
          })
        }
        severity={errorStateSeverities.recoverable}
        sourceSurface="app-shell-route-recovery"
        technicalReference="route.invalid_or_unavailable"
        title="This route is unavailable"
      />
    </main>
  );
}
