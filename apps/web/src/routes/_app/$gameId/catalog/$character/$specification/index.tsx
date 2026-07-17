import { createFileRoute } from "@tanstack/react-router";

import { CatalogPage } from "../../../../../../pages/catalog/page";
import { parseCatalogSearch } from "../../../../../../pages/catalog/search/runtime";
import type { CatalogSearch } from "../../../../../../pages/catalog/search/type";

export const Route = createFileRoute("/_app/$gameId/catalog/$character/$specification/")({
  component: CatalogResultRoute,
  validateSearch: parseCatalogSearch,
});

function CatalogResultRoute() {
  const { character, specification } = Route.useParams();
  const { settings, ...catalogSearch } = Route.useSearch();
  const preservedSearch: CatalogSearch = settings === undefined ? {} : { settings };

  return (
    <CatalogPage
      characterSlug={character}
      preservedSearch={preservedSearch}
      search={catalogSearch}
      specificationSlug={specification}
    />
  );
}
