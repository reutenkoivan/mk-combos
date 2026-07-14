import { createFileRoute } from "@tanstack/react-router";
import { RoutePlaceholder } from "../../../app/route-placeholder";

export const Route = createFileRoute("/_app/$gameId/lists")({
  component: ListsPlaceholder,
});

function ListsPlaceholder() {
  return (
    <RoutePlaceholder
      description="Named Lists routing is isolated by the active route GameId."
      details="List persistence and editing are implemented in roadmap step 27."
      pageCode="UI-PAGE-005"
      title="Named Lists"
    />
  );
}
