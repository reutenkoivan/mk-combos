import { createFileRoute } from "@tanstack/react-router";
import { RoutePlaceholder, RouteRecoveryPage } from "../../app/route-placeholder";
import { SettingsSearchSchema } from "../../routing/settings-search/schema";
import type { SettingsSearch } from "../../routing/settings-search/type";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPlaceholder,
  errorComponent: RouteRecoveryPage,
  validateSearch: SettingsSearchSchema,
});

function SettingsPlaceholder() {
  const { section }: SettingsSearch = Route.useSearch();

  return (
    <RoutePlaceholder
      description="Settings routing and the active session game are connected."
      details={
        section === undefined
          ? "Settings, backup, and persistence are implemented in roadmap step 25."
          : `Requested section: ${section}. It will be expanded by roadmap step 25.`
      }
      pageCode="UI-PAGE-008"
      title="Settings"
    />
  );
}
