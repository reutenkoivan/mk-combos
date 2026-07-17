import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/$gameId/catalog/$character")({
  component: CatalogCharacterLayout,
});

function CatalogCharacterLayout() {
  return <Outlet />;
}
