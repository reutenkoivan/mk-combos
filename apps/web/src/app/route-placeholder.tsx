import {
  ErrorState,
  errorStateActionKinds,
  errorStateSeverities,
} from "@mk-combos/ui/components/error-state";
import { useNavigate } from "@tanstack/react-router";
import { installedGames } from "../game-business/installed-games";
import { useActiveGameBusiness } from "./active-game";

type RoutePlaceholderProps = Readonly<{
  description: string;
  details?: string;
  pageCode: string;
  title: string;
}>;

export function RoutePlaceholder(props: RoutePlaceholderProps) {
  const activeBusiness = useActiveGameBusiness();

  return (
    <main
      className="grid min-h-full content-start gap-4 bg-[var(--ui-window)] p-6 text-[var(--ui-text)]"
      data-active-game={activeBusiness.id}
      data-ui-page={props.pageCode}
    >
      <header className="grid max-w-3xl gap-2 border-l-4 border-[var(--ui-accent)] py-1 pl-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ui-accent)]">
          {props.pageCode}
        </span>
        <h1 className="font-[var(--ui-font-display)] text-3xl font-semibold tracking-tight">
          {props.title}
        </h1>
        <p className="text-sm text-[var(--ui-muted-text)]">{props.description}</p>
        <p className="text-xs text-[var(--ui-muted-text)]">Active game: {activeBusiness.label}</p>
        {props.details && <p className="text-xs text-[var(--ui-muted-text)]">{props.details}</p>}
      </header>
    </main>
  );
}

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
