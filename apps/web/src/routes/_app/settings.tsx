import { createFileRoute } from "@tanstack/react-router";
import { RouteRecoveryPage } from "../../pages/route-recovery/page";
import { SettingsPage } from "../../pages/settings/page";
import { SettingsSearchSchema } from "../../pages/settings/search/schema";
import type { SettingsSearch } from "../../pages/settings/search/type";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsRoute,
  errorComponent: RouteRecoveryPage,
  validateSearch: SettingsSearchSchema,
});

function SettingsRoute() {
  const { section }: SettingsSearch = Route.useSearch();

  return <SettingsPage section={section} />;
}
