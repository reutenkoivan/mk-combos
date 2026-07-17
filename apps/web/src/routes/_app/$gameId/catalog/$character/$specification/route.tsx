import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/$gameId/catalog/$character/$specification")({
  component: CatalogSpecificationLayout,
});

function CatalogSpecificationLayout() {
  return <Outlet />;
}
