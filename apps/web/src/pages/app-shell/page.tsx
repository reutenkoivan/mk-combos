import { GlobalTopBar } from "@mk-combos/ui/components/global-top-bar";
import type { ReactNode } from "react";

import { ActiveGameBusinessProvider } from "../../game-business/active-game/provider";
import { useAppShellSource } from "./navigation-source/hook";
import { useAppShellObservableState } from "./observable-state/hook";
import { useAppShellRoute } from "./route-state/hook";

type AppShellProps = Readonly<{
  children: ReactNode;
}>;

export function AppShell({ children }: AppShellProps) {
  const route = useAppShellRoute();
  const source = useAppShellSource(route);
  const viewModel = useAppShellObservableState(source);

  return (
    <ActiveGameBusinessProvider business={viewModel.activeBusiness}>
      <div
        aria-busy={viewModel.navigationPending || undefined}
        className="grid min-h-dvh grid-rows-[auto_minmax(0,1fr)] bg-[var(--ui-window)]"
        data-active-game={viewModel.activeBusiness.id}
        data-ui-page="UI-PAGE-001"
      >
        <GlobalTopBar {...viewModel.topBar} />
        <div className="min-h-0 overflow-auto">{children}</div>
      </div>
    </ActiveGameBusinessProvider>
  );
}

AppShell.displayName = "AppShell";
