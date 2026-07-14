import { createFileRoute } from "@tanstack/react-router";
import { RoutePlaceholder } from "../../../app/route-placeholder";

export const Route = createFileRoute("/_app/$gameId/catalog")({
  component: CatalogPlaceholder,
});

function CatalogPlaceholder() {
  return (
    <RoutePlaceholder
      description="Catalog routing and the active game business entry point are connected."
      details="Catalog orchestration is implemented in roadmap step 26."
      pageCode="UI-PAGE-003"
      title="Catalog"
    />
  );
}
