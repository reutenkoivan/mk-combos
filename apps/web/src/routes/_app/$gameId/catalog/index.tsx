import { createFileRoute } from "@tanstack/react-router";

import { CatalogCharacterSelectionPage } from "../../../../pages/catalog/page";

export const Route = createFileRoute("/_app/$gameId/catalog/")({
  component: CatalogCharacterSelectionPage,
});
