import { createFileRoute } from "@tanstack/react-router";

import { CatalogSpecificationSelectionPage } from "../../../../../pages/catalog/page";

export const Route = createFileRoute("/_app/$gameId/catalog/$character/")({
  component: CatalogSpecificationSelectionRoute,
});

function CatalogSpecificationSelectionRoute() {
  const { character } = Route.useParams();

  return <CatalogSpecificationSelectionPage characterSlug={character} />;
}
