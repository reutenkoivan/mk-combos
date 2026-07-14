import { createFileRoute } from "@tanstack/react-router";
import { RoutePlaceholder } from "../../../app/route-placeholder";

export const Route = createFileRoute("/_app/$gameId/builder")({
  component: BuilderPlaceholder,
});

function BuilderPlaceholder() {
  return (
    <RoutePlaceholder
      description="Builder routing is connected without carrying game-specific state across games."
      details="Builder orchestration and persistence are implemented in roadmap step 28."
      pageCode="UI-PAGE-006"
      title="Custom Combo Builder"
    />
  );
}
