import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RouteRecoveryPage } from "../../../app/route-placeholder";
import { parseInstalledGamePathParams } from "../../../routing/route-params";

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
