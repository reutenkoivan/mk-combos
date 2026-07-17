import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/$gameId/catalog")({
  component: CatalogLayout,
});

function CatalogLayout() {
  return <Outlet />;
}
