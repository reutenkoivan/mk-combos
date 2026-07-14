import { createFileRoute } from "@tanstack/react-router";
import { RoutePlaceholder } from "../../app/route-placeholder";

export const Route = createFileRoute("/_app/")({
  component: RootEntryPlaceholder,
});

function RootEntryPlaceholder() {
  return (
    <RoutePlaceholder
      description="The application shell is ready for the required first-launch flow."
      details="First-launch settings and persistence are implemented in roadmap step 25."
      pageCode="UI-PAGE-002"
      title="First launch"
    />
  );
}
