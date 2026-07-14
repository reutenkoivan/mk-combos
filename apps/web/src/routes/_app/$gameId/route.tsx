import { createFileRoute, Outlet } from "@tanstack/react-router";
import { parseInstalledGamePathParams } from "../../../pages/app-shell/installed-game-path/runtime";
import { RouteRecoveryPage } from "../../../pages/route-recovery/page";

export const Route = createFileRoute("/_app/$gameId")({
  component: InstalledGameLayout,
  errorComponent: RouteRecoveryPage,
  params: {
    parse: parseInstalledGamePathParams,
  },
});

function InstalledGameLayout() {
  return <Outlet />;
}
