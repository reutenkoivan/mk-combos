import { createFileRoute } from "@tanstack/react-router";
import { CatalogPage } from "../../../pages/catalog/page";

export const Route = createFileRoute("/_app/$gameId/catalog")({
  component: CatalogPage,
});
